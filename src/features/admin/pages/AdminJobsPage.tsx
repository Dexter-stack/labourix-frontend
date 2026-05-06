import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import PageWrapper from '@/components/layout/PageWrapper'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { PageSpinner } from '@/components/ui/Spinner'
import EmptyState from '@/components/ui/EmptyState'
import JobStatusBadge from '@/features/jobs/components/JobStatusBadge'
import { fetchAdminJobs } from '../api'
import { useDebounce } from '@/hooks/useDebounce'
import { formatDate, formatHourlyRate } from '@/utils/format'

const TRADES = [
  'Electrician', 'Plumber', 'Carpenter', 'Bricklayer', 'Roofer',
  'HVAC Technician', 'Scaffolder', 'Painter', 'Plasterer', 'General Labour',
  'Welder', 'Pipefitter', 'Tiler', 'Glazier', 'Steelworker',
]

export default function AdminJobsPage() {
  const [trade, setTrade] = useState('')
  const [location, setLocation] = useState('')
  const [maxRate, setMaxRate] = useState('')
  const debouncedLocation = useDebounce(location)
  const debouncedMaxRate = useDebounce(maxRate)

  const hasFilters = !!(trade || location || maxRate)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-jobs', trade, debouncedLocation, debouncedMaxRate],
    queryFn: () => fetchAdminJobs({
      trade: trade || undefined,
      location: debouncedLocation || undefined,
      maxRate: debouncedMaxRate ? Number(debouncedMaxRate) : undefined,
    }),
  })

  const clearFilters = () => { setTrade(''); setLocation(''); setMaxRate('') }

  return (
    <PageWrapper
      title="Job Listings"
      subtitle={`${data?.meta?.total ?? 0} active jobs on platform`}
    >
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Select
          options={TRADES.map((t) => ({ value: t, label: t }))}
          placeholder="All trades"
          value={trade}
          onChange={(e) => setTrade(e.target.value)}
          className="w-44"
        />
        <Input
          placeholder="Location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-44"
        />
        <Input
          type="number"
          placeholder="Max rate (£/hr)"
          value={maxRate}
          onChange={(e) => setMaxRate(e.target.value)}
          className="w-36"
        />
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        )}
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : !data?.data.length ? (
        <EmptyState
          title="No jobs found"
          description={hasFilters ? 'Try adjusting your filters.' : 'No active job listings on the platform.'}
          action={hasFilters ? { label: 'Clear filters', onClick: clearFilters } : undefined}
        />
      ) : (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[var(--border)] bg-[var(--surface2)]">
                <tr>
                  {['Job', 'Trade', 'Employer', 'Location', 'Rate', 'Start Date', 'Workers', 'Status'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text3)]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {data.data.map((job) => (
                  <tr key={job.id} className="hover:bg-[var(--surface2)] transition-colors">
                    <td className="px-4 py-3 max-w-[200px]">
                      <p className="font-medium text-[var(--text)] truncate">{job.title}</p>
                      {job.requiredSkills?.slice(0, 2).map((s) => (
                        <Badge key={s} variant="outline" className="mr-1 mt-1">{s}</Badge>
                      ))}
                    </td>
                    <td className="px-4 py-3">
                      {job.trade && <Badge variant="teal">{job.trade}</Badge>}
                    </td>
                    <td className="px-4 py-3 text-[var(--text2)]">
                      {job.employerName ?? <span className="text-[var(--text3)]">—</span>}
                    </td>
                    <td className="px-4 py-3 text-[var(--text3)]">{job.location}</td>
                    <td className="px-4 py-3 font-medium text-[var(--text)]">
                      {formatHourlyRate(job.hourlyRate)}
                    </td>
                    <td className="px-4 py-3 text-[var(--text3)] whitespace-nowrap">
                      {formatDate(job.startDate)}
                    </td>
                    <td className="px-4 py-3 text-center text-[var(--text2)]">
                      {job.workersFilled != null
                        ? `${job.workersFilled}/${job.workersNeeded}`
                        : job.workersNeeded}
                    </td>
                    <td className="px-4 py-3">
                      <JobStatusBadge status={job.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer row count */}
          <div className="border-t border-[var(--border)] px-4 py-2.5">
            <p className="text-xs text-[var(--text3)]">
              Showing {data.data.length} of {data.meta?.total ?? data.data.length} jobs
            </p>
          </div>
        </Card>
      )}
    </PageWrapper>
  )
}
