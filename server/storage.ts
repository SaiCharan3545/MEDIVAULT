import {
  hospitals,
  patients,
  accessLogs,
  type Hospital,
  type InsertHospital,
  type Patient,
  type InsertPatient,
  type AccessLog,
  type InsertAccessLog,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, desc, ilike } from "drizzle-orm";

export interface IStorage {
  // Hospital operations
  getHospitalByUsername(username: string): Promise<Hospital | undefined>;
  createHospital(hospital: InsertHospital): Promise<Hospital>;
  
  // Patient operations
  getPatient(id: string): Promise<Patient | undefined>;
  getPatientByNumber(patientNumber: number): Promise<Patient | undefined>;
  getPatientByNumberAndContact(patientNumber: number, contactNo: string): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatientRevenue(id: string, revenue: string): Promise<void>;
  searchPatientsByCondition(query: string): Promise<Patient[]>;
  
  // Access log operations
  createAccessLog(accessLog: InsertAccessLog): Promise<AccessLog>;
  getAccessLogsByPatient(patientId: string): Promise<AccessLog[]>;
  getRecentRewardForHospitalPatient(hospitalId: string, patientId: string, since: Date): Promise<AccessLog | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getHospitalByUsername(username: string): Promise<Hospital | undefined> {
    const [hospital] = await db
      .select()
      .from(hospitals)
      .where(eq(hospitals.username, username));
    return hospital;
  }

  async createHospital(hospital: InsertHospital): Promise<Hospital> {
    const [newHospital] = await db
      .insert(hospitals)
      .values(hospital)
      .returning();
    return newHospital;
  }

  async getAllHospitals(): Promise<Hospital[]> {
    return await db
      .select()
      .from(hospitals);
  }

  async getPatient(id: string): Promise<Patient | undefined> {
    const [patient] = await db
      .select()
      .from(patients)
      .where(eq(patients.id, id));
    return patient;
  }

  async getPatientByNumber(patientNumber: number): Promise<Patient | undefined> {
    const [patient] = await db
      .select()
      .from(patients)
      .where(eq(patients.patientNumber, patientNumber));
    return patient;
  }

  async getPatientByNumberAndContact(patientNumber: number, contactNo: string): Promise<Patient | undefined> {
    const [patient] = await db
      .select()
      .from(patients)
      .where(
        and(
          eq(patients.patientNumber, patientNumber),
          eq(patients.contactNo, contactNo)
        )
      );
    return patient;
  }

  async createPatient(patient: InsertPatient): Promise<Patient> {
    const [newPatient] = await db
      .insert(patients)
      .values(patient)
      .returning();
    return newPatient;
  }

  async updatePatientRevenue(id: string, revenue: string): Promise<void> {
    await db
      .update(patients)
      .set({ revenue, updatedAt: new Date() })
      .where(eq(patients.id, id));
  }

  async searchPatientsByCondition(query: string): Promise<Patient[]> {
    return await db
      .select()
      .from(patients)
      .where(ilike(patients.problemDesc, `%${query}%`));
  }

  async findPatientByNameAndContact(patientName: string, contactNo: string): Promise<Patient | undefined> {
    const [patient] = await db
      .select()
      .from(patients)
      .where(
        and(
          eq(patients.patientName, patientName),
          eq(patients.contactNo, contactNo)
        )
      );
    return patient;
  }

  async createAccessLog(accessLog: InsertAccessLog): Promise<AccessLog> {
    const [newLog] = await db
      .insert(accessLogs)
      .values(accessLog)
      .returning();
    return newLog;
  }

  async getAccessLogsByPatient(patientId: string): Promise<AccessLog[]> {
    return await db
      .select()
      .from(accessLogs)
      .where(eq(accessLogs.patientId, patientId))
      .orderBy(desc(accessLogs.accessTime));
  }

  async getRecentRewardForHospitalPatient(
    hospitalId: string,
    patientId: string,
    since: Date
  ): Promise<AccessLog | undefined> {
    const [log] = await db
      .select()
      .from(accessLogs)
      .where(
        and(
          eq(accessLogs.hospitalId, hospitalId),
          eq(accessLogs.patientId, patientId),
          eq(accessLogs.rewardGiven, true),
          gte(accessLogs.accessTime, since)
        )
      );
    return log;
  }
}

export const storage = new DatabaseStorage();
