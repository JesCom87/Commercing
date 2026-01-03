import { z } from 'zod';
import { 
  insertLedgerSchema, ledger,
  insertInventorySchema, inventory,
  insertEmployeeSchema, employees,
  insertOperationSchema, operations,
  insertEventSchema, events,
  insertInvoiceSchema, invoices,
  insertMarketDataSchema, marketData,
  insertMarketingSchema, marketing
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
    listMarketData: {
      method: 'GET' as const,
      path: '/api/office/market',
      responses: {
        200: z.array(z.custom<typeof marketData.$inferSelect>()),
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
    listEmployees: {
      method: 'GET' as const,
      path: '/api/field/employees',
      responses: {
        200: z.array(z.custom<typeof employees.$inferSelect>()),
      },
    },
    listMarketing: {
      method: 'GET' as const,
      path: '/api/field/marketing',
      responses: {
        200: z.array(z.custom<typeof marketing.$inferSelect>()),
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
  },
  agenda: {
    listEvents: {
      method: 'GET' as const,
      path: '/api/agenda/events',
      responses: {
        200: z.array(z.custom<typeof events.$inferSelect>()),
      },
    },
  },
  score: {
    listInvoices: {
      method: 'GET' as const,
      path: '/api/score/invoices',
      responses: {
        200: z.array(z.custom<typeof invoices.$inferSelect>()),
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
