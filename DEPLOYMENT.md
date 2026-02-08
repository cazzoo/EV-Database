# Deployment Guide

This document provides instructions for deploying the EV Community Hub application to production.

## Environment Variables

The following environment variables must be configured in your deployment platform (Vercel, Netlify, etc.):

### Required Variables

```bash
# Database
DATABASE_URL="file:./dev.db"  # For local development
# For production, use PostgreSQL:
# DATABASE_URL="postgresql://user:password@host:port/database"

# NextAuth Configuration
NEXTAUTH_SECRET="your-secret-key-here"  # Generate with: openssl rand -base64 32
NEXTAUTH_URL="https://your-domain.com"  # Your production URL
```

### Generating NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

## Database Setup

### Local Development

```bash
# Generate Prisma client
npm run db:generate

# Create database and tables
npm run db:push

# Seed demo user
npm run db:seed
```

### Production Deployment

For production, you should use a hosted database service:

1. **PostgreSQL (Recommended for Vercel)**
   - Use [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
   - Or [Supabase](https://supabase.com/)
   - Or [Neon](https://neon.tech/)
   - Or [PlanetScale](https://planetscale.com/)

2. **Update Prisma Schema**
   ```prisma
   datasource db {
     provider = "postgresql"  # Change from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

3. **Run Migrations**
   ```bash
   npx prisma migrate deploy
   ```

## Deployment Platforms

### Vercel

1. Connect your GitHub repository
2. Configure environment variables in project settings
3. Deploy automatically on push to main branch

### Other Platforms

Ensure your build command includes Prisma generation:

```json
{
  "build": "prisma generate && next build"
}
```

## Demo User Credentials

After seeding the database:

- Email: `demo@example.com`
- Password: `demo123`

## Troubleshooting

### Authentication Errors

If authentication fails with an internal server error:

1. Verify all environment variables are set
2. Check that `DATABASE_URL` is correct
3. Ensure database tables exist
4. Verify `NEXTAUTH_SECRET` is set

### Build Errors

If the build fails:

1. Ensure `prisma-client-js` is in dependencies
2. Check that build command includes `prisma generate`
3. Verify TypeScript types are correct

## Post-Deployment Setup

1. Create admin user
2. Configure payment processing (if needed)
3. Set up monitoring and error tracking
4. Configure CDN for static assets
5. Set up backup strategy for database
