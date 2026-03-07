# Backend Build Plan — Deba Car Rental

## Overview
Build an Express.js REST API backend inside `/server` (monorepo). The backend replaces all Supabase direct calls from the frontend, handles auth with JWT, sends emails via Nodemailer, and keeps Cloudinary for images. Designed for VPS deployment behind Nginx.

---

## Tech Stack
- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL (same Supabase DB for now, can switch to local PG on VPS later)
- **ORM:** Prisma (type-safe queries, easy migrations)
- **Auth:** JWT (access tokens) + bcrypt (password hashing)
- **Email:** Nodemailer (SMTP via Outlook or any provider)
- **Images:** Cloudinary (keep current setup, add server-side signed uploads)
- **Validation:** Zod (request body validation)
- **CORS:** cors middleware

---

## Phase 1: Project Setup
1. Create `/server` directory with its own `package.json` and `tsconfig.json`
2. Install dependencies: `express`, `prisma`, `@prisma/client`, `jsonwebtoken`, `bcrypt`, `nodemailer`, `zod`, `cors`, `dotenv`, `cloudinary`
3. Set up TypeScript compilation (`ts-node-dev` for dev, `tsc` for build)
4. Create `/server/.env` with all required env vars
5. Add npm scripts: `dev`, `build`, `start`, `db:migrate`, `db:seed`

## Phase 2: Database & Prisma
6. Initialize Prisma with PostgreSQL connection (pointing to existing Supabase DB)
7. Define Prisma schema with two models:

```prisma
model Vehicle {
  id           String   @id @default(uuid())
  name         String
  category     String   // Economy | Compact | SUV | Luxury | Van
  year         Int
  doors        Int
  seats        Int
  transmission String   // Manual | Automatic
  fuel         String   // Petrol | Diesel | Electric | Hybrid
  hp           Int
  pricePerDay  Float    @map("price_per_day")
  currency     String   @default("EUR")
  image        String
  images       String[]
  features     String[]
  available    Boolean  @default(true)
  createdAt    DateTime @default(now()) @map("created_at")
  reservations Reservation[]

  @@map("vehicles")
}

model Reservation {
  id         String   @id @default(uuid())
  vehicleId  String   @map("vehicle_id")
  firstName  String   @map("first_name")
  lastName   String   @map("last_name")
  email      String
  phone      String
  pickupDate DateTime @map("pickup_date")
  returnDate DateTime @map("return_date")
  notes      String?
  status     String   @default("new") // new | confirmed | cancelled
  createdAt  DateTime @default(now()) @map("created_at")
  vehicle    Vehicle  @relation(fields: [vehicleId], references: [id])

  @@map("reservations")
}
```

8. Run `prisma db pull` to introspect existing Supabase tables, then align schema
9. Generate Prisma client

## Phase 3: Core Backend Structure
10. Set up Express app entry point (`/server/src/index.ts`)
11. Create folder structure:
```
server/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── index.ts          # App entry, middleware setup
│   ├── routes/
│   │   ├── vehicles.ts
│   │   ├── reservations.ts
│   │   ├── auth.ts
│   │   └── upload.ts
│   ├── middleware/
│   │   └── auth.ts       # JWT verification middleware
│   ├── services/
│   │   ├── email.ts      # Nodemailer setup + templates
│   │   └── cloudinary.ts # Signed upload generation
│   └── lib/
│       ├── prisma.ts     # Prisma client singleton
│       └── validation.ts # Zod schemas
├── package.json
├── tsconfig.json
└── .env
```

## Phase 4: API Endpoints

### Auth Routes (`/api/auth`)
12. `POST /api/auth/login` — Validate credentials with bcrypt, return JWT
13. `POST /api/auth/logout` — Client-side token removal (stateless JWT)
14. `GET /api/auth/verify` — Verify JWT token validity

### Vehicle Routes (`/api/vehicles`)
15. `GET /api/vehicles` — List all vehicles (public)
16. `POST /api/vehicles` — Create vehicle (admin only)
17. `PUT /api/vehicles/:id` — Update vehicle (admin only)
18. `DELETE /api/vehicles/:id` — Delete vehicle (admin only)

### Reservation Routes (`/api/reservations`)
19. `GET /api/reservations` — List all reservations with vehicle name (admin only)
20. `POST /api/reservations` — Create reservation (public) + send email to business
21. `PUT /api/reservations/:id/status` — Update status (admin only) + send email to customer

### Upload Route (`/api/upload`)
22. `POST /api/upload/signature` — Generate Cloudinary signed upload params (admin only)

## Phase 5: Email Service (Nodemailer)
23. Configure Nodemailer transporter (SMTP with Outlook or custom provider)
24. Create email templates:
    - **New Reservation** → sent to business email with all booking details
    - **Status Update** → sent to customer when reservation is confirmed/cancelled
25. Integrate email sending into reservation create and status update endpoints

## Phase 6: Frontend Integration
26. Create `/src/utils/api.ts` — Axios/fetch wrapper pointing to backend URL
27. Update `/src/utils/storage.ts` — Replace all Supabase calls with backend API calls
28. Update `/src/utils/auth.ts` — Replace localStorage+SHA-256 with JWT token flow
29. Update `AuthContext.tsx` — Use backend verify endpoint for session persistence
30. Update `AdminVehicleForm.tsx` — Use signed uploads from backend
31. Remove Supabase dependency from frontend (`@supabase/supabase-js`)

## Phase 7: VPS Deployment Config
32. Create `Dockerfile` for the backend (Node.js Alpine)
33. Create `docker-compose.yml` with:
    - Backend (Express)
    - PostgreSQL (local DB, replacing Supabase)
    - Nginx (reverse proxy + serve frontend static files)
34. Create Nginx config:
    - Serve built React app on `/`
    - Proxy `/api/*` requests to Express backend
    - SSL termination (Let's Encrypt / Certbot)
35. Add frontend build script that outputs to a dir Nginx can serve
36. Create a simple deploy script or document deployment steps

---

## Environment Variables (Backend)

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/deba

# Auth
JWT_SECRET=<random-secret>
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=<bcrypt-hash>

# Email (Nodemailer)
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=jordanov.k@outlook.com
SMTP_PASS=<email-password>
EMAIL_FROM=jordanov.k@outlook.com
BUSINESS_EMAIL=jordanov.k@outlook.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>

# Server
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
```

---

## Execution Order

| Step | Phase | What | Priority |
|------|-------|------|----------|
| 1 | Phase 1 | Project setup, deps, TypeScript config | Must |
| 2 | Phase 2 | Prisma schema + DB connection | Must |
| 3 | Phase 3 | Express app structure + middleware | Must |
| 4 | Phase 4 | All API endpoints | Must |
| 5 | Phase 5 | Nodemailer email service | Must |
| 6 | Phase 6 | Frontend rewire to use backend API | Must |
| 7 | Phase 7 | Docker + Nginx + deploy config | Must |

Estimated files to create: ~15 new files in `/server`, ~5 modified files in `/src`
