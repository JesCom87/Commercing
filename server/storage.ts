import { db } from "./db";
import {
  ledger, inventory, employees, operations, events, invoices, marketing, marketData,
  type LedgerEntry, type InventoryItem, type Employee,
  type Operation, type Event, type Invoice, type Marketing, type MarketData
} from "@shared/schema";
import { z } from "zod";

export interface IStorage {
  getLedger(): Promise<LedgerEntry[]>;
  createLedgerEntry(entry: any): Promise<LedgerEntry>;
  getMarketData(): Promise<MarketData[]>;

  getInventory(): Promise<InventoryItem[]>;
  createInventoryItem(item: any): Promise<InventoryItem>;
  getEmployees(): Promise<Employee[]>;
  createEmployee(employee: any): Promise<Employee>;
  getMarketing(): Promise<Marketing[]>;

  getOperations(): Promise<Operation[]>;
  createOperation(op: any): Promise<Operation>;

  getEvents(): Promise<Event[]>;
  createEvent(event: any): Promise<Event>;

  getInvoices(): Promise<Invoice[]>;
  createInvoice(invoice: any): Promise<Invoice>;
}

export class DatabaseStorage implements IStorage {
  async getLedger(): Promise<LedgerEntry[]> { return await db.select().from(ledger); }
  async createLedgerEntry(entry: any): Promise<LedgerEntry> {
    const [created] = await db.insert(ledger).values(entry).returning();
    return created;
  }
  async getMarketData(): Promise<MarketData[]> { return await db.select().from(marketData); }

  async getInventory(): Promise<InventoryItem[]> { return await db.select().from(inventory); }
  async createInventoryItem(item: any): Promise<InventoryItem> {
    const [created] = await db.insert(inventory).values(item).returning();
    return created;
  }
  async getEmployees(): Promise<Employee[]> { return await db.select().from(employees); }
  async createEmployee(employee: any): Promise<Employee> {
    const [created] = await db.insert(employees).values(employee).returning();
    return created;
  }
  async getMarketing(): Promise<Marketing[]> { return await db.select().from(marketing); }

  async getOperations(): Promise<Operation[]> { return await db.select().from(operations); }
  async createOperation(op: any): Promise<Operation> {
    const [created] = await db.insert(operations).values(op).returning();
    return created;
  }

  async getEvents(): Promise<Event[]> { return await db.select().from(events); }
  async createEvent(event: any): Promise<Event> {
    const [created] = await db.insert(events).values(event).returning();
    return created;
  }

  async getInvoices(): Promise<Invoice[]> { return await db.select().from(invoices); }
  async createInvoice(invoice: any): Promise<Invoice> {
    const [created] = await db.insert(invoices).values(invoice).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
