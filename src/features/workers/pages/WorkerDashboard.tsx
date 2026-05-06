import { Link } from 'react-router-dom'
import PageWrapper from '@/components/layout/PageWrapper'
import StatCard from '@/components/ui/StatCard'
import Card, { CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { PageSpinner } from '@/components/ui/Spinner'
import { useWorkerStats, usePublicJobs } from '../hooks/useWorkerProfile'
import { useAuthStore } from '@/stores/authStore'
import { useWorkerBookings } from '@/features/bookings/hooks/useBookings'
import { formatDate, formatHourlyRate, formatCurrency } from '@/utils/format'

export default function WorkerDashboard() {
  const user = useAuthStore((s) => s.user)
  const { data: stats, isLoading: statsLoading } = useWorkerStats()
  const { data: jobs, isLoading: jobsLoading } = usePublicJobs({ perPage: 4 })
  const { data: bookings } = useWorkerBookings('confirmed')

  return (
    <PageWrapper
      title={`Hi, ${user?.name?.split(' ')[0]}`}
      subtitle="Your workforce overview"
    >
      {statsLoading ? (
        <PageSpinner />
      ) : (
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard title="Confirmed Jobs" value={stats?.bookings.confirmed ?? 0} color="blue"
            icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          />
          <StatCard title="Jobs Completed" value={stats?.profile.totalJobsCompleted ?? 0} color="green"
            icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatCard title="Earnings This Month" value={formatCurrency(stats?.earnings.thisMonth ?? 0)} color="purple"
            icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatCard title="Avg. Rating" value={`${(stats?.profile.averageRating ?? 0).toFixed(1)} ⭐`} color="amber"
            icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>}
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Bookings</CardTitle>
            <Link to="/worker/bookings" className="text-sm text-[oklch(0.74_0.14_185)]">View all →</Link>
          </CardHeader>
          {bookings?.data.length === 0 ? (
            <p className="py-4 text-center text-sm text-[var(--text3)]">No upcoming bookings.</p>
          ) : (
            <ul className="divide-y divide-[var(--border)]">
              {bookings?.data.slice(0, 4).map((b) => (
                <li key={b.id} className="py-3">
                  <p className="text-sm font-medium text-[var(--text)]">{b.jobTitle}</p>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-[var(--text3)]">
                    <span>{b.employerName}</span>
                    <span>·</span>
                    <span>{formatDate(b.startDate)}</span>
                    <span>·</span>
                    <span>{formatHourlyRate(b.hourlyRate)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>New Job Opportunities</CardTitle>
            <Link to="/worker/jobs" className="text-sm text-[oklch(0.74_0.14_185)]">Browse all →</Link>
          </CardHeader>
          {jobsLoading ? (
            <PageSpinner />
          ) : (
            <ul className="divide-y divide-[var(--border)]">
              {jobs?.data.map((job) => (
                <li key={job.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--text)] truncate">{job.title}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-[var(--text3)]">
                      <span>{job.location}</span>
                      <span>·</span>
                      <span>{formatHourlyRate(job.hourlyRate)}</span>
                    </div>
                  </div>
                  {job.trade && <Badge variant="teal">{job.trade}</Badge>}
                </li>
              ))}
            </ul>
          )}
        </Card>

        {stats && stats.certifications.expiringSoon > 0 && (
          <Card className="border-amber-500/30 bg-amber-500/5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="text-sm font-semibold text-[var(--text)]">
                  {stats.certifications.expiringSoon} certification{stats.certifications.expiringSoon > 1 ? 's' : ''} expiring soon
                </p>
                <Link to="/worker/certifications" className="text-xs text-amber-600 hover:underline">
                  Review certifications →
                </Link>
              </div>
            </div>
          </Card>
        )}
      </div>
    </PageWrapper>
  )
}
