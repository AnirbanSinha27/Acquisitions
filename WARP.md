# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Setup
- `npm install` - Install dependencies

### Running the Application
- `npm run dev` - Start the development server with Node watch mode (auto-reloads on file changes)
- Server runs on `http://localhost:3000` by default (configurable via `PORT` environment variable)

### Code Quality
- `npm run lint` - Run ESLint to check for code issues
- `npm run lint:fix` - Automatically fix ESLint issues
- `npm run format` - Format code with Prettier (note: package.json has typo "wite" instead of "write")
- `npm run format:check` - Check if code is properly formatted

### Testing
- No test framework or `test` script is configured in `package.json`.
- ESLint is configured to recognize Jest globals under `tests/**/*.js`, but Jest is not installed and there is no `tests/` directory.
- Running a single test is not applicable until a test runner is added.

### Database Operations (Drizzle ORM)
- `npm run db:generate` - Generate database migrations from schema changes
- `npm run db:migrate` - Apply pending migrations to the database
- `npm run db:studio` - Open Drizzle Studio for database inspection

## Architecture Overview

### Tech Stack
- **Framework**: Express.js (v5.x) with ES modules
- **Database**: PostgreSQL via Neon serverless with Drizzle ORM
- **Authentication**: JWT tokens stored in httpOnly cookies
- **Validation**: Zod schemas
- **Logging**: Winston (logs to `logs/combined.log` and `logs/error.log`)
- **Security**: Helmet, CORS, bcrypt password hashing

### Application Structure
The app follows a layered architecture with path aliases defined in `package.json`:

```
src/
├── index.js           # Entry point (loads .env and starts server)
├── server.js          # HTTP server initialization
├── app.js             # Express app configuration and middleware setup
├── config/            # Configuration modules
│   ├── database.js    # Drizzle DB instance using Neon serverless
│   └── logger.js      # Winston logger configuration
├── routes/            # API route definitions
│   └── auth.routes.js # Authentication endpoints
├── controllers/       # Request handlers
│   └── auth.controller.js
├── services/          # Business logic layer
│   └── auth.service.js # User creation, password hashing
├── models/            # Drizzle ORM schemas
│   └── user.model.js  # Users table schema
├── validations/       # Zod validation schemas
│   └── auth.validation.js
├── middleware/        # Custom Express middleware (currently empty)
└── utils/             # Helper utilities
    ├── jwt.js         # JWT sign/verify operations
    ├── cookies.js     # Cookie management utilities
    └── format.js      # Error formatting helpers
```

### Import Path Aliases
The project uses Node.js subpath imports (not TypeScript paths). Import using the `#` prefix:
- `#config/*` → `./src/config/*`
- `#controllers/*` → `./src/controllers/*`
- `#middleware/*` → `./src/middleware/*`
- `#models/*` → `./src/models/*`
- `#routes/*` → `./src/routes/*`
- `#services/*` → `./src/services/*`
- `#utils/*` → `./src/utils/*`
- `#validations/*` → `./src/validations/*`

Example: `import logger from '#config/logger.js'`

### Key Architectural Patterns

#### Request Flow
1. **Route** (`routes/*.js`) - Maps HTTP endpoints to controllers
2. **Controller** (`controllers/*.js`) - Validates input via Zod schemas, calls services, formats responses
3. **Service** (`services/*.js`) - Contains business logic, interacts with database via Drizzle
4. **Model** (`models/*.js`) - Drizzle schema definitions for database tables

#### Authentication Flow
- JWT tokens are generated on signup/signin
- Tokens are stored in httpOnly cookies (not localStorage)
- Cookie max age: 15 minutes (see `utils/cookies.js`)
- Token expiration: 1 day (see `utils/jwt.js`)

#### Database Schema Management
- Database models are defined using Drizzle's `pgTable` API in `src/models/`
- Schema changes require running `npm run db:generate` to create migrations
- Migrations are stored in the `drizzle/` directory
- Apply migrations with `npm run db:migrate`

### Environment Configuration
Required environment variables (stored in `.env`):
- `DATABASE_URL` - PostgreSQL connection string (Neon serverless)
- `JWT_SECRET` - Secret key for JWT signing
- `PORT` - Server port (defaults to 3000)
- `LOG_LEVEL` - Winston log level (defaults to 'info')
- `NODE_ENV` - Environment ('production' enables secure cookies and disables console logging)

### Code Style Enforcement
- **ESLint**: Enforces 2-space indentation, single quotes, semicolons, no unused vars (except `_` prefix)
- **Prettier**: Configured but note the typo in package.json `format` script
- Files ignored by linting: `node_modules/`, `coverage/`, `logs/`, `drizzle/`

### API Endpoints
- `GET /` - Basic health check
- `GET /health` - Detailed health check with uptime
- `GET /api` - API status check
- `POST /api/auth/sign-up` - User registration (implemented)
- `POST /api/auth/sign-in` - User login (placeholder)
- `POST /api/auth/sign-out` - User logout (placeholder)

### Known Issues
1. `package.json` line 19: `format` script has typo "wite" instead of "write"
2. `src/utils/jwt.js` line 21: Typo "loggers.error" should be "logger.error"
3. `src/services/auth.service.js` line 18: Missing `await` on database query - should be `await db.select()`
4. `src/validations/auth.validation.js` line 5: `z.email()` is invalid; should be `z.string().email()` and then chain `.max(255).toLowerCase().trim()`.
5. Error message mismatch: controller checks for `'User with this email already exists'` but service throws `'User already exists'`; align messages to ensure correct 409 handling.

## Development Guidelines

### Adding New Features
1. **Create model** in `src/models/` using Drizzle schema
2. **Generate migration**: `npm run db:generate`
3. **Apply migration**: `npm run db:migrate`
4. **Add validation schema** in `src/validations/`
5. **Implement service** logic in `src/services/`
6. **Create controller** in `src/controllers/`
7. **Define routes** in `src/routes/`
8. **Register routes** in `src/app.js`

### Error Handling Pattern
- Controllers use try-catch blocks
- Validation errors return 400 with formatted error details
- Business logic errors are logged and passed to error middleware via `next(error)`
- Service layer throws errors that controllers catch and format

### Logging Best Practices
- Use `logger.info()` for general information
- Use `logger.error()` for errors with stack traces
- Logs are automatically formatted with timestamps in JSON
- Morgan middleware logs all HTTP requests through Winston
