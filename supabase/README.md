# MissionPM Database Schema

This directory contains the database schema and migrations for MissionPM.

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Run Migrations

You can run the migrations in two ways:

#### Option A: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of each migration file in order:
   - `00001_initial_schema.sql`
   - `00002_row_level_security.sql`
4. Execute each migration

#### Option B: Using Supabase CLI (Recommended)
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

## Database Schema Overview

### Core Tables

- **organizations**: Multi-tenant organization data
- **users**: User profiles (extends auth.users)
- **projects**: Project management
- **tasks**: Task tracking with hierarchy support
- **task_dependencies**: Task dependency relationships
- **contacts**: CRM contacts (donors, volunteers, partners)
- **donations**: Donation tracking
- **grants**: Grant management
- **time_entries**: Time tracking
- **shifts**: Shift scheduling
- **comments**: Task comments
- **attachments**: File attachments
- **activities**: Activity log
- **notifications**: User notifications
- **teams**: Team organization
- **team_members**: Team membership

### Security

All tables have Row-Level Security (RLS) enabled. Users can only access data from their organization. Policies are defined based on user roles:

- **admin**: Full access to organization data
- **manager**: Can manage projects, tasks, and team members
- **member**: Can view and update assigned tasks
- **volunteer**: Limited access

## TypeScript Types

To generate TypeScript types from your database schema:

```bash
npx supabase gen types typescript --project-id your-project-ref > lib/supabase/database.types.ts
```

## Indexes

The schema includes indexes on commonly queried fields for optimal performance:
- Organization lookups
- Project and task filtering
- Time entry queries
- Contact searches
