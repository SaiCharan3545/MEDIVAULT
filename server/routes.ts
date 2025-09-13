import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { BlockchainService } from "./services/blockchain";
import { AISearchService } from "./services/ai-search";
import { insertPatientSchema, insertHospitalSchema } from "@shared/schema";
import { pool } from "./db";
import bcrypt from "bcrypt";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import MemoryStore from "memorystore";

export async function registerRoutes(app: Express): Promise<Server> {
  // Security: Enforce SESSION_SECRET requirement in production
  if (process.env.NODE_ENV === "production" && !process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET environment variable must be set in production");
  }
  
  // Configure session store based on environment
  const isProduction = process.env.NODE_ENV === "production";
  const PgSession = connectPgSimple(session);
  const MemoryStoreSession = MemoryStore(session);
  
  let sessionStore;
  if (isProduction) {
    // Production: Use PostgreSQL session store for scalability and persistence
    sessionStore = new PgSession({
      pool: pool, // Use existing PostgreSQL connection
      createTableIfMissing: true,
      tableName: 'session',
      pruneSessionInterval: 60 * 15, // Prune expired sessions every 15 minutes
    });
  } else {
    // Development: Use memory store with TTL
    sessionStore = new MemoryStoreSession({
      checkPeriod: 86400000 // Prune expired entries every 24h in development
    });
  }

  // Session configuration with enhanced security
  app.use(session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || "secure-health-secret-dev-only",
    resave: false,
    saveUninitialized: false,
    rolling: true, // Reset expiration on activity
    cookie: {
      secure: isProduction, // HTTPS only in production
      httpOnly: true, // Prevent XSS access to cookies
      sameSite: isProduction ? "lax" : "lax", // CSRF protection
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
    name: "secure.session.id" // Change default session name for additional security
  }));

  // Initialize hospitals (development only - disabled in production for security)
  app.post("/api/init", async (req, res) => {
    // Security: Only allow initialization in development environment
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({ message: "Hospital initialization not allowed in production" });
    }

    try {
      const hospitalNames = ["Hospital1", "Hospital2"];
      
      for (const name of hospitalNames) {
        const existing = await storage.getHospitalByUsername(name);
        if (!existing) {
          const passwordHash = await bcrypt.hash(name, 10);
          await storage.createHospital({
            name,
            username: name,
            passwordHash
          });
        }
      }
      
      res.json({ message: "Hospitals initialized successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to initialize hospitals" });
    }
  });

  // Patient registration
  app.post("/api/patient/register", async (req, res) => {
    try {
      const validatedData = insertPatientSchema.parse(req.body);
      
      // Create blockchain data
      const blockchainData = {
        patientId: "temp-id", // Will be replaced with actual ID
        patientName: validatedData.patientName || "",
        age: validatedData.age || null,
        problemDesc: validatedData.problemDesc,
        profileDate: new Date(),
        accessData: validatedData.accessData,
        gender: validatedData.gender,
      };
      
      // Create patient
      const patient = await storage.createPatient(validatedData);
      
      // Generate blockchain hash with actual patient ID
      blockchainData.patientId = patient.id;
      const { hash } = BlockchainService.addTransaction(blockchainData);
      
      // Update patient with blockchain hash
      await storage.updatePatientRevenue(patient.id, "0.00");
      
      res.json({ 
        success: true, 
        patientId: patient.id,
        patientNumber: patient.patientNumber,
        blockchainHash: hash,
        message: `Profile created successfully. Patient #${patient.patientNumber}` 
      });
    } catch (error) {
      console.error("Patient registration error:", error);
      res.status(400).json({ message: "Failed to create patient profile" });
    }
  });

  // Patient login
  app.post("/api/patient/login", async (req, res) => {
    try {
      const { patientId, patientNumber, contactNo } = req.body;
      let patient;
      
      // Determine login method based on provided fields
      if (patientNumber && contactNo) {
        // New method: Patient number + contact for security
        const numericPatientNumber = parseInt(patientNumber.toString());
        if (isNaN(numericPatientNumber)) {
          return res.status(400).json({ message: "Invalid patient number format" });
        }
        
        patient = await storage.getPatientByNumberAndContact(numericPatientNumber, contactNo.trim());
        if (!patient) {
          return res.status(404).json({ message: "Patient not found. Please check your patient number and contact information." });
        }
      } else if (patientId) {
        // Legacy method: UUID-based login (backward compatibility)
        patient = await storage.getPatient(patientId);
        if (!patient) {
          return res.status(404).json({ message: "Patient not found" });
        }
      } else {
        return res.status(400).json({ 
          message: "Please provide either Patient Number + Contact Number or Patient ID" 
        });
      }
      
      res.json({ success: true, patient });
    } catch (error) {
      console.error("Patient login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Patient ID lookup
  app.post("/api/patient/lookup", async (req, res) => {
    try {
      const { patientName, contactNo } = req.body;
      
      if (!patientName || !contactNo) {
        return res.status(400).json({ message: "Patient name and contact number are required" });
      }
      
      // Find patient by exact name and contact match
      const patient = await storage.findPatientByNameAndContact(patientName.trim(), contactNo.trim());
      
      if (!patient) {
        return res.status(404).json({ message: "No patient found with the provided information" });
      }
      
      res.json({ 
        success: true, 
        patientId: patient.id,
        patientNumber: patient.patientNumber,
        patientName: patient.patientName 
      });
    } catch (error) {
      console.error("Patient lookup error:", error);
      res.status(500).json({ message: "Lookup failed" });
    }
  });

  // Get patient access logs
  app.get("/api/patient/:id/access-logs", async (req, res) => {
    try {
      const { id } = req.params;
      const logs = await storage.getAccessLogsByPatient(id);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch access logs" });
    }
  });

  // Hospital login
  app.post("/api/hospital/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const hospital = await storage.getHospitalByUsername(username);
      
      if (!hospital) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const isValidPassword = await bcrypt.compare(password, hospital.passwordHash);
      
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Security: Regenerate session ID to prevent session fixation attacks
      await new Promise<void>((resolve, reject) => {
        req.session.regenerate((err) => {
          if (err) {
            console.error("Session regeneration failed:", err);
            reject(err);
          } else {
            resolve();
          }
        });
      });
      
      // Store hospital session data after regeneration
      (req.session as any).hospitalId = hospital.id;
      (req.session as any).hospitalName = hospital.name;
      
      res.json({ 
        success: true, 
        hospital: { 
          id: hospital.id, 
          name: hospital.name, 
          username: hospital.username 
        } 
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Hospital search
  app.post("/api/hospital/search", async (req, res) => {
    try {
      const { query } = req.body;
      const hospitalId = (req.session as any)?.hospitalId;
      const hospitalName = (req.session as any)?.hospitalName;
      
      if (!hospitalId || !hospitalName) {
        return res.status(401).json({ message: "Hospital not authenticated" });
      }
      
      if (!query || typeof query !== "string") {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      // Search patients by condition
      const patients = await storage.searchPatientsByCondition(query);
      
      const results = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      for (const patient of patients) {
        let allowed = false;
        let rewardGiven = false;
        
        // Check if hospital has access permission
        if (patient.accessData) {
          const allowedHospitals = patient.accessData.split(" ");
          allowed = allowedHospitals.includes(hospitalName);
        }
        
        if (allowed) {
          // Check if reward already given today
          const existingReward = await storage.getRecentRewardForHospitalPatient(
            hospitalId, 
            patient.id, 
            today
          );
          
          if (!existingReward) {
            // Give reward
            const currentRevenue = parseFloat(patient.revenue || "0");
            const newRevenue = (currentRevenue + 0.5).toFixed(2);
            await storage.updatePatientRevenue(patient.id, newRevenue);
            rewardGiven = true;
          }
        }
        
        // Log access attempt
        await storage.createAccessLog({
          patientId: patient.id,
          hospitalId,
          allowed,
          rewardGiven,
          searchQuery: query
        });
        
        // Use AI to analyze search relevance
        let relevanceScore = 0;
        if (patient.problemDesc) {
          try {
            const aiResult = await AISearchService.analyzeSearchRelevance(query, patient.problemDesc);
            relevanceScore = aiResult.relevanceScore;
          } catch (error) {
            console.error("AI analysis failed, using basic matching");
          }
        }
        
        results.push({
          id: patient.id,
          name: allowed ? patient.patientName : "Access Denied",
          age: allowed ? patient.age : null,
          gender: allowed ? patient.gender : null,
          contact: allowed ? patient.contactNo : null,
          problem: allowed ? patient.problemDesc : "Patient has not granted access to this hospital",
          allowed,
          rewardGiven,
          revenue: allowed ? parseFloat(patient.revenue || "0") : 0,
          relevanceScore
        });
      }
      
      // Sort by relevance score (highest first)
      results.sort((a, b) => b.relevanceScore - a.relevanceScore);
      
      res.json({ results, query });
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ message: "Search failed" });
    }
  });

  // Hospital logout
  app.post("/api/hospital/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  // Get hospital session
  app.get("/api/hospital/session", (req, res) => {
    const hospitalId = (req.session as any)?.hospitalId;
    const hospitalName = (req.session as any)?.hospitalName;
    
    if (hospitalId && hospitalName) {
      res.json({ 
        authenticated: true, 
        hospital: { id: hospitalId, name: hospitalName } 
      });
    } else {
      res.json({ authenticated: false });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
