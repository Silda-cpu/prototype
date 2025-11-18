# Democracy Shopping Companion - White Label

## Overview

White Label is a civic engagement shopping companion app that helps users make informed purchasing decisions based on companies' political activities and values. The application tracks company political donations, lobbying efforts, and public statements to generate democracy scores (0-100), enabling users to "shop their politics" and align their spending with their values.

The app features personalized tracking of user spending patterns, categorized company databases, real-time notifications about company score changes, and extensive white-label customization options allowing users to brand the experience to their preferences.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Mobile-first responsive design optimized for on-the-go shopping decisions
- Component-based architecture with reusable UI elements

**UI Component Library**
- Radix UI primitives (@radix-ui/*) for accessible, unstyled components
- shadcn/ui design system configured with "new-york" style variant
- Tailwind CSS for utility-first styling with custom design tokens
- HSL-based color system supporting score gradients (emerald for high scores 70+, amber for medium 40-69, rose for low <40)

**State Management**
- React Query (@tanstack/react-query) for server state and data fetching
- Local component state using React hooks (useState, useEffect)
- Mock data implementation in client-side components (production will integrate with backend APIs)

**Key Design Patterns**
- Page-based navigation with bottom navigation bar (Home, Browse, Profile)
- All settings accessible from Profile page (no separate Settings tab)
- Modal overlays for authentication, company details, and user requests
- Drag-and-drop category reordering using @dnd-kit libraries
- Sortable lists for personalized category management

### Backend Architecture

**Server Framework**
- Express.js REST API with TypeScript
- Development server with Vite middleware integration
- Production build using esbuild for Node.js bundling

**Database & ORM**
- Drizzle ORM for type-safe database operations
- PostgreSQL configured via Neon serverless (@neondatabase/serverless)
- Schema-driven development with migrations in `/migrations` directory
- Shared schema definitions in `/shared/schema.ts`

**Current Implementation**
- In-memory storage implementation (MemStorage class) for development
- User authentication foundation with username/password schema
- Storage interface pattern (IStorage) designed for easy migration to persistent database
- Session management ready for implementation (connect-pg-simple included)

**API Structure**
- Routes defined in `/server/routes.ts` with `/api` prefix convention
- Request/response logging middleware for debugging
- Error handling middleware with status code propagation
- Credential-based authentication ready for implementation

### Data Models

**Core Entities**

1. **User (AppUser)**
   - Authentication: id, username, password (hashed)
   - Profile: name, email, isGuest flag
   - Scoring: overallScore, categoryScores map
   - Activity: userSpending array, notifications array
   - Preferences: categoryOrder, categoryVisibility map, whiteLabelSettings

2. **Company**
   - Basic info: id, name, description, category, website
   - Scoring: score (0-100), status (support/neutral/boycott)
   - Political data: donations array, lobbying array, statements array

3. **Category**
   - Metadata: id, name, icon
   - Companies: array of company objects
   - User customization: userStores array for personalized tracking

4. **Spending & Notifications**
   - UserSpending: tracks purchases per company/category with amounts and dates
   - Notifications: alerts for company score changes with trend indicators

**Design System Tokens**
- Primary brand: Teal (#14b8a6) and Blue (#3b82f6)
- Score-based gradients: Emerald/Teal (high), Amber/Orange (medium), Rose/Red (low)
- Neutral palette: Slate-based with 15% saturation for backgrounds
- Border radius: Generous rounding (1rem default) for modern aesthetic
- Typography: System font stack for native feel

### Authentication & Authorization

**Current State**
- Basic user schema with username/password fields
- Insert user validation using Zod schemas
- In-memory user storage with UUID generation
- Foundation for session-based authentication (Express session packages installed)

**Planned Implementation**
- Password hashing (bcrypt/argon2)
- Session management with PostgreSQL store
- Guest user support (already implemented in frontend)
- Protected API routes

### White Label Customization

**User-Configurable Settings**
- App name and branding tagline (mantra)
- Primary color theme selection (6 preset colors)
- Logo upload support
- Per-user customization stored in whiteLabelSettings object
- Configurable max stores per category (1-10, default 3)
- All settings accessible from Profile page via dedicated modals

**Design Philosophy**
- Values transparency through clear political data presentation
- Mobile-first with bottom navigation pattern
- Glass morphism effects and gradient backgrounds
- Score-driven color coding for instant visual feedback

## Recent Changes

**October 26, 2025**
- Removed Settings tab from bottom navigation (Settings now in Profile page)
- Added logout button to HomePage in top right corner
- Changed search input focus color from red to teal (avoids error-like appearance)
- Implemented user-configurable maxStoresPerCategory setting (default 3, adjustable 1-10)
- Enhanced search to show only matching stores instead of entire categories
- Consolidated all settings into ProfilePage with modal interfaces
- Updated CompanyDetail to respect dynamic maxStoresPerCategory limit
- Fixed tooltip positioning and text to use user-configured limits
- Removed footer branding text from SettingsPage
- Changed category CTA from "View Impact" to "View Details"
- Removed dollar sign icon from category cards

## External Dependencies

### Third-Party Services

**Database**
- Neon Serverless Postgres (connection via DATABASE_URL environment variable)
- Drizzle Kit for schema migrations and management

**UI Components & Utilities**
- Radix UI component primitives (17+ components for dialogs, dropdowns, navigation, etc.)
- Lucide React for consistent iconography
- date-fns for date formatting and manipulation
- clsx and tailwind-merge for conditional styling

**Development Tools**
- Vite with React plugin for fast development and HMR
- Replit-specific plugins: runtime error modal, cartographer, dev banner
- esbuild for production server bundling
- TSX for running TypeScript in development

**Drag & Drop**
- @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities for category reordering

**Form Handling**
- React Hook Form with Hookform Resolvers
- Zod for schema validation

### Environment Variables

**Required**
- `DATABASE_URL`: PostgreSQL connection string (throws error if missing)

**Optional**
- `NODE_ENV`: Development/production mode switching
- `REPL_ID`: Replit-specific environment detection

### Asset Management

- Static assets served from `/attached_assets` directory
- Vite alias configuration for `@/`, `@shared/`, `@assets/` imports
- Public assets built to `/dist/public` directory
- Client-side routing with index.html template