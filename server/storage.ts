import { db } from "./db";
import {
  ledger, inventory, employees, operations, agenda, score,
  type LedgerEntry, type InventoryItem, type Employee,
  type Operation, type AgendaEntry, type ScoreEntry,
  type InsertLedgerEntry, 
  type InsertInventoryItem,
  type InsertEmployee,
  type InsertOperation,
  type InsertAgendaEntry,
  type InsertScoreEntry
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getLedger(): Promise<LedgerEntry[]>;
  createLedgerEntry(entry: InsertLedgerEntry): Promise<LedgerEntry>;
  getInventory(): Promise<InventoryItem[]>;
  createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;
  getEmployees(): Promise<Employee[]>;
  createEmployee(emp: InsertEmployee): Promise<Employee>;
  getOperations(): Promise<Operation[]>;
  createOperation(op: InsertOperation): Promise<Operation>;
  getAgenda(): Promise<AgendaEntry[]>;
  createAgendaEntry(entry: InsertAgendaEntry): Promise<AgendaEntry>;
  getScore(): Promise<ScoreEntry[]>;
  createScoreEntry(entry: InsertScoreEntry): Promise<ScoreEntry>;
}

export class DatabaseStorage implements IStorage {
  async getLedger() { return await db.select().from(ledger); }
  async createLedgerEntry(entry: InsertLedgerEntry) {
    const [created] = await db.insert(ledger).values(entry).returning();
    return created;
  }
  async getInventory() { return await db.select().from(inventory); }
  async createInventoryItem(item: InsertInventoryItem) {
    const [created] = await db.insert(inventory).values(item).returning();
    return created;
  }
  async getEmployees() { return await db.select().from(employees); }
  async createEmployee(emp: InsertEmployee) {
    const [created] = await db.insert(employees).values(emp).returning();
    return created;
  }
  async getOperations() { return await db.select().from(operations); }
  async createOperation(op: InsertOperation) {
    const [created] = await db.insert(operations).values(op).returning();
    return created;
  }
  async getAgenda() { return await db.select().from(agenda); }
  async createAgendaEntry(entry: InsertAgendaEntry) {
    const [created] = await db.insert(agenda).values(entry).returning();
    return created;
  }
  async getScore() { return await db.select().from(score); }
  async createScoreEntry(entry: InsertScoreEntry) {
    const [created] = await db.insert(score).values(entry).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
