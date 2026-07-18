# Car Rental Service — Architecture Reference

> **Single source of truth** for system architecture, database schema, API specifications, and core business rules.
> Generated from `frontend/.github/copilot-instructions.md` and `backend/.github/copilot-instructions.md`.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Tech Stack](#2-tech-stack)
3. [High-Level Architecture](#3-high-level-architecture)
4. [Backend Architecture](#4-backend-architecture)
5. [Database Schema](#5-database-schema)
6. [Seed Data](#6-seed-data)
7. [API Specification](#7-api-specification)
8. [Security Architecture](#8-security-architecture)
9. [Authentication Flow](#9-authentication-flow)
10. [Pricing Engine](#10-pricing-engine)
11. [Reservation Lifecycle](#11-reservation-lifecycle)
12. [Frontend Architecture](#12-frontend-architecture)
13. [Frontend Routing](#13-frontend-routing)
14. [Frontend State Management](#14-frontend-state-management)
15. [Frontend Data Models](#15-frontend-data-models)
16. [Error Handling](#16-error-handling)
17. [Configuration & Environment](#17-configuration--environment)
18. [Development Setup](#18-development-setup)

---

## 1. System Overview

**Car Rental Service** is a full-stack web application for managing vehicle reservations.

| Actor | Capabilities |
|---|---|
| **ADMIN** | View all reservations and vehicles; edit/cancel any active reservation; access pricing calculator; view dashboard with system-wide statistics |
| **CUSTOMER** | Create reservations; view and cancel own reservations; access pricing calculator; view personal dashboard |

**Communication:** React SPA → REST API → PostgreSQL

---

## 2. Tech Stack

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Java | 21 | Runtime |
| Spring Boot | 4.1.0 | Application framework |
| Spring Web MVC | — | REST controllers |
| Spring Data JPA | — | ORM / persistence |
| Spring Security | — | JWT-based stateless auth |
| Bean Validation | — | Request DTO validation |
| springdoc OpenAPI | — | Swagger UI (`/swagger-ui/**`) |
| PostgreSQL | — | Primary database (`car_rental_db`) |
| jjwt | 0.12.7 | JWT generation and verification |
| Lombok | — | Boilerplate reduction |
| Hibernate | — | JPA provider (UuidGenerator) |

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| Vite | 8 | Build tool & dev server |
| React Router DOM | 6 | Client-side routing |
| Material UI (MUI) | v5 | Component library & theming |
| MUI Icons Material | v5 | Icon set |
| Axios | — | HTTP client (with interceptors) |
| ESLint | 10 | Linting |

---

## 3. High-Level Architecture

```
┌─────────────────────────────────────────────┐
│             Browser (React SPA)             │
│         http://localhost:5173               │
└────────────────────┬────────────────────────┘
                     │  REST (JSON) over HTTP
                     │  Authorization: Bearer <JWT>
                     ▼
┌─────────────────────────────────────────────┐
│         Spring Boot API Server              │
│         http://localhost:8080/api/v1        │
│                                             │
│  Controllers → Services → Repositories     │
│  Strategy Pattern (Pricing)                │
│  JWT Filter → SecurityConfig               │
└────────────────────┬────────────────────────┘
                     │  JPA / JDBC
                     ▼
┌─────────────────────────────────────────────┐
│         PostgreSQL Database                 │
│         car_rental_db                       │
│  Tables: customer, vehicle, reservation     │
└─────────────────────────────────────────────┘
```

**CORS:** Backend allows `http://localhost:5173` on `/api/v1/**`.

---

## 4. Backend Architecture

### Package Structure

```
com.ajay.carrental/
├── CarRentalServiceApplication.java   # Entry point (@SpringBootApplication)
│
├── config/
│   ├── SecurityConfig.java            # Spring Security filter chain
│   ├── CorsConfig.java                # CORS — allows localhost:5173
│   ├── DataInitializer.java           # CommandLineRunner — seeds vehicles & customers
│   └── OtpCleanupScheduler.java       # @Scheduled — cleans expired OTPs every minute
│
├── controller/
│   ├── AuthenticationController.java  # POST /api/v1/auth/**
│   ├── ReservationController.java     # /api/v1/reservations/**
│   ├── PricingController.java         # POST /api/v1/pricing/options
│   ├── VehicleController.java         # GET /api/v1/vehicles/count
│   └── CustomerController.java        # GET /api/v1/customers/{email}
│
├── service/                           # Interfaces
│   ├── AuthenticationService.java
│   ├── ReservationService.java
│   ├── PricingService.java
│   ├── VehicleService.java
│   ├── CustomerService.java
│   ├── OtpService.java
│   └── EmailService.java
│
├── service/impl/                      # Business logic implementations
│   ├── AuthenticationServiceImpl.java
│   ├── ReservationServiceImpl.java
│   ├── PricingServiceImpl.java
│   ├── VehicleServiceImpl.java
│   ├── CustomerServiceImpl.java
│   ├── OtpServiceImpl.java            # In-memory ConcurrentHashMap OTP store
│   └── EmailServiceImpl.java
│
├── entity/
│   ├── BaseEntity.java                # UUID PK, createdAt, updatedAt (@MappedSuperclass)
│   ├── Customer.java
│   ├── Vehicle.java
│   └── Reservation.java
│
├── repository/
│   ├── CustomerRepository.java
│   ├── VehicleRepository.java
│   └── ReservationRepository.java
│
├── dto/
│   ├── request/
│   │   ├── ReservationRequest.java
│   │   ├── ReservationUpdateRequest.java
│   │   ├── PricingRequest.java
│   │   ├── SendOtpRequest.java
│   │   └── OtpRequest.java
│   ├── response/
│   │   ├── ReservationResponse.java
│   │   ├── PricingResponse.java
│   │   ├── CustomerResponse.java
│   │   └── OtpResponse.java
│   └── auth/
│       └── LoginResponse.java
│
├── strategy/                          # Pricing Strategy Pattern
│   ├── PricingStrategy.java           # Interface
│   ├── PricingStrategyFactory.java    # Maps VehicleCategory → Strategy
│   ├── SedanPricingStrategy.java
│   ├── SuvPricingStrategy.java
│   ├── VanPricingStrategy.java
│   └── PickupTruckPricingStrategy.java
│
├── mapper/
│   └── ReservationMapper.java         # Entity → ReservationResponse
│
├── security/
│   ├── JwtService.java                # JWT generate / validate / claims
│   ├── JwtAuthenticationFilter.java   # OncePerRequestFilter; sets SecurityContext
│   ├── UnauthorizedEntryPoint.java    # Returns JSON 401 on auth failure
│   └── SecurityUtils.java
│
├── exception/
│   ├── ApiError.java                  # Error response record
│   ├── GlobalExceptionHandler.java    # @RestControllerAdvice
│   ├── ReservationNotFoundException.java
│   └── VehicleNotAvailableException.java
│
├── enums/
│   ├── VehicleCategory.java           # SEDAN, SUV, VAN, PICKUP_TRUCK
│   └── ReservationStatus.java         # ACTIVE, CANCELLED
│
└── util/
    └── DateUtils.java                 # getRentalDays(), getLicenseYears()
```

### Layer Responsibilities

| Layer | Rule |
|---|---|
| **Controllers** | Thin — only receive request, call service, return response |
| **Services** | All business logic; call repositories and other services |
| **Repositories** | Spring Data JPA interfaces; no custom SQL unless necessary |
| **Strategies** | Stateless pricing computation; injected by Spring; selected by factory |
| **Mappers** | Entity ↔ DTO conversion only |

---

## 5. Database Schema

### `BaseEntity` (abstract — all tables inherit)

| Column | Type | Notes |
|---|---|---|
| `id` | `UUID` | PK, generated (`@UuidGenerator`) |
| `created_at` | `TIMESTAMP` | Set on `@PrePersist`; not updatable |
| `updated_at` | `TIMESTAMP` | Set on `@PrePersist` and `@PreUpdate` |

### Table: `customer`

| Column | Type | Constraints |
|---|---|---|
| `id` | `UUID` | PK (inherited) |
| `name` | `VARCHAR` | NOT NULL |
| `email` | `VARCHAR` | NOT NULL, UNIQUE |
| `license_issue_date` | `DATE` | NOT NULL |
| `created_at` | `TIMESTAMP` | NOT NULL |
| `updated_at` | `TIMESTAMP` | NOT NULL |

### Table: `vehicle`

| Column | Type | Constraints |
|---|---|---|
| `id` | `UUID` | PK (inherited) |
| `vehicle_number` | `VARCHAR` | NOT NULL, UNIQUE |
| `category` | `VARCHAR` | NOT NULL — enum: `SEDAN`, `SUV`, `VAN`, `PICKUP_TRUCK` |
| `available` | `BOOLEAN` | NOT NULL, default `true` |
| `created_at` | `TIMESTAMP` | NOT NULL |
| `updated_at` | `TIMESTAMP` | NOT NULL |

### Table: `reservation`

| Column | Type | Constraints |
|---|---|---|
| `id` | `UUID` | PK (inherited) |
| `customer_id` | `UUID` | FK → `customer.id`, NOT NULL |
| `vehicle_id` | `UUID` | FK → `vehicle.id`, NOT NULL |
| `start_date` | `DATE` | NOT NULL |
| `end_date` | `DATE` | NOT NULL |
| `daily_mileage` | `INTEGER` | NOT NULL |
| `total_amount` | `DECIMAL` | NOT NULL |
| `status` | `VARCHAR` | NOT NULL — enum: `ACTIVE`, `CANCELLED` |
| `created_at` | `TIMESTAMP` | NOT NULL |
| `updated_at` | `TIMESTAMP` | NOT NULL |

### Entity Relationships

```
customer ──< reservation >── vehicle
  (1)          (many)         (1)
```

- A customer can have many reservations.
- A vehicle can have many reservations (over time).
- A vehicle has `available = false` when it holds an `ACTIVE` reservation.

---

## 6. Seed Data

`DataInitializer` seeds on first run (skips if `vehicleRepository.count() > 0`):

### Vehicles (24 total)

| Category | Numbers | Count |
|---|---|---|
| SEDAN | SED001–SED005 | 5 |
| SUV | SUV001–SUV004 | 4 |
| VAN | VAN001–VAN006 | 6 |
| PICKUP_TRUCK | PICK001–PICK010 | 10 |

### Customers (3 seed records)

| Name | Email | License Issued |
|---|---|---|
| Ajay Kanojiya | ajay.kanojiya@example.com | 5 years ago |
| Raj Kumar | raj.kumar@example.com | 3 years ago |
| Priya Singh | priya.singh@example.com | 4 years ago |

---

## 7. API Specification

**Base URL:** `http://localhost:8080/api/v1`

All endpoints require `Authorization: Bearer <JWT>` **except** those marked _Public_.

### Authentication

| Method | Path | Auth | Request Body | Response | Notes |
|---|---|---|---|---|---|
| `POST` | `/auth/send-otp` | Public | `{ email }` | `OtpResponse` | Sends OTP email; returns `success: false` if mail fails |
| `POST` | `/auth/verify-otp` | Public | `{ email, otp }` | `LoginResponse` | Issues JWT; `admin@carrental.com` → role `ADMIN`, others → `CUSTOMER` |

**`OtpResponse`**
```json
{ "message": "...", "success": true }
```

**`LoginResponse`**
```json
{ "token": "...", "role": "CUSTOMER|ADMIN", "customerName": "...", "email": "..." }
```

---

### Reservations

| Method | Path | Status | Request Body | Response | Notes |
|---|---|---|---|---|---|
| `POST` | `/reservations` | `201` | `ReservationRequest` | `ReservationResponse` | Creates reservation; auto-allocates vehicle |
| `PUT` | `/reservations/{reservationId}` | `200` | `ReservationUpdateRequest` | `ReservationResponse` | Updates dates and mileage; recalculates amount |
| `DELETE` | `/reservations/{reservationId}` | `204` | — | — | Sets status `CANCELLED`; frees vehicle |
| `GET` | `/reservations` | `200` | — | `ReservationResponse[]` | All reservations (Admin use) |
| `GET` | `/reservations/customer/{email}` | `200` | — | `ReservationResponse[]` | Filtered by customer email |

**`ReservationRequest`**
```json
{
  "customerName": "string (required)",
  "customerEmail": "string (required)",
  "vehicleCategory": "SEDAN|SUV|VAN|PICKUP_TRUCK (required)",
  "startDate": "YYYY-MM-DD (required)",
  "endDate": "YYYY-MM-DD (required)",
  "dailyMileage": "integer >= 0",
  "licenseYears": "integer >= 0"
}
```

**`ReservationUpdateRequest`**
```json
{
  "startDate": "YYYY-MM-DD (required)",
  "endDate": "YYYY-MM-DD (required)",
  "dailyMileage": "integer >= 0"
}
```

**`ReservationResponse`**
```json
{
  "reservationId": "UUID",
  "customerName": "string",
  "customerEmail": "string",
  "vehicleNumber": "string",
  "category": "SEDAN|SUV|VAN|PICKUP_TRUCK",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "dailyMileage": "integer",
  "totalAmount": "decimal",
  "status": "ACTIVE|CANCELLED"
}
```

---

### Pricing

| Method | Path | Status | Request Body | Response |
|---|---|---|---|---|
| `POST` | `/pricing/options` | `200` | `PricingRequest` | `PricingResponse[]` sorted by `totalAmount` asc |

**`PricingRequest`**
```json
{
  "rentalDays": "integer >= 1 (required)",
  "dailyMileage": "double",
  "licenseYears": "integer"
}
```

**`PricingResponse`** (one per vehicle category)
```json
{ "category": "SEDAN|SUV|VAN|PICKUP_TRUCK", "totalAmount": "decimal" }
```

---

### Vehicles

| Method | Path | Status | Response |
|---|---|---|---|
| `GET` | `/vehicles/count` | `200` | `{ "count": integer }` |

---

### Customers

| Method | Path | Status | Response | Notes |
|---|---|---|---|---|
| `GET` | `/customers/{email}` | `200` | `CustomerResponse` | If not found, returns object with only `email` set |

**`CustomerResponse`**
```json
{
  "id": "UUID (null if not found)",
  "name": "string (null if not found)",
  "email": "string",
  "licenseIssueDate": "YYYY-MM-DD (null if not found)"
}
```

---

### Error Response Format (`ApiError`)

All error responses use this structure:

```json
{
  "timestamp": "ISO-8601 datetime",
  "status": 400,
  "error": "Human-readable error type",
  "message": "Details",
  "path": "/api/v1/..."
}
```

| Exception | HTTP Status | `error` field |
|---|---|---|
| `ReservationNotFoundException` | `404` | `"Reservation Not Found"` |
| `VehicleNotAvailableException` | `400` | `"Vehicle Not Available"` |
| `MethodArgumentNotValidException` | `400` | `"Validation Error"` |
| Any other `Exception` | `500` | `"Internal Server Error"` |

---

## 8. Security Architecture

### JWT Flow

```
Client                          Server
  │                               │
  │─── POST /auth/verify-otp ────▶│
  │                               │  JwtService.generateToken(email, role)
  │◀── { token, role, ... } ──────│
  │                               │
  │─── GET /api/v1/... ──────────▶│
  │    Authorization: Bearer xxx  │  JwtAuthenticationFilter
  │                               │    extracts + validates JWT
  │                               │    sets SecurityContext with ROLE_<role>
  │◀── 200 OK ────────────────────│
```

### Public Endpoints (no JWT required)

- `POST /api/v1/auth/send-otp`
- `POST /api/v1/auth/verify-otp`
- `/swagger-ui/**`, `/v3/api-docs/**`, `/swagger-ui.html`

### JWT Details

- Library: `jjwt` 0.12.7
- Stateless — no server-side session (`SessionCreationPolicy.STATELESS`)
- CSRF disabled (stateless API)
- Role stored as JWT claim `role`; converted to Spring authority `ROLE_<role>` by `JwtAuthenticationFilter`
- Unauthorized requests handled by `UnauthorizedEntryPoint` (returns JSON `ApiError`)

### Admin Special Case

- `admin@carrental.com` → receives role `ADMIN` in JWT
- Frontend ADMIN login uses a static hash key (`ADMIN@2026`) validated on the **frontend only** — no backend admin endpoint; admin still goes through OTP flow using the admin email

---

## 9. Authentication Flow

### Customer OTP Login

```
1. Customer enters email
2. POST /auth/send-otp { email }
   → OtpServiceImpl generates OTP, stores in ConcurrentHashMap
   → EmailServiceImpl sends OTP email
   → Returns { success: true, message: "..." }

3. Customer enters OTP
4. POST /auth/verify-otp { email, otp }
   → OtpServiceImpl.verifyOtp() checks code
   → CustomerService.getCustomerByEmail() (may return empty if new customer)
   → JwtService.generateToken(email, role)
   → Returns LoginResponse { token, role, customerName, email }

5. Frontend stores:
   - JWT in localStorage key "car_rental_auth"
   - Session in localStorage key "car-rental-auth-session"
```

### Admin Frontend-Only Login

```
1. Admin enters hash key on Admin tab
2. Frontend checks: hashKey === "ADMIN@2026"
3. If match: AuthContext.loginAsAdmin() populates session
   - No JWT issued (admin has no backend token)
   - role: "ADMIN", displayName: "ADMIN"
```

### OTP Service Implementation Notes

- OTP state: **in-memory** `ConcurrentHashMap` in `OtpServiceImpl` (no Redis)
- Expired OTP cleanup: `OtpCleanupScheduler` runs `@Scheduled` every **1 minute**
- Config keys: `OTP_EXPIRATION_TIME_MS`, `OTP_MAX_VERIFICATION_ATTEMPTS`, `OTP_MAX_GENERATION_ATTEMPTS`

### Dual localStorage Keys

| Key | Contents | Used By |
|---|---|---|
| `car-rental-auth-session` | `{ authenticated, role, email, displayName, customerExists, loginTime }` | `AuthContext` / `authStorage.js` |
| `car_rental_auth` | `{ token, role, email, customerName }` | Axios interceptor / `authService.js` |

Customer login populates **both**. Admin login only populates `car-rental-auth-session`.

---

## 10. Pricing Engine

### Strategy Pattern

```
PricingStrategyFactory
  └── Map<VehicleCategory, PricingStrategy>
        ├── SEDAN       → SedanPricingStrategy
        ├── SUV         → SuvPricingStrategy
        ├── VAN         → VanPricingStrategy
        └── PICKUP_TRUCK → PickupTruckPricingStrategy
```

Each strategy is a Spring `@Component` injected into the factory.

### Pricing Formulas

#### SEDAN
```
pricePerDay = rentalDays < 10 ? $20 : $15
totalAmount = pricePerDay × rentalDays
```

#### SUV
```
totalAmount = (15 × rentalDays) + (dailyMileage × rentalDays × 0.50)
```

#### VAN
```
totalAmount = $22 × rentalDays
```

#### PICKUP_TRUCK
```
base = $30 × rentalDays
if licenseYears < 3: base × 1.10  (10% surcharge for inexperienced drivers)
```

### Pricing API Behavior

- `POST /pricing/options` returns pricing for **all 4 categories** in a single response.
- Results sorted by `totalAmount` ascending.
- Used both for the Pricing Calculator page and internally by `ReservationServiceImpl` when creating/updating a reservation.

---

## 11. Reservation Lifecycle

### Creation (`POST /reservations`)

```
ReservationRequest
  │
  ├── CustomerService.getOrCreateCustomer(name, email, licenseYears)
  │     └── If not in DB: creates Customer with licenseIssueDate = now() - licenseYears
  │
  ├── VehicleService.getAvailableVehicle(category)
  │     └── Throws VehicleNotAvailableException if none available
  │
  ├── PricingService.calculatePrice(category, pricingRequest)
  │     └── Uses PricingStrategyFactory → appropriate strategy
  │
  ├── Reservation saved with status = ACTIVE
  │
  └── Vehicle.available = false (markUnavailable)
```

### Modification (`PUT /reservations/{id}`)

- Updates `startDate`, `endDate`, `dailyMileage`
- Recalculates `totalAmount` using customer's stored `licenseIssueDate`
- Saves updated reservation

### Cancellation (`DELETE /reservations/{id}`)

- Sets `status = CANCELLED`
- Calls `VehicleService.markAvailable(vehicle)` → `vehicle.available = true`
- Idempotent (noop if already `CANCELLED`)

### Permission Rules (Frontend)

| Role | Can Edit | Can Cancel |
|---|---|---|
| ADMIN | status === `ACTIVE` | status === `ACTIVE` |
| CUSTOMER | status === `ACTIVE` AND `startDate >= today` | status === `ACTIVE` AND `startDate >= today` |

---

## 12. Frontend Architecture

### Application Tree

```
main.jsx
  └── <ThemeProvider theme={theme}>
        └── <App />
              └── <AppRoutes />
                    └── <BrowserRouter>
                          └── <AuthProvider>
                                ├── /login    → <LoginPage />   (public)
                                └── <ProtectedRoute>
                                      └── <MainLayout>   (Header + <Outlet> + Footer)
                                            ├── /dashboard            → <Dashboard />
                                            ├── /pricing              → <PricingPage />
                                            ├── /reservations         → <ReservationManagementPage />
                                            └── /reservations/create  → <CreateReservationPage />
```

### Data Flow Per Page

```
Page mounts
  → calls service.method()
    → apiClient (Axios) attaches JWT from authService.getToken()
      → backend responds
        → component setState → re-render
```

### Frontend Directory Structure

```
frontend/src/
├── api/axios.js                  # Axios instance: baseURL, JWT interceptor, 401 redirect
├── constants/
│   ├── apiEndpoints.js           # All API path strings (use API_ENDPOINTS.*)
│   ├── authConstants.js          # USER_ROLES, STORAGE_KEYS, ADMIN_HASH_KEY
│   ├── navigation.js             # Role-based nav items
│   ├── routes.js                 # ROUTES.* constants (use instead of hardcoded paths)
│   └── vehicleCategories.js      # VEHICLE_CATEGORIES enum
├── context/AuthContext.jsx       # Auth state + loginAsAdmin/Customer/logout
├── hooks/useAuth.js              # Consumes AuthContext
├── layouts/MainLayout.jsx        # Header + <Outlet> + Footer
├── pages/                        # Thin page components (data orchestration only)
├── components/                   # Feature components + common UI
├── routes/AppRoutes.jsx          # All <Route> definitions
├── services/                     # Plain async objects calling apiClient
├── styles/theme.js               # MUI custom theme
└── utils/
    ├── authStorage.js            # localStorage helpers for session
    └── reservationPermissions.js # canEdit / canCancel logic
```

---

## 13. Frontend Routing

| Path | Component | Access |
|---|---|---|
| `/login` | `LoginPage` | Public |
| `/` | Redirect → `/dashboard` | Protected |
| `/dashboard` | `Dashboard` | Protected |
| `/pricing` | `PricingPage` | Protected |
| `/reservations` | `ReservationManagementPage` | Protected |
| `/reservations/create` | `CreateReservationPage` | Protected |
| `*` | Redirect → `/` | — |

**`ProtectedRoute`:** While `loading === true` renders `null`. If `!isAuthenticated` redirects to `/login` with `state.from`.

---

## 14. Frontend State Management

- **Global state:** `AuthContext` only (React Context, no Redux/Zustand).
- **Local state:** All other state is `useState` per component.
- **No cache layer:** No React Query / `@tanstack/react-query` in use yet.

### `useAuth()` — Provided Values

```js
{
  user,            // raw session object | null
  loading,         // true while restoring from localStorage
  isAuthenticated, // boolean
  role,            // "ADMIN" | "CUSTOMER" | null
  email,           // customer email | null
  displayName,     // shown in Header
  customerExists,  // false = new customer (not yet in DB)
  loginAsAdmin,    // (hashKey: string) => boolean
  loginAsCustomer, // ({ email, displayName, customerExists }) => void
  logout,          // () => void
}
```

---

## 15. Frontend Data Models

### Session Object (`car-rental-auth-session`)

```ts
{
  authenticated: boolean,
  role: "ADMIN" | "CUSTOMER",
  email: string | null,
  displayName: string,
  customerExists: boolean,
  loginTime: string   // ISO 8601
}
```

### JWT Auth Object (`car_rental_auth`, Customer only)

```ts
{
  token: string,
  role: "CUSTOMER",
  email: string,
  customerName: string | null
}
```

### Reservation (from API)

```ts
{
  reservationId: string,         // UUID
  customerName: string,
  customerEmail: string,
  vehicleNumber: string,
  category: "SEDAN" | "SUV" | "VAN" | "PICKUP_TRUCK",
  startDate: string,             // "YYYY-MM-DD"
  endDate: string,               // "YYYY-MM-DD"
  dailyMileage: number,
  totalAmount: number | string,
  status: "ACTIVE" | "CANCELLED"
}
```

### Pricing Request

```ts
{
  rentalDays: number,
  dailyMileage: number,
  licenseYears: number
}
```

### Reservation Create Request

```ts
{
  customerName: string,
  customerEmail: string,
  vehicleCategory: "SEDAN" | "SUV" | "VAN" | "PICKUP_TRUCK",
  startDate: string,
  endDate: string,
  dailyMileage: number,
  licenseYears: number
}
```

### Reservation Update Request

```ts
{
  startDate: string,
  endDate: string,
  dailyMileage: number
}
```

---

## 16. Error Handling

### Backend

- All unhandled exceptions caught by `GlobalExceptionHandler` (`@RestControllerAdvice`)
- All error responses use `ApiError` record: `{ timestamp, status, error, message, path }`
- Unauthorized access returns JSON from `UnauthorizedEntryPoint`

### Frontend

**Component pattern (all async operations):**

```jsx
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const doSomething = async () => {
  try {
    setLoading(true);
    setError("");
    const data = await someService.doSomething();
    // update state
  } catch (err) {
    console.error(err);
    setError("Human-readable error message.");
  } finally {
    setLoading(false);
  }
};
```

- Services **do not catch** errors — they propagate to components.
- Axios response interceptor: on `401`, calls `authService.logout()` and redirects to `/login`.
- Destructive actions use `CommonDialog` for confirmation.
- Success/error feedback after mutations uses `CommonSnackbar`.

---

## 17. Configuration & Environment

### Backend (`application.yaml`)

| Key | Description |
|---|---|
| `DB_USERNAME` | PostgreSQL username |
| `DB_PASSWORD` | PostgreSQL password |
| `MAIL_HOST` | SMTP host |
| `MAIL_PORT` | SMTP port |
| `MAIL_USERNAME` | SMTP username |
| `MAIL_PASSWORD` | SMTP password |
| `OTP_EXPIRATION_TIME_MS` | OTP validity window in milliseconds |
| `OTP_MAX_VERIFICATION_ATTEMPTS` | Max OTP check attempts before lockout |
| `OTP_MAX_GENERATION_ATTEMPTS` | Max OTP generation attempts |

- Datasource URL sets timezone to UTC.
- Test profile: `application-test.yml` with `ddl-auto: create-drop`.
- Integration tests extend `BaseIntegrationTest` (MockMvc; timezone = `Asia/Kolkata`; repos cleared before each test).

### Frontend (`.env`)

```
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

### Frontend Auth Constants

```js
ADMIN_HASH_KEY = "ADMIN@2026"   // ⚠️ Frontend-only validation
USER_ROLES     = { ADMIN: "ADMIN", CUSTOMER: "CUSTOMER" }
STORAGE_KEYS   = { AUTH_SESSION: "car-rental-auth-session" }
```

---

## 18. Development Setup

### Prerequisites

- Java 21+
- Maven 3.9+
- PostgreSQL (create database `car_rental_db`)
- Node.js 18+

### Backend

```bash
cd backend
# set env vars: DB_USERNAME, DB_PASSWORD, MAIL_HOST, MAIL_PORT, MAIL_USERNAME, MAIL_PASSWORD
./mvnw spring-boot:run
# API available at http://localhost:8080
# Swagger UI at http://localhost:8080/swagger-ui.html
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# App available at http://localhost:5173
```

### Login

| Role | Method |
|---|---|
| Admin | Hash key `ADMIN@2026` on Admin login tab |
| Customer | Any email → OTP (requires backend + mail service running) |

---

*Last updated: 2026-07-18*
