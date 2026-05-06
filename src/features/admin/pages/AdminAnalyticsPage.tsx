import { useQuery } from '@tanstack/react-query'
import PageWrapper from '@/components/layout/PageWrapper'
import StatCard from '@/components/ui/StatCard'
import Card, { CardHeader, CardTitle } from '@/components/ui/Card'
import { PageSpinner } from '@/components/ui/Spinner'
import { fetchAdminStats } from '../api'
import { formatCurrency } from '@/utils/format'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-[var(--text3)]">
      {children}
    </p>
  )
}

export default function AdminAnalyticsPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: fetchAdminStats,
  })

  if (isLoading) return <PageWrapper title="Platform Analytics"><PageSpinner /></PageWrapper>

  return (
    <PageWrapper title="Platform Analytics" subtitle="Real-time Labourix platform metrics">

      {/* Users */}
      <SectionLabel>Users</SectionLabel>
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard title="Total Users" value={(stats?.users.total ?? 0).toLocaleString()} color="blue"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
        />
        <StatCard title="Workers" value={(stats?.users.workers ?? 0).toLocaleString()} color="teal"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
        />
        <StatCard title="Employers" value={(stats?.users.employers ?? 0).toLocaleString()} color="purple"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
        />
        <StatCard title="New This Month" value={(stats?.users.newThisMonth ?? 0).toLocaleString()} color="green"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>}
        />
        <StatCard title="Available Workers" value={(stats?.platform.workersAvailable ?? 0).toLocaleString()} color="amber"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      {/* Jobs */}
      <SectionLabel>Jobs</SectionLabel>
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Total Jobs" value={(stats?.jobs.total ?? 0).toLocaleString()} color="blue"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
        />
        <StatCard title="Active" value={(stats?.jobs.active ?? 0).toLocaleString()} color="green"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
        />
        <StatCard title="Filled" value={(stats?.jobs.filled ?? 0).toLocaleString()} color="purple"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard title="Cancelled" value={(stats?.jobs.cancelled ?? 0).toLocaleString()} color="amber"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      {/* Bookings + Spend */}
      <SectionLabel>Bookings & Spend</SectionLabel>
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Total Bookings" value={(stats?.bookings.total ?? 0).toLocaleString()} color="blue"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
        />
        <StatCard title="Completed" value={(stats?.bookings.completed ?? 0).toLocaleString()} color="green"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
        />
        <StatCard title="Pending" value={(stats?.bookings.pending ?? 0).toLocaleString()} color="amber"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard title="Total Platform Spend" value={formatCurrency(stats?.platform.totalSpend ?? 0)} color="purple"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      {/* Alerts */}
      {(stats?.platform.complianceAlerts ?? 0) > 0 && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15">
              <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text)]">
                {stats?.platform.complianceAlerts} compliance alert{stats?.platform.complianceAlerts !== 1 ? 's' : ''}
              </p>
              <p className="text-xs text-[var(--text3)]">
                Workers with certifications expiring within 30 days. Review in User Management.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Breakdown cards */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Job Breakdown</CardTitle></CardHeader>
          <div className="space-y-3">
            {[
              { label: 'Draft', value: stats?.jobs.draft ?? 0, color: 'bg-[var(--surface2)]' },
              { label: 'Active', value: stats?.jobs.active ?? 0, color: 'bg-[oklch(0.74_0.14_185)]' },
              { label: 'Filled', value: stats?.jobs.filled ?? 0, color: 'bg-[oklch(0.72_0.16_145)]' },
              { label: 'Cancelled', value: stats?.jobs.cancelled ?? 0, color: 'bg-[oklch(0.65_0.2_25)]' },
            ].map(({ label, value, color }) => {
              const total = stats?.jobs.total || 1
              const pct = Math.round((value / total) * 100)
              return (
                <div key={label}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-[var(--text2)]">{label}</span>
                    <span className="font-medium text-[var(--text)]">{value.toLocaleString()} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[var(--surface2)]">
                    <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <Card>
          <CardHeader><CardTitle>Booking Breakdown</CardTitle></CardHeader>
          <div className="space-y-3">
            {[
              { label: 'Pending', value: stats?.bookings.pending ?? 0, color: 'bg-[oklch(0.78_0.15_72)]' },
              { label: 'Confirmed', value: stats?.bookings.confirmed ?? 0, color: 'bg-[oklch(0.74_0.14_185)]' },
              { label: 'Completed', value: stats?.bookings.completed ?? 0, color: 'bg-[oklch(0.72_0.16_145)]' },
              { label: 'Cancelled', value: stats?.bookings.cancelled ?? 0, color: 'bg-[oklch(0.65_0.2_25)]' },
            ].map(({ label, value, color }) => {
              const total = stats?.bookings.total || 1
              const pct = Math.round((value / total) * 100)
              return (
                <div key={label}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-[var(--text2)]">{label}</span>
                    <span className="font-medium text-[var(--text)]">{value.toLocaleString()} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[var(--surface2)]">
                    <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </PageWrapper>
  )
}
