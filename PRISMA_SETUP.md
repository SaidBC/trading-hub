# Prisma Setup for Trading Hub

This document provides instructions for setting up the Prisma database for the Trading Hub application.

## Environment Setup

1. Create a `.env` file in the root directory with the following content:

```
DATABASE_URL="postgresql://username:password@localhost:5432/trading_hub?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here" # Generate with: openssl rand -base64 32
```

Replace `username`, `password`, and other values with your actual PostgreSQL credentials.

## Database Migration

After setting up the environment variables, run the following commands to create and apply the database migrations:

```bash
# Generate Prisma client
npx prisma generate

# Create and apply migrations
npx prisma migrate dev --name init
```

## Database Schema

The database schema includes the following models:

- **User**: User accounts with role-based access control
- **Account**: OAuth accounts linked to users (for Next-Auth)
- **Session**: User sessions for authentication
- **VerificationToken**: For email verification
- **Post**: User posts/listings
- **Message**: Messages between users

## Authentication

The application uses Next-Auth with the Prisma adapter for authentication. The following routes are available:

- `/auth/login`: User login
- `/auth/signup`: User registration

## API Routes

- `/api/auth/[...nextauth]`: Next-Auth API routes
- `/api/auth/signup`: User registration API
