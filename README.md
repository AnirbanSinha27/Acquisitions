# Acquisitions App

A Node.js/Express application with Neon Database integration, fully Dockerized for development and production environments.

## 🚀 Quick Start

### Development (with Neon Local)

```powershell
# 1. Copy and configure environment file
cp .env.development .env.development.local

# 2. Add your Neon credentials to .env.development.local

# 3. Start the development environment
.\start-dev.ps1

# Or manually:
docker-compose -f docker-compose.dev.yml --env-file .env.development.local up -d
```

### Production (with Neon Cloud)

```powershell
# 1. Copy and configure environment file
cp .env.production .env.production.local

# 2. Add your Neon Cloud DATABASE_URL to .env.production.local

# 3. Start the production environment
.\start-prod.ps1

# Or manually:
docker-compose -f docker-compose.prod.yml --env-file .env.production.local up -d
```

## 📋 Prerequisites

- **Docker Desktop** (20.10.0+)
- **Docker Compose** (2.0.0+)
- **Neon Account** ([Sign up](https://console.neon.tech))

## 🏗️ Architecture

### Development Environment

- **Neon Local**: Creates ephemeral database branches automatically
- **Fresh data**: Each container start gets a new, clean database copy
- **Isolated testing**: Changes don't affect production data
- **Git integration**: Persistent branches per Git branch (optional)

### Production Environment

- **Neon Cloud**: Direct connection to production database
- **Optimized**: No proxy overhead
- **Secure**: Environment-based secrets management
- **Scalable**: Production-ready configuration

## 📁 Project Structure

```
.
├── src/                          # Application source code
├── drizzle/                      # Database migrations
├── docker-compose.dev.yml        # Development configuration (Neon Local)
├── docker-compose.prod.yml       # Production configuration (Neon Cloud)
├── Dockerfile                    # Multi-stage Docker build
├── .env.development              # Development environment template
├── .env.production               # Production environment template
├── start-dev.ps1                 # Development startup script
├── start-prod.ps1                # Production startup script
├── DOCKER_README.md              # Detailed Docker documentation
└── README.md                     # This file
```

## 🔧 Configuration

### Development Environment Variables

Create `.env.development.local` with:

```env
# Neon Configuration
NEON_API_KEY=your_neon_api_key
NEON_PROJECT_ID=your_project_id
PARENT_BRANCH_ID=your_main_branch_id

# Application
PORT=3000
DATABASE_NAME=neondb
ARCJET_KEY=your_arcjet_key
```

### Production Environment Variables

Create `.env.production.local` with:

```env
# Neon Cloud Database
DATABASE_URL=postgresql://user:pass@endpoint.aws.neon.tech/dbname?sslmode=require

# Application
PORT=3000
ARCJET_KEY=your_production_arcjet_key
```

## 🗄️ Database Operations

### Running Migrations

**Development:**

```powershell
# Generate migrations
docker-compose -f docker-compose.dev.yml exec app npm run db:generate

# Apply migrations
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate

# Open Drizzle Studio
docker-compose -f docker-compose.dev.yml exec app npm run db:studio
```

**Production:**

```powershell
# Apply migrations
docker-compose -f docker-compose.prod.yml exec app npm run db:migrate
```

## 📊 Monitoring & Logs

```powershell
# View all logs
docker-compose -f docker-compose.dev.yml logs -f

# View app logs only
docker-compose -f docker-compose.dev.yml logs -f app

# View Neon Local logs
docker-compose -f docker-compose.dev.yml logs -f neon-local
```

## 🛑 Stopping Services

```powershell
# Development
docker-compose -f docker-compose.dev.yml down

# Production
docker-compose -f docker-compose.prod.yml down

# Remove volumes (clean slate)
docker-compose -f docker-compose.dev.yml down -v
```

## 🔍 Useful Commands

```powershell
# Check container status
docker ps

# Restart a specific service
docker-compose -f docker-compose.dev.yml restart app

# Rebuild containers
docker-compose -f docker-compose.dev.yml build --no-cache

# Access container shell
docker-compose -f docker-compose.dev.yml exec app sh

# Run commands inside container
docker-compose -f docker-compose.dev.yml exec app npm run lint
```

## 🐛 Troubleshooting

### Port Already in Use

```powershell
# Check what's using port 3000 or 5432
netstat -ano | findstr :3000
netstat -ano | findstr :5432

# Change PORT in .env file if needed
```

### Container Won't Start

```powershell
# Check Docker logs
docker-compose -f docker-compose.dev.yml logs

# Verify Docker is running
docker info

# Clean up and restart
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d
```

### Database Connection Issues

```powershell
# Verify Neon credentials
docker-compose -f docker-compose.dev.yml logs neon-local

# Check database connectivity
docker-compose -f docker-compose.dev.yml exec app npm run db:studio
```

For detailed troubleshooting, see [DOCKER_README.md](./DOCKER_README.md).

## 📚 Documentation

- **[DOCKER_README.md](./DOCKER_README.md)** - Comprehensive Docker deployment guide
- **[Neon Local Docs](https://neon.com/docs/local/neon-local)** - Official Neon Local documentation
- **[Neon Branching Guide](https://neon.com/docs/introduction/branching)** - Database branching concepts

## 🔐 Security Best Practices

1. ✅ Never commit `.env.*.local` files
2. ✅ Use secrets management in production (AWS Secrets Manager, etc.)
3. ✅ Rotate API keys regularly
4. ✅ Use least-privilege database users
5. ✅ Enable SSL/TLS for all connections
6. ✅ Keep Docker images updated

## 🤝 Contributing

1. Create a feature branch
2. Use Neon Local for isolated development
3. Run linting: `npm run lint`
4. Test your changes
5. Submit a pull request


## 🆘 Support

- **Neon Database Issues**: [Neon Support](https://neon.tech/docs/introduction/support)
- **Application Issues**: Create a GitHub issue
- **Docker Issues**: [Docker Documentation](https://docs.docker.com/)

---

**Made with ❤️ using Node.js, Express, Neon Database, and Docker**
