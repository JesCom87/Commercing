import { z } from 'zod';
import { 
  insertLedgerSchema, ledger,
  insertInventorySchema, inventory,
  insertEmployeeSchema, employees,
  insertOperationSchema, operations,
  insertAgendaSchema, agenda,
  insertScoreSchema, score,
  insertMendSchema, mend
} from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  office: {
    listLedger: {
      method: 'GET' as const,
      path: '/api/office/ledger',
      responses: {
        200: z.array(z.custom<typeof ledger.$inferSelect>()),
      },
    },
    createLedgerEntry: {
      method: 'POST' as const,
      path: '/api/office/ledger',
      input: insertLedgerSchema,
      responses: {
        201: z.custom<typeof ledger.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  field: {
    listInventory: {
      method: 'GET' as const,
      path: '/api/field/inventory',
      responses: {
        200: z.array(z.custom<typeof inventory.$inferSelect>()),
      },
    },
    createInventoryItem: {
      method: 'POST' as const,
      path: '/api/field/inventory',
      input: insertInventorySchema,
      responses: {
        201: z.custom<typeof inventory.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    listEmployees: {
      method: 'GET' as const,
      path: '/api/field/employees',
      responses: {
        200: z.array(z.custom<typeof employees.$inferSelect>()),
      },
    },
    createEmployee: {
      method: 'POST' as const,
      path: '/api/field/employees',
      input: insertEmployeeSchema,
      responses: {
        201: z.custom<typeof employees.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  outfit: {
    listOperations: {
      method: 'GET' as const,
      path: '/api/outfit/operations',
      responses: {
        200: z.array(z.custom<typeof operations.$inferSelect>()),
      },
    },
    createOperation: {
      method: 'POST' as const,
      path: '/api/outfit/operations',
      input: insertOperationSchema,
      responses: {
        201: z.custom<typeof operations.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  agenda: {
    listEvents: {
      method: 'GET' as const,
      path: '/api/agenda/events',
      responses: {
        200: z.array(z.custom<typeof agenda.$inferSelect>()),
      },
    },
    createEvent: {
      method: 'POST' as const,
      path: '/api/agenda/events',
      input: insertAgendaSchema,
      responses: {
        201: z.custom<typeof agenda.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  score: {
    listInvoices: {
      method: 'GET' as const,
      path: '/api/score/invoices',
      responses: {
        200: z.array(z.custom<typeof score.$inferSelect>()),
      },
    },
    createInvoice: {
      method: 'POST' as const,
      path: '/api/score/invoices',
      input: insertScoreSchema,
      responses: {
        201: z.custom<typeof score.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  mend: {
    listEntries: {
      method: 'GET' as const,
      path: '/api/mend/entries',
      responses: {
        200: z.array(z.custom<typeof mend.$inferSelect>()),
      },
    },
    createEntry: {
      method: 'POST' as const,
      path: '/api/mend/entries',
      input: insertMendSchema,
      responses: {
        201: z.custom<typeof mend.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
