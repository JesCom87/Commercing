import { db } from "./db";
import {
  ledger, inventory, employees, operations, events, invoices,
  type InsertLedgerEntry, type InsertInventoryItem, type InsertEmployee,
  type InsertOperation, type InsertEvent, type InsertInvoice,
  type LedgerEntry, type InventoryItem, type Employee,
  type Operation, type Event, type Invoice
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Office
  getLedger(): Promise<LedgerEntry[]>;
  createLedgerEntry(entry: InsertLedgerEntry): Promise<LedgerEntry>;

  // Field
  getInventory(): Promise<InventoryItem[]>;
  createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;
  getEmployees(): Promise<Employee[]>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;

  // Outfit
  getOperations(): Promise<Operation[]>;
  createOperation(op: InsertOperation): Promise<Operation>;

  // Agenda
  getEvents(): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;

  // Score
  getInvoices(): Promise<Invoice[]>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
}

export class DatabaseStorage implements IStorage {
  // Office
  async getLedger(): Promise<LedgerEntry[]> {
    return await db.select().from(ledger);
  }
  async createLedgerEntry(entry: InsertLedgerEntry): Promise<LedgerEntry> {
    const [created] = await db.insert(ledger).values(entry).returning();
    return created;
  }

  // Field
  async getInventory(): Promise<InventoryItem[]> {
    return await db.select().from(inventory);
  }
  async createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem> {
    const [created] = await db.insert(inventory).values(item).returning();
    return created;
  }
  async getEmployees(): Promise<Employee[]> {
    return await db.select().from(employees);
  }
  async createEmployee(employee: InsertEmployee): Promise<Employee> {
    const [created] = await db.insert(employees).values(employee).returning();
    return created;
  }

  // Outfit
  async getOperations(): Promise<Operation[]> {
    return await db.select().from(operations);
  }
  async createOperation(op: InsertOperation): Promise<Operation> {
    const [created] = await db.insert(operations).values(op).returning();
    return created;
  }

  // Agenda
  async getEvents(): Promise<Event[]> {
    return await db.select().from(events);
  }
  async createEvent(event: InsertEvent): Promise<Event> {
    const [created] = await db.insert(events).values(event).returning();
    return created;
  }

  // Score
  async getInvoices(): Promise<Invoice[]> {
    return await db.select().from(invoices);
  }
  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const [created] = await db.insert(invoices).values(invoice).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
