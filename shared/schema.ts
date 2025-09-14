import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Argo Float Table
export const argoFloats = pgTable("argo_floats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  floatId: text("float_id").notNull().unique(), // e.g., "ARGO001"
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  status: text("status").notNull().default("active"), // active, inactive
  deploymentDate: timestamp("deployment_date").defaultNow(),
  lastUpdate: timestamp("last_update").defaultNow(),
  region: text("region"), // e.g., "Indian Ocean"
});

// Oceanographic Measurements Table
export const measurements = pgTable("measurements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  floatId: text("float_id").notNull().references(() => argoFloats.floatId),
  depth: real("depth").notNull(), // meters
  temperature: real("temperature").notNull(), // Celsius
  salinity: real("salinity").notNull(), // PSU (Practical Salinity Units)
  pressure: real("pressure"), // decibars
  recordedAt: timestamp("recorded_at").defaultNow(),
  cycleNumber: integer("cycle_number"), // Argo cycle number
});

// Chat Query History Table
export const chatQueries = pgTable("chat_queries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userQuery: text("user_query").notNull(),
  generatedSql: text("generated_sql"),
  response: text("response"),
  queryType: text("query_type"), // temperature, salinity, location, general
  resultData: jsonb("result_data"), // Store query results
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod Schemas
export const insertFloatSchema = createInsertSchema(argoFloats).omit({
  id: true,
  deploymentDate: true,
  lastUpdate: true,
});

export const insertMeasurementSchema = createInsertSchema(measurements).omit({
  id: true,
  recordedAt: true,
});

export const insertChatQuerySchema = createInsertSchema(chatQueries).omit({
  id: true,
  createdAt: true,
});

// Types
export type ArgoFloat = typeof argoFloats.$inferSelect;
export type InsertArgoFloat = z.infer<typeof insertFloatSchema>;
export type Measurement = typeof measurements.$inferSelect;
export type InsertMeasurement = z.infer<typeof insertMeasurementSchema>;
export type ChatQuery = typeof chatQueries.$inferSelect;
export type InsertChatQuery = z.infer<typeof insertChatQuerySchema>;

// Legacy user schema (keeping for auth if needed later)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
