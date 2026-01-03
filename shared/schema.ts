import { pgTable, text, serial, integer, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === OFFICE: Financials & Market ===
export const ledger = pgTable("ledger", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'debit' | 'credit'
  category: text("category").notNull(), // 'market', 'fund', 'asset', 'liability'
  subcategory: text("subcategory"), // 'StationState', 'MarketPlace', 'DoubleEntry'
  detail: text("detail"), // 'Supply|Demand', 'Means|Ends', 'Deficiency|Sufficiency', etc.
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  date: timestamp("date").defaultNow(),
});

// === FIELD: Supply Chain & HR ===
export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sku: text("sku").notNull(),
  quantity: integer("quantity").notNull().default(0),
  category: text("category").notNull(), // 'material', 'product', 'asset'
  subcategory: text("subcategory"), // 'PublicRelation', 'PurchaseOrder', 'TimeSheet'
  detail: text("detail"), // 'Endorsement', 'Procurement', 'Enrollment', etc.
  status: text("status").notNull(), // 'sourcing', 'provisioning', 'stocked'
  location: text("location"),
});

export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  department: text("department").notNull(),
  subcategory: text("subcategory"), // 'Personnel'
  status: text("status").notNull(), // 'recruiting', 'onboarding', 'active', 'vacation'
  email: text("email").notNull(),
});

// === OUTFIT: Operations ===
export const operations = pgTable("operations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'manufacturing', 'trading', 'prospecting'
  sector: text("sector").notNull(), // 'residential', 'commercial', 'industrial'
  status: text("status").notNull(), // 'production', 'distribution', 'consumption'
  progress: integer("progress").default(0),
});

// === AGENDA: Calendar & Work ===
export const agenda = pgTable("agenda", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(), // 'project', 'task', 'meeting', 'space'
  subcategory: text("subcategory"), // 'Date', 'Work', 'Talk'
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  description: text("description"),
});

// === SCORE: Invoicing & Payments ===
export const score = pgTable("score", {
  id: serial("id").primaryKey(),
  clientName: text("client_name").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull(), // 'estimate', 'invoice', 'receipt', 'paid'
  type: text("type").notNull(), // 'withdrawal', 'deposit', 'appraisal', 'billing'
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// === SCHEMAS ===
export const insertLedgerSchema = createInsertSchema(ledger).omit({ id: true, date: true });
export const insertInventorySchema = createInsertSchema(inventory).omit({ id: true });
export const insertEmployeeSchema = createInsertSchema(employees).omit({ id: true });
export const insertOperationSchema = createInsertSchema(operations).omit({ id: true });
export const insertAgendaSchema = createInsertSchema(agenda).omit({ id: true });
export const insertScoreSchema = createInsertSchema(score).omit({ id: true, createdAt: true });

// === TYPES ===
export type LedgerEntry = typeof ledger.$inferSelect;
export type InsertLedgerEntry = z.infer<typeof insertLedgerSchema>;

export type InventoryItem = typeof inventory.$inferSelect;
export type InsertInventoryItem = z.infer<typeof insertInventorySchema>;

export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;

export type Operation = typeof operations.$inferSelect;
export type InsertOperation = z.infer<typeof insertOperationSchema>;

export type AgendaEntry = typeof agenda.$inferSelect;
export type InsertAgendaEntry = z.infer<typeof insertAgendaSchema>;

export type ScoreEntry = typeof score.$inferSelect;
export type InsertScoreEntry = z.infer<typeof insertScoreSchema>;
