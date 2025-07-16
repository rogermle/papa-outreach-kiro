# PAPA Volunteer Events Platform

A comprehensive volunteer management system for the Professional Asian Pilot Association (PAPA) to coordinate volunteer activities at aviation events.

## Features

- Event creation and management
- Volunteer registration and profile management
- Role-based access control (Manager, Lead, Volunteer)
- Real-time notifications and reminders
- Flight tracking integration
- Package tracking system
- After-action reporting
- Mobile-responsive design with DaisyUI

## Tech Stack

- **Framework**: Next.js 15.4.1 with React 19.1.0
- **Styling**: Tailwind CSS 4 with DaisyUI
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Google/Discord OAuth
- **Language**: TypeScript
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy environment variables:

   ```bash
   cp .env.example .env.local
   ```

4. Update `.env.local` with your actual values:

   - Supabase project URL and keys
   - OAuth provider credentials
   - API keys for external services

5. Run the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Environment Variables

See `.env.example` for all required environment variables including:

- Supabase configuration
- OAuth providers (Google, Discord)
- Email service (Resend)
- External APIs (Google Calendar, USPS, Flight tracking)

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard components
│   ├── events/         # Event management components
│   ├── forms/          # Form components
│   ├── layout/         # Layout components
│   └── ui/             # Reusable UI components
├── lib/                # Utility libraries
│   ├── auth/           # Authentication utilities
│   ├── supabase/       # Supabase client and utilities
│   ├── utils/          # General utilities
│   └── validations/    # Form validation schemas
├── types/              # TypeScript type definitions
├── hooks/              # Custom React hooks
└── context/            # React context providers
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Update documentation as needed
4. Submit pull requests for review

## License

Private project for PAPA organization.
