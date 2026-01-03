import { db } from "./db";
import {
  ledger, fieldResources, outfitOperations, agendaItems, scoreItems,
  type LedgerEntry, type FieldResource, type OutfitOperation, 
  type AgendaItem, type ScoreItem,
  type InsertLedgerEntry, type InsertFieldResource, type InsertOutfitOperation,
  type InsertAgendaItem, type InsertScoreItem
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getLedger(): Promise<LedgerEntry[]>;
  createLedger(data: any): Promise<LedgerEntry>;
  
  getFieldResources(): Promise<FieldResource[]>;
  createFieldResource(data: any): Promise<FieldResource>;
  
  getOutfitOperations(): Promise<OutfitOperation[]>;
  createOutfitOperation(data: any): Promise<OutfitOperation>;
  
  getAgendaItems(): Promise<AgendaItem[]>;
  createAgendaItem(data: any): Promise<AgendaItem>;
  
  getScoreItems(): Promise<ScoreItem[]>;
  createScoreItem(data: any): Promise<ScoreItem>;
}

export class DatabaseStorage implements IStorage {
  async getLedger() { return await db.select().from(ledger); }
  async createLedger(data: any) {
    const [res] = await db.insert(ledger).values(data).returning();
    return res;
  }

  async getFieldResources() { return await db.select().from(fieldResources); }
  async createFieldResource(data: any) {
    const [res] = await db.insert(fieldResources).values(data).returning();
    return res;
  }

  async getOutfitOperations() { return await db.select().from(outfitOperations); }
  async createOutfitOperation(data: any) {
    const [res] = await db.insert(outfitOperations).values(data).returning();
    return res;
  }

  async getAgendaItems() { return await db.select().from(agendaItems); }
  async createAgendaItem(data: any) {
    const [res] = await db.insert(agendaItems).values(data).returning();
    return res;
  }

  async getScoreItems() { return await db.select().from(scoreItems); }
  async createScoreItem(data: any) {
    const [res] = await db.insert(scoreItems).values(data).returning();
    return res;
  }
}

export const storage = new DatabaseStorage();
