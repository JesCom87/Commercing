import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // === OFFICE ===
  app.get(api.office.listLedger.path, async (_req, res) => {
    const data = await storage.getLedger();
    res.json(data);
  });
  app.post(api.office.createLedgerEntry.path, async (req, res) => {
    try {
      const input = api.office.createLedgerEntry.input.parse(req.body);
      const entry = await storage.createLedgerEntry(input);
      res.status(201).json(entry);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // === FIELD ===
  app.get(api.field.listInventory.path, async (_req, res) => {
    const data = await storage.getInventory();
    res.json(data);
  });
  app.post(api.field.createInventoryItem.path, async (req, res) => {
    try {
      const input = api.field.createInventoryItem.input.parse(req.body);
      const item = await storage.createInventoryItem(input);
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app.get(api.field.listEmployees.path, async (_req, res) => {
    const data = await storage.getEmployees();
    res.json(data);
  });
  app.post(api.field.createEmployee.path, async (req, res) => {
    try {
      const input = api.field.createEmployee.input.parse(req.body);
      const emp = await storage.createEmployee(input);
      res.status(201).json(emp);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // === OUTFIT ===
  app.get(api.outfit.listOperations.path, async (_req, res) => {
    const data = await storage.getOperations();
    res.json(data);
  });
  app.post(api.outfit.createOperation.path, async (req, res) => {
    try {
      const input = api.outfit.createOperation.input.parse(req.body);
      const op = await storage.createOperation(input);
      res.status(201).json(op);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // === AGENDA ===
  app.get(api.agenda.listEvents.path, async (_req, res) => {
    const data = await storage.getAgenda();
    res.json(data);
  });
  app.post(api.agenda.createEvent.path, async (req, res) => {
    try {
      const input = api.agenda.createEvent.input.parse({
        ...req.body,
        startTime: new Date(req.body.startTime),
        endTime: new Date(req.body.endTime),
      });
      const event = await storage.createAgendaEntry(input);
      res.status(201).json(event);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // === SCORE ===
  app.get(api.score.listInvoices.path, async (_req, res) => {
    const data = await storage.getScore();
    res.json(data);
  });
  app.post(api.score.createInvoice.path, async (req, res) => {
    try {
      const input = api.score.createInvoice.input.parse(req.body);
      const inv = await storage.createScoreEntry(input);
      res.status(201).json(inv);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // === MEND ===
  app.get(api.mend.listEntries.path, async (_req, res) => {
    const data = await storage.getMend();
    res.json(data);
  });
  app.post(api.mend.createEntry.path, async (req, res) => {
    try {
      const input = api.mend.createEntry.input.parse(req.body);
      const entry = await storage.createMendEntry(input);
      res.status(201).json(entry);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Initial seeding if empty
  await seedData();

  return httpServer;
}

async function seedData() {
  const ledgerEntries = await storage.getLedger();
  if (ledgerEntries.length === 0) {
    await storage.createLedgerEntry({
      type: 'credit',
      category: 'market',
      subcategory: 'StationState',
      detail: 'Supply|Demand',
      amount: "5000.00",
      description: 'Initial Market Position'
    });
    await storage.createLedgerEntry({
      type: 'debit',
      category: 'finance',
      subcategory: 'MarketPlace',
      detail: 'Cycles (Bearish|Bullish)',
      amount: "1500.00",
      description: 'Capital Allocation'
    });
  }

  const inventoryItems = await storage.getInventory();
  if (inventoryItems.length === 0) {
    await storage.createInventoryItem({
      name: 'Primary Materiel',
      sku: 'FIELD-PO-001',
      quantity: 100,
      category: 'material',
      subcategory: 'PurchaseOrder',
      detail: 'Procurement (Sourcing|Bearing)',
      status: 'stocked',
      location: 'Main Hub'
    });
  }
}
