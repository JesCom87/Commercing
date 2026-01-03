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
      throw err;
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
      throw err;
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
      throw err;
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
      throw err;
    }
  });

  // === AGENDA ===
  app.get(api.agenda.listEvents.path, async (_req, res) => {
    const data = await storage.getEvents();
    res.json(data);
  });
  app.post(api.agenda.createEvent.path, async (req, res) => {
    try {
      const input = api.agenda.createEvent.input.parse({
        ...req.body,
        startTime: new Date(req.body.startTime),
        endTime: new Date(req.body.endTime),
      });
      const event = await storage.createEvent(input);
      res.status(201).json(event);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
        return;
      }
      throw err;
    }
  });

  // === SCORE ===
  app.get(api.score.listInvoices.path, async (_req, res) => {
    const data = await storage.getInvoices();
    res.json(data);
  });
  app.post(api.score.createInvoice.path, async (req, res) => {
    try {
      const input = api.score.createInvoice.input.parse(req.body);
      const inv = await storage.createInvoice(input);
      res.status(201).json(inv);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
        return;
      }
      throw err;
    }
  });

  await seedData();

  return httpServer;
}

// Helper to seed data if empty
async function seedData() {
  const ledger = await storage.getLedger();
  if (ledger.length === 0) {
    await storage.createLedgerEntry({
      type: 'credit',
      category: 'market',
      amount: 5000.00,
      description: 'Q1 Market Fund Injection'
    });
    await storage.createLedgerEntry({
      type: 'debit',
      category: 'liability',
      amount: 1200.50,
      description: 'Office Rent'
    });
  }

  const inventory = await storage.getInventory();
  if (inventory.length === 0) {
    await storage.createInventoryItem({
      name: 'Steel Beams',
      sku: 'MAT-001',
      quantity: 500,
      category: 'material',
      status: 'stocked',
      location: 'Warehouse A'
    });
  }

  const employees = await storage.getEmployees();
  if (employees.length === 0) {
    await storage.createEmployee({
      name: 'John Doe',
      role: 'Manager',
      department: 'Finance',
      status: 'active',
      email: 'john@commercing.com'
    });
  }
}
