import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === OFFICE: Financials & Market ===
export const ledger = pgTable("ledger", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'debit' | 'credit'
  category: text("category").notNull(), // 'market', 'fund', 'asset', 'liability'
  subcategory: text("subcategory"), // 'Accounts', 'Books', 'Units'
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  date: timestamp("date").defaultNow(),
});

export const marketData = pgTable("market_data", {
  id: serial("id").primaryKey(),
  indicator: text("indicator").notNull(), // 'Supply', 'Demand', 'Means', 'Ends'
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  type: text("type").notNull(), // 'Market Forces', 'Lineal Curves', 'Circular Flow'
  date: timestamp("date").defaultNow(),
});

// === FIELD: Marketing, Supply Chain & HR ===
export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sku: text("sku").notNull(),
  quantity: integer("quantity").notNull().default(0),
  category: text("category").notNull(), // 'material', 'product', 'asset'
  status: text("status").notNull(), // 'Sourcing', 'Bearing', 'Provisioning', 'Logisting'
  location: text("location"),
});

export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  department: text("department").notNull(),
  status: text("status").notNull(), // 'Recruiting', 'Onboarding', 'Training', 'Educating'
  email: text("email").notNull(),
});

export const marketing = pgTable("marketing", {
  id: serial("id").primaryKey(),
  channel: text("channel").notNull(),
  type: text("type").notNull(), // 'PublicRelation', 'Endorsement', 'Environment', 'Emplacement'
  action: text("action").notNull(), // 'Promoting', 'Advertising', 'Scanning', 'Auditing'
  status: text("status").notNull(),
});

// === OUTFIT: Operations ===
export const operations = pgTable("operations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'Manufacturing', 'Trading', 'Prospecting'
  sector: text("sector").notNull(), // 'Residential', 'Commercial', 'Industrial'
  status: text("status").notNull(), // 'Production', 'Distribution', 'Consumption'
  progress: integer("progress").default(0),
});

// === AGENDA: Calendar & Work ===
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(), // 'Date', 'Work', 'Talk'
  type: text("type").notNull(), // 'Calendar', 'Clock', 'Projects', 'Tasks', 'Spaces', 'Rooms'
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  description: text("description"),
});

// === SCORE: Invoicing & Payments ===
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  clientName: text("client_name").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(), // 'Appraisal', 'Billing', 'Payment'
  status: text("status").notNull(), // 'Estimate', 'Invoice', 'Receipt', 'Withdrawal', 'Deposit'
  type: text("type").notNull(), // 'Gain'
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// === SCHEMAS ===
export const insertLedgerSchema = createInsertSchema(ledger).omit({ id: true, date: true });
export const insertMarketDataSchema = createInsertSchema(marketData).omit({ id: true, date: true });
export const insertInventorySchema = createInsertSchema(inventory).omit({ id: true });
export const insertEmployeeSchema = createInsertSchema(employees).omit({ id: true });
export const insertMarketingSchema = createInsertSchema(marketing).omit({ id: true });
export const insertOperationSchema = createInsertSchema(operations).omit({ id: true });
export const insertEventSchema = createInsertSchema(events).omit({ id: true });
export const insertInvoiceSchema = createInsertSchema(invoices).omit({ id: true, createdAt: true });

// === TYPES ===
export type LedgerEntry = typeof ledger.$inferSelect;
export type MarketData = typeof marketData.$inferSelect;
export type InventoryItem = typeof inventory.$inferSelect;
export type Employee = typeof employees.$inferSelect;
export type MarketingCampaign = typeof marketing.$inferSelect;
export type Operation = typeof operations.$inferSelect;
export type Event = typeof events.$inferSelect;
export type Invoice = typeof invoices.$inferSelect;
