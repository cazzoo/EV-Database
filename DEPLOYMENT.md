# Deployment Guide

This document provides instructions for deploying the EV Community Hub application to production.

## Database Architecture

### Embedded SQLite (Default)

The application uses an **embedded SQLite database** by default, which offers several advantages:

- **Zero configuration**: Database is created automatically on server start
- **Self-contained**: No external database server required
- **Production-ready**: Works in both development and production environments
- **Serverless-friendly**: Suitable for platforms like Vercel, Netlify, and similar
- **Automatic initialization**: Database schema is synchronized on every server start

The database file (`ev-database.db`) is created in the project root directory on first run.

### When to Use PostgreSQL

Consider migrating to PostgreSQL for:

- Large-scale applications with high concurrent writes
- Multi-instance deployments requiring shared database access
- Applications requiring advanced database features (full-text search, JSON operations, etc.)
- Team environments with multiple developers accessing shared data

## Environment Variables

The following environment variables must be configured in your deployment platform:

### Required Variables

```bash
# Database - Embedded SQLite (default)
DATABASE_URL="file:ev-database.db"

# For PostgreSQL (optional, for larger deployments):
# DATABASE_URL="postgresql://user:password@host:port/database"

# NextAuth Configuration
NEXTAUTH_SECRET="your-secret-key-here"  # Generate with: openssl rand -base64 32
NEXTAUTH_URL="https://your-domain.com"  # Your production URL
```

### Optional Variables

```bash
# Skip automatic database initialization
# Set to 'true' only if you handle database setup manually
SKIP_DB_INIT="true"
```

### Generating NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

## Database Setup

### Automatic Initialization (Recommended)

The embedded SQLite database is **automatically initialized** when the server starts. The following happens:

1. **Prisma client generation**: Ensures latest schema is available
2. **Database schema sync**: Runs `prisma db push` to synchronize schema
3. **Seed data**: Runs seed script if database is newly created

No manual database setup is required!

### Manual Database Management

If you need to manage the database manually:

```bash
# Generate Prisma client
npm run db:generate

# Synchronize database schema
npm run db:push

# View database in Prisma Studio
npm run db:studio

# Seed demo user
npm run db:seed
```

## Deployment Platforms

### Vercel

1. Connect your GitHub repository
2. Configure environment variables in project settings:
   - `DATABASE_URL=file:ev-database.db`
   - `NEXTAUTH_SECRET=<generated-secret>`
   - `NEXTAUTH_URL=https://your-domain.vercel.app`
3. Deploy automatically on push to main branch

**Note**: Vercel's serverless functions create a new database file on each cold start. For persistent storage across deployments, consider using Vercel Postgres or attach a persistent filesystem.

### Netlify

1. Connect your GitHub repository
2. Configure environment variables in site settings
3. Set build command: `npm run build`
4. Set start command: `npm run start`

**Note**: Similar to Vercel, consider Netlify Functions persistence or use an external database for production.

### Traditional Hosting (VPS, Dedicated Server)

For traditional hosting where the filesystem persists:

1. Clone repository
2. Install dependencies: `npm install`
3. Build the application: `npm run build`
4. Start the server: `npm run start`

The embedded SQLite database will work perfectly with persistent filesystem access.

### Docker Deployment

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```

Volume mount for database persistence:
```bash
docker run -v $(pwd)/ev-database.db:/app/ev-database.db -p 3000:3000 ev-community-hub
```

## Demo User Credentials

After seeding the database:

- Email: `demo@example.com`
- Password: `demo123`

## Troubleshooting

### Authentication Errors

If authentication fails with an internal server error:

1. Verify all environment variables are set correctly
2. Check that `DATABASE_URL` points to a valid location
3. Ensure `NEXTAUTH_SECRET` is set and matches environment
4. Verify the database file has proper write permissions

### Database Initialization Issues

If the database fails to initialize:

1. Check write permissions in the application directory
2. Verify `better-sqlite3` is installed: `npm list better-sqlite3`
3. Try manual initialization: `npm run db:init`
4. Check logs for specific error messages

### Serverless Deployment Issues

For serverless platforms (Vercel, Netlify):

- The embedded database resets on each deployment
- Consider using external database for production
- Or enable persistent filesystem if platform supports it

### Build Errors

If the build fails:

1. Ensure `prisma-client-js` and `better-sqlite3` are in dependencies
2. Check that build command includes `prisma generate`
3. Verify TypeScript types are correct

## Post-Deployment Setup

1. **Create admin user** through the registration page
2. **Configure payment processing** if needed
3. **Set up monitoring** and error tracking (e.g., Sentry)
4. **Configure CDN** for static assets
5. **Set up backup strategy** - copy `ev-database.db` periodically
6. **Review environment variables** for production appropriateness

## Migrating to PostgreSQL (Optional)

If you need to migrate to PostgreSQL later:

1. **Update Prisma Schema**
   ```prisma
   datasource db {
     provider = "postgresql"  # Change from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

2. **Export data from SQLite**
   ```bash
   npx prisma db pull
   ```

3. **Update environment variables**
   - Set `DATABASE_URL` to PostgreSQL connection string

4. **Run migrations**
   ```bash
   npx prisma migrate deploy
   ```

5. **Import data** (manual or using migration script)

## Database Backup

### Embedded SQLite Backup

```bash
# Create backup
cp ev-database.db ev-database-backup-$(date +%Y%m%d).db

# Restore from backup
cp ev-database-backup-20240101.db ev-database.db
```

### Automated Backup Script

```bash
#!/bin/bash
# backup-db.sh
BACKUP_DIR="./backups"
mkdir -p $BACKUP_DIR
cp ev-database.db "$BACKUP_DIR/ev-database-$(date +%Y%m%d-%H%M%S).db"
# Keep only last 7 days
find $BACKUP_DIR -name "ev-database-*.db" -mtime +7 -delete
```

Set up cron job for daily backups:
```bash
0 2 * * * /path/to/backup-db.sh
```
