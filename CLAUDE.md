# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Labourix is an AI-powered Workforce Intelligence Exchange Platform. This repo is the **React frontend only**. The Laravel REST API lives in a separate repo (`labourix-backend`).

## Tech Stack
- **Framework**: React 18 + Vite
- **Language**: TypeScript (strict mode)
- **Routing**: React Router v6
- **State Management**: Zustand (global) + React Query (server state)
- **HTTP Client**: Axios (configured instance in `src/lib/axios.ts`)
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **Real-time**: Laravel Echo + Pusher JS (worker availability, job alerts)
- **Testing**: Vitest + React Testing Library

## Commands
```bash
npm run dev        # start Vite dev server
npm run build      # production build
npm run test       # run all Vitest tests
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit

# Run a single test file
npx vitest run src/features/jobs/hooks/useJobs.test.ts
```

## Folder Structure

```
src/
├── app/
│   ├── router.tsx          # All routes defined here
│   └── providers.tsx       # App-level providers (QueryClient, Auth, etc.)
├── features/               # Feature-first organisation — one folder per domain
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── api.ts          # API calls for this feature
│   ├── jobs/
│   ├── workers/
│   ├── bookings/
│   ├── compliance/
│   ├── matching/           # AI match results display
│   ├── demand-forecast/    # Demand prediction UI
│   └── admin/
├── components/             # Shared, reusable UI components only
│   ├── ui/                 # Primitives: Button, Input, Modal, Badge, etc.
│   ├── layout/             # AppShell, Sidebar, Topbar, PageWrapper
│   └── charts/             # Recharts wrappers for dashboards
├── hooks/                  # Shared custom hooks (useDebounce, usePermissions, etc.)
├── stores/                 # Zustand stores (auth, notifications, ui)
├── lib/
│   ├── axios.ts            # Configured Axios instance (base URL, interceptors, auth header)
│   ├── echo.ts             # Laravel Echo / Pusher setup
│   └── queryClient.ts      # React Query client config
├── types/                  # Shared TypeScript interfaces (user, job, booking, worker, api)
└── utils/                  # Pure utility functions
```

## Architecture Rules

### State Management
- **React Query** manages all server state (jobs, workers, bookings, etc.).
- **Zustand** manages only client state (auth session, UI state, notification queue).
- Never store server data in Zustand.

### Data Fetching
- Use React Query (`useQuery`, `useMutation`) for all API calls — never fetch in `useEffect`.
- Each feature has its own `api.ts` with typed functions; hooks wrap React Query calls.
- Mutations must invalidate relevant queries on success.

### Forms
- All forms use React Hook Form + Zod schema validation.
- Never use uncontrolled inputs or `useState` for form fields.

### Role-Based UI
Gate UI elements with the `usePermissions` hook — never hardcode role checks inline.

```tsx
// Correct
const { can } = usePermissions();
{can('post_job') && <PostJobButton />}

// Wrong — never do this
{user.role === 'employer' && <PostJobButton />}
```

User roles: `employer`, `worker`, `admin`, `super_admin`

### Real-time Updates
Subscribe to Laravel Echo channels inside a `useEffect` with cleanup, or use a dedicated hook in `hooks/useEcho.ts`. Always call `echo.leaveChannel(...)` in the cleanup.

### Component Conventions
- Functional components only; one default export per file.
- Props typed with a TypeScript interface — no `any`.
- Co-locate component styles, tests, and hooks inside the feature folder.

## API Integration
- Base URL comes from `VITE_API_URL` in `.env`.
- All requests use the configured Axios instance in `src/lib/axios.ts`.
- Auth token is attached via a request interceptor — never manually add headers.
- 401 responses trigger automatic logout via a response interceptor.

## Environment Variables
```
VITE_API_URL=http://localhost:8000
VITE_PUSHER_APP_KEY=your_key
VITE_PUSHER_HOST=localhost
VITE_PUSHER_PORT=6001
```

## Key Routes by Role

| Role | Routes |
|------|--------|
| Employer | `/dashboard`, `/jobs`, `/jobs/:id/matches`, `/bookings`, `/workforce` |
| Worker | `/worker/dashboard`, `/worker/profile`, `/worker/jobs`, `/worker/certifications` |
| Admin | `/admin/users`, `/admin/jobs`, `/admin/analytics`, `/admin/disputes` |
