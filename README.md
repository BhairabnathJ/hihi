# MissionPM

**Integrated Project Management & CRM System for Nonprofits**

MissionPM is an all-in-one, cloud-based platform that combines project management, CRM, HR management, time tracking, and scheduling—specifically designed for nonprofit organizations.

## Features

- **Project Management**: Kanban boards, Gantt charts, task tracking, and dependencies
- **CRM**: Donor management, volunteer coordination, and contact tracking
- **Grant Management**: Track applications, deadlines, and deliverables
- **Time Tracking**: Manual entry, timesheets, and project time allocation
- **HR Management**: Employee database, onboarding, and PTO tracking
- **Real-time Collaboration**: Comments, mentions, and live updates
- **Mobile-Responsive**: Works on all devices

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Real-time)
- **UI Components**: shadcn/ui
- **State Management**: Zustand, React Query
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account ([sign up here](https://supabase.com))

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd hihi
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Set up the database:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the migration files in order from `/supabase/migrations/`
   - See [supabase/README.md](./supabase/README.md) for detailed instructions

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── page.tsx           # Landing page
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utility functions
│   ├── supabase/         # Supabase client configuration
│   └── utils.ts          # Helper functions
├── supabase/             # Database schema and migrations
│   ├── migrations/       # SQL migration files
│   └── README.md         # Database documentation
└── hooks/                # Custom React hooks
```

## Database Schema

The database includes the following core tables:
- **organizations**: Multi-tenant organization data
- **users**: User profiles and roles
- **projects**: Project management
- **tasks**: Task tracking with hierarchy
- **contacts**: CRM contacts (donors, volunteers, partners)
- **donations**: Donation tracking
- **grants**: Grant management
- **time_entries**: Time tracking
- **shifts**: Shift scheduling

All tables have Row-Level Security (RLS) enabled for data isolation.

See [supabase/README.md](./supabase/README.md) for complete schema documentation.

## Authentication

MissionPM supports:
- Email/password authentication
- Google OAuth (requires Google OAuth credentials)
- Magic link login (planned)

## Development Roadmap

### Phase 1: MVP (Current)
- [x] Project setup and configuration
- [x] Database schema and RLS policies
- [x] Authentication system
- [x] Landing page and basic UI
- [ ] Base UI components
- [ ] Organization onboarding
- [ ] Project management module
- [ ] Task management (Kanban, List views)
- [ ] Basic time tracking
- [ ] Contact management

### Phase 2: Enhanced Features
- [ ] Multiple project views (Gantt, Calendar)
- [ ] Advanced time tracking
- [ ] Donor and grant management
- [ ] Team collaboration features
- [ ] Notifications system
- [ ] Advanced reporting

### Phase 3: Agile & HR
- [ ] Agile/Scrum features
- [ ] HR management
- [ ] Scheduling and shifts
- [ ] Workflow automation

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

[Add your license here]

## Support

For support, email [your-email] or open an issue in the repository.

---

Built with ❤️ for nonprofits
