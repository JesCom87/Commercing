# Commercing - Enterprise Dashboard Application

## Overview

Commercing is a full-stack enterprise resource planning (ERP) dashboard application built with React, Express, and PostgreSQL. It provides a unified interface for managing business operations across six core domains:

- **Office** - Economics, Finance, and Accounting (ledger management)
- **Field** - Marketing, Supply Chain, and Human Resources (inventory, employees)
- **Outfit** - Processing, Operations, and Manufacturing workflows
- **Agenda** - Calendar, Tasks, and Communication scheduling
- **Score** - Invoicing, Payments, and Financial scoring

The application follows a modern monorepo structure with shared types and validation schemas between frontend and backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **Build Tool**: Vite with custom path aliases (@/, @shared/, @assets/)

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **API Pattern**: REST endpoints defined in shared/routes.ts with Zod schemas for type-safe contracts
- **Storage Layer**: DatabaseStorage class implementing IStorage interface for data access abstraction

### Shared Code
- **Schema Definitions**: Drizzle table schemas in shared/schema.ts define database structure and generate Zod validation schemas via drizzle-zod
- **API Contracts**: shared/routes.ts defines all API endpoints with input/output schemas, ensuring type safety across the stack
- **Types**: Inferred from Drizzle schemas (InsertX, SelectX patterns)

### Database Schema
Six main tables supporting the business domains:
- `ledger` - Financial transactions with type, category, subcategory, detail, amount
- `inventory` - Supply chain items with SKU, quantity, status, location
- `employees` - HR records with role, department, status
- `operations` - Manufacturing/trading workflows with sector, status, progress
- `agenda` - Calendar events with type, times, descriptions
- `score` - Invoices/payments with client, amount, status, due dates

### Build System
- **Development**: tsx runs TypeScript server directly with Vite middleware for HMR
- **Production**: Custom build script using esbuild for server bundling and Vite for client, outputs to dist/

## External Dependencies

### Database
- **PostgreSQL**: Primary database accessed via DATABASE_URL environment variable
- **Drizzle ORM**: Type-safe query builder with push-based migrations (db:push command)

### Key NPM Packages
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm/drizzle-zod**: ORM and schema-to-validation generation
- **@radix-ui/***: Accessible UI primitive components
- **recharts**: Chart visualization library
- **react-day-picker**: Calendar component
- **date-fns**: Date formatting utilities
- **zod**: Runtime type validation

### Replit-Specific Integrations
- **@replit/vite-plugin-runtime-error-modal**: Error overlay in development
- **@replit/vite-plugin-cartographer**: Development tooling (dev only)
- **@replit/vite-plugin-dev-banner**: Development environment indicator