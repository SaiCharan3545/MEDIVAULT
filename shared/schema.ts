import { sql } from "drizzle-orm";
import {
  pgTable,
  varchar,
  text,
  integer,
  decimal,
  timestamp,
  boolean,
  jsonb,
  index
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Hospitals table
export const hospitals = pgTable("hospitals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 100 }).notNull().unique(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Patients table
export const patients = pgTable("patients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientNumber: integer("patient_number").unique(),
  patientName: varchar("patient_name", { length: 200 }),
  age: integer("age"),
  problemDesc: text("problem_desc"),
  profileDate: timestamp("profile_date").defaultNow(),
  gender: varchar("gender", { length: 20 }),
  contactNo: varchar("contact_no", { length: 50 }),
  address: text("address"),
  accessData: text("access_data"), // space-separated hospital names
  revenue: decimal("revenue", { precision: 10, scale: 2 }).default("0.00"),
  blockchainHash: varchar("blockchain_hash", { length: 256 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Access logs table
export const accessLogs = pgTable("access_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull(),
  hospitalId: varchar("hospital_id").notNull(),
  accessTime: timestamp("access_time").defaultNow(),
  allowed: boolean("allowed").notNull(),
  rewardGiven: boolean("reward_given").default(false),
  searchQuery: text("search_query"),
});

// Relations
export const hospitalsRelations = relations(hospitals, ({ many }) => ({
  accessLogs: many(accessLogs),
}));

export const patientsRelations = relations(patients, ({ many }) => ({
  accessLogs: many(accessLogs),
}));

export const accessLogsRelations = relations(accessLogs, ({ one }) => ({
  patient: one(patients, {
    fields: [accessLogs.patientId],
    references: [patients.id],
  }),
  hospital: one(hospitals, {
    fields: [accessLogs.hospitalId],
    references: [hospitals.id],
  }),
}));

// Insert schemas
export const insertHospitalSchema = createInsertSchema(hospitals).omit({
  id: true,
  createdAt: true,
});

export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
  patientNumber: true,
  createdAt: true,
  updatedAt: true,
  blockchainHash: true,
});

export const insertAccessLogSchema = createInsertSchema(accessLogs).omit({
  id: true,
  accessTime: true,
});

// Types
export type Hospital = typeof hospitals.$inferSelect;
export type InsertHospital = z.infer<typeof insertHospitalSchema>;

export type Patient = typeof patients.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;

export type AccessLog = typeof accessLogs.$inferSelect;
export type InsertAccessLog = z.infer<typeof insertAccessLogSchema>;
