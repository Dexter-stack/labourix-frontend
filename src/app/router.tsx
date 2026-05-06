import { createBrowserRouter, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import AppShell from '@/components/layout/AppShell'

// Auth pages
import LoginPage from '@/features/auth/pages/LoginPage'
import RegisterPage from '@/features/auth/pages/RegisterPage'
import VerifyEmailPage from '@/features/auth/pages/VerifyEmailPage'
import ForgotPasswordPage from '@/features/auth/pages/ForgotPasswordPage'

// Employer pages
import EmployerDashboard from '@/features/jobs/pages/EmployerDashboard'
import JobsPage from '@/features/jobs/pages/JobsPage'
import PostJobPage from '@/features/jobs/pages/PostJobPage'
import JobDetailPage from '@/features/jobs/pages/JobDetailPage'
import JobMatchesPage from '@/features/matching/pages/JobMatchesPage'
import JobApplicationsPage from '@/features/jobs/pages/JobApplicationsPage'
import BookingsPage from '@/features/bookings/pages/BookingsPage'
import WorkforcePage from '@/features/jobs/pages/WorkforcePage'
import DemandForecastPage from '@/features/demand-forecast/pages/DemandForecastPage'

// Worker pages
import WorkerDashboard from '@/features/workers/pages/WorkerDashboard'
import WorkerJobsPage from '@/features/workers/pages/WorkerJobsPage'
import WorkerBookingsPage from '@/features/workers/pages/WorkerBookingsPage'
import WorkerProfilePage from '@/features/workers/pages/WorkerProfilePage'
import WorkerApplicationsPage from '@/features/workers/pages/WorkerApplicationsPage'
import CertificationsPage from '@/features/compliance/pages/CertificationsPage'
import AddCertificationPage from '@/features/compliance/pages/AddCertificationPage'

// Admin pages
import AdminUsersPage from '@/features/admin/pages/AdminUsersPage'
import AdminUserDetailPage from '@/features/admin/pages/AdminUserDetailPage'
import AdminJobsPage from '@/features/admin/pages/AdminJobsPage'
import AdminAnalyticsPage from '@/features/admin/pages/AdminAnalyticsPage'
import AdminDisputesPage from '@/features/admin/pages/AdminDisputesPage'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

function RequireGuest({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const user = useAuthStore((s) => s.user)
  if (isAuthenticated) {
    const home = user?.role === 'worker' ? '/worker/dashboard' : user?.role?.includes('admin') ? '/admin/users' : '/dashboard'
    return <Navigate to={home} replace />
  }
  return <>{children}</>
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <RequireGuest><LoginPage /></RequireGuest>,
  },
  {
    path: '/register',
    element: <RequireGuest><RegisterPage /></RequireGuest>,
  },
  {
    path: '/verify-email',
    element: <RequireGuest><VerifyEmailPage /></RequireGuest>,
  },
  {
    path: '/forgot-password',
    element: <RequireGuest><ForgotPasswordPage /></RequireGuest>,
  },
  {
    path: '/',
    element: <RequireAuth><AppShell /></RequireAuth>,
    children: [
      { index: true, element: <RootRedirect /> },

      // Employer routes
      { path: 'dashboard', element: <EmployerDashboard /> },
      { path: 'jobs', element: <JobsPage /> },
      { path: 'jobs/new', element: <PostJobPage /> },
      { path: 'jobs/:id', element: <JobDetailPage /> },
      { path: 'jobs/:id/edit', element: <PostJobPage /> },
      { path: 'jobs/:id/matches', element: <JobMatchesPage /> },
      { path: 'jobs/:id/applications', element: <JobApplicationsPage /> },
      { path: 'bookings', element: <BookingsPage /> },
      { path: 'workforce', element: <WorkforcePage /> },
      { path: 'demand-forecast', element: <DemandForecastPage /> },

      // Worker routes
      { path: 'worker/dashboard', element: <WorkerDashboard /> },
      { path: 'worker/jobs', element: <WorkerJobsPage /> },
      { path: 'worker/bookings', element: <WorkerBookingsPage /> },
      { path: 'worker/applications', element: <WorkerApplicationsPage /> },
      { path: 'worker/profile', element: <WorkerProfilePage /> },
      { path: 'worker/certifications', element: <CertificationsPage /> },
      { path: 'worker/certifications/new', element: <AddCertificationPage /> },

      // Admin routes
      { path: 'admin/users', element: <AdminUsersPage /> },
      { path: 'admin/users/:id', element: <AdminUserDetailPage /> },
      { path: 'admin/jobs', element: <AdminJobsPage /> },
      { path: 'admin/analytics', element: <AdminAnalyticsPage /> },
      { path: 'admin/disputes', element: <AdminDisputesPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])

function RootRedirect() {
  const user = useAuthStore((s) => s.user)
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'worker') return <Navigate to="/worker/dashboard" replace />
  if (user.role === 'admin' || user.role === 'super_admin') return <Navigate to="/admin/users" replace />
  return <Navigate to="/dashboard" replace />
}
