import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === OFFICE: Financials & Market ===
export const ledger = pgTable("ledger", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'debit' | 'credit'
  category: text("category").notNull(), // 'market', 'fund', 'asset', 'liability'
  subcategory: text("subcategory"), // 'supply', 'demand', 'means', 'ends', etc.
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  date: timestamp("date").defaultNow(),
});

export const marketData = pgTable("market_data", {
  id: serial("id").primaryKey(),
  indicator: text("indicator").notNull(), // 'supply', 'demand', 'bearish', 'bullish'
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  label: text("label").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// === FIELD: Supply Chain, HR & Marketing ===
export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sku: text("sku").notNull(),
  quantity: integer("quantity").notNull().default(0),
  category: text("category").notNull(), // 'material', 'product', 'asset'
  status: text("status").notNull(), // 'procurement', 'attainment', 'consignment'
  substatus: text("substatus"), // 'sourcing', 'provisioning', 'listing', etc.
  location: text("location"),
});

export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  department: text("department").notNull(),
  status: text("status").notNull(), // 'enrollment', 'endearment', 'engagement'
  substatus: text("substatus"), // 'recruiting', 'training', 'vacationing', etc.
  email: text("email").notNull(),
});

export const marketing = pgTable("marketing", {
  id: serial("id").primaryKey(),
  channel: text("channel").notNull(),
  type: text("type").notNull(), // 'endorsement', 'environment', 'emplacement'
  action: text("action").notNull(), // 'promoting', 'scanning', 'researching', etc.
  status: text("status").notNull(),
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
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(), // 'date', 'work', 'talk'
  type: text("type").notNull(), // 'calendar', 'project', 'space', etc.
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  description: text("description"),
});

// === SCORE: Invoicing & Payments ===
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  clientName: text("client_name").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(), // 'appraisal', 'billing', 'payment'
  status: text("status").notNull(), // 'estimate', 'invoice', 'receipt', 'withdrawal', 'deposit'
  createdAt: timestamp("created_at").defaultNow(),
});

// === SCHEMAS ===
export const insertLedgerSchema = createInsertSchema(ledger).omit({ id: true, date: true });
export const insertMarketDataSchema = createInsertSchema(marketData).omit({ id: true, timestamp: true });
export const insertInventorySchema = createInsertSchema(inventory).omit({ id: true });
export const insertEmployeeSchema = createInsertSchema(employees).omit({ id: true });
export const insertMarketingSchema = createInsertSchema(marketing).omit({ id: true });
export const insertOperationSchema = createInsertSchema(operations).omit({ id: true });
export const insertEventSchema = createInsertSchema(events).omit({ id: true });
export const insertInvoiceSchema = createInsertSchema(invoices).omit({ id: true, createdAt: true });

// === TYPES ===
export type LedgerEntry = typeof ledger.$inferSelect;
export type InventoryItem = typeof inventory.$inferSelect;
export type Employee = typeof employees.$inferSelect;
export type Operation = typeof operations.$inferSelect;
export type Event = typeof events.$inferSelect;
export type Invoice = typeof invoices.$inferSelect;
export type Marketing = typeof marketing.$inferSelect;
export type MarketData = typeof marketData.$inferSelect;
