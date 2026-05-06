import { Link, useNavigate } from 'react-router-dom'
import PageWrapper from '@/components/layout/PageWrapper'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { PageSpinner } from '@/components/ui/Spinner'
import { useEmployerStats } from '../hooks/useEmployerStats'
import { useJobs } from '../hooks/useJobs'
import { useAuthStore } from '@/stores/authStore'
import JobStatusBadge from '../components/JobStatusBadge'
import { formatDate, formatCurrency } from '@/utils/format'

function StatTile({
  title, value, sub, iconPath, iconBg, iconColor,
}: {
  title: string; value: string | number; sub?: string
  iconPath: string; iconBg: string; iconColor: string
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text3)]">{title}</p>
          <p className="mt-2 text-[26px] font-bold leading-none tracking-tight text-[var(--text)]">{value}</p>
          {sub && <p className="mt-1.5 text-[11px] text-[var(--text3)]">{sub}</p>}
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: iconBg }}>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke={iconColor} strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default function EmployerDashboard() {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const { data: stats, isLoading: statsLoading } = useEmployerStats()
  const { data: jobsData, isLoading: jobsLoading } = useJobs({ status: 'active', perPage: 5 })

  return (
    <PageWrapper
      title={`Welcome back, ${user?.name?.split(' ')[0]}`}
      subtitle="Here's your workforce overview"
      actions={<Button onClick={() => navigate('/jobs/new')}>+ Post Job</Button>}
    >
      {/* Demand Forecast Banner */}
      <div className="mb-6 flex items-center gap-4 rounded-xl border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-blue-400/5 px-5 py-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/20">
          <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[var(--text)]">Workforce Demand Forecast</p>
          <p className="text-xs text-[var(--text3)] mt-0.5">
            AI analysis suggests booking workers early this week to secure your preferred rates.{' '}
            <span className="font-medium text-blue-400">View full forecast →</span>
          </p>
        </div>
        <Link to="/demand-forecast" className="shrink-0">
          <Button size="sm">Secure Capacity</Button>
        </Link>
      </div>

      {/* Stats */}
      {statsLoading ? (
        <div className="mb-6"><PageSpinner /></div>
      ) : (
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatTile
            title="Active Jobs"
            value={stats?.jobs.active ?? 0}
            sub={`${(stats?.jobs.draft ?? 0)} in draft`}
            iconPath="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            iconBg="oklch(0.65 0.16 28 / 0.12)"
            iconColor="oklch(0.65 0.16 28)"
          />
          <StatTile
            title="Workers Booked"
            value={stats?.bookings.confirmed ?? 0}
            sub={`${stats?.bookings.pending ?? 0} pending`}
            iconPath="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
            iconBg="oklch(0.74 0.14 185 / 0.12)"
            iconColor="oklch(0.74 0.14 185)"
          />
          <StatTile
            title="Workers Hired"
            value={stats?.uniqueWorkersHired ?? 0}
            sub="unique workers"
            iconPath="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            iconBg="oklch(0.72 0.15 280 / 0.12)"
            iconColor="oklch(0.72 0.15 280)"
          />
          <StatTile
            title="Spend This Month"
            value={formatCurrency(stats?.spend.thisMonth ?? 0)}
            sub={`${formatCurrency(stats?.spend.total ?? 0)} total`}
            iconPath="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            iconBg="oklch(0.72 0.16 145 / 0.12)"
            iconColor="oklch(0.72 0.16 145)"
          />
        </div>
      )}

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Recent Jobs table — wider */}
        <div className="lg:col-span-3">
          <Card padding="none">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
              <h3 className="text-[14px] font-semibold text-[var(--text)]">Recent Jobs</h3>
              <Link to="/jobs" className="text-[12px] font-medium text-[var(--accent)] hover:opacity-80 transition-opacity">
                View All →
              </Link>
            </div>

            {jobsLoading ? (
              <div className="py-8"><PageSpinner /></div>
            ) : !jobsData?.data.length ? (
              <div className="py-12 text-center">
                <p className="text-sm text-[var(--text3)]">No active jobs.</p>
                <button onClick={() => navigate('/jobs/new')} className="mt-2 text-sm font-medium text-[var(--accent)] hover:opacity-80">
                  Post your first job →
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[var(--surface2)]">
                    <tr>
                      {['Job Title', 'Location', 'Date', 'Workers', 'Status'].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[var(--text3)]">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {jobsData.data.map((job) => (
                      <tr key={job.id} className="hover:bg-[var(--surface2)] transition-colors">
                        <td className="px-5 py-3.5">
                          <Link to={`/jobs/${job.id}`} className="font-medium text-[var(--text)] hover:text-[var(--accent)] transition-colors">
                            {job.title}
                          </Link>
                        </td>
                        <td className="px-5 py-3.5 text-[var(--text3)] text-xs">{job.location}</td>
                        <td className="px-5 py-3.5 text-[var(--text3)] text-xs whitespace-nowrap">{formatDate(job.startDate)}</td>
                        <td className="px-5 py-3.5 text-center text-[var(--text2)]">
                          {job.workersFilled != null ? `${job.workersFilled}/${job.workersNeeded}` : job.workersNeeded}
                        </td>
                        <td className="px-5 py-3.5">
                          <JobStatusBadge status={job.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Right panels */}
        <div className="lg:col-span-2 space-y-4">
          {/* Workforce Recommendation */}
          <Card>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-dim)]">
                <svg className="h-4 w-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[var(--accent)]">Workforce Recommendation</p>
                <p className="text-[10px] text-[var(--text3)]">AI Insight</p>
              </div>
            </div>
            <p className="mb-3 text-[13px] text-[var(--text2)] leading-relaxed">
              You have <span className="font-semibold text-[var(--text)]">{stats?.bookings.pending ?? 0} pending bookings</span> waiting for confirmation. Confirming them early improves worker retention.
            </p>
            <div className="rounded-lg bg-[var(--surface2)] px-3 py-2.5 text-[11px] text-[var(--text3)]">
              Optimization based on your booking patterns and platform data.
            </div>
            <Link to="/bookings" className="mt-3 block">
              <Button className="w-full" size="sm">Review Bookings</Button>
            </Link>
          </Card>

          {/* Quick Actions */}
          <Card>
            <p className="mb-3 text-[13px] font-semibold text-[var(--text)]">Quick Actions</p>
            <div className="space-y-2">
              {[
                { label: 'Post New Job',          icon: '📋', onClick: () => navigate('/jobs/new') },
                { label: 'View Bookings',          icon: '📅', href: '/bookings' },
                { label: 'AI Workforce Forecast',  icon: '📊', href: '/demand-forecast' },
                { label: 'Optimise Workforce',     icon: '⚡', href: '/workforce' },
              ].map((a) => (
                'onClick' in a ? (
                  <button
                    key={a.label}
                    onClick={a.onClick}
                    className="flex w-full items-center gap-3 rounded-lg border border-[var(--border)] px-3 py-2.5 text-left text-[13px] font-medium text-[var(--text2)] hover:border-[var(--border2)] hover:bg-[var(--surface2)] hover:text-[var(--text)] transition-colors"
                  >
                    <span>{a.icon}</span>{a.label}
                  </button>
                ) : (
                  <Link
                    key={a.label}
                    to={a.href}
                    className="flex w-full items-center gap-3 rounded-lg border border-[var(--border)] px-3 py-2.5 text-[13px] font-medium text-[var(--text2)] hover:border-[var(--border2)] hover:bg-[var(--surface2)] hover:text-[var(--text)] transition-colors"
                  >
                    <span>{a.icon}</span>{a.label}
                  </Link>
                )
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageWrapper>
  )
}
