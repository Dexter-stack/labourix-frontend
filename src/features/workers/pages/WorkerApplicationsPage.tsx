import { useNavigate } from 'react-router-dom'
import PageWrapper from '@/components/layout/PageWrapper'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { PageSpinner } from '@/components/ui/Spinner'
import EmptyState from '@/components/ui/EmptyState'
import { useWorkerApplications } from '../hooks/useWorkerProfile'
import { formatDate, formatHourlyRate } from '@/utils/format'
import type { ApplicationStatus } from '@/types'

const statusConfig: Record<ApplicationStatus, { label: string; variant: 'gray' | 'green' | 'amber' | 'danger' }> = {
  pending:   { label: 'Pending',   variant: 'amber' },
  accepted:  { label: 'Accepted',  variant: 'green' },
  rejected:  { label: 'Rejected',  variant: 'danger' },
  withdrawn: { label: 'Withdrawn', variant: 'gray' },
}

export default function WorkerApplicationsPage() {
  const navigate = useNavigate()
  const { data, isLoading } = useWorkerApplications()

  return (
    <PageWrapper title="My Applications" subtitle="Jobs you've applied for">
      {isLoading ? (
        <PageSpinner />
      ) : data?.data.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="Browse available jobs and apply to get started."
          action={{ label: 'Find jobs', onClick: () => navigate('/worker/jobs') }}
        />
      ) : (
        <div className="space-y-3">
          {data?.data.map((app) => {
            const { label, variant } = statusConfig[app.status] ?? { label: app.status, variant: 'gray' as const }
            return (
              <Card key={app.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-[var(--text)]">{app.job.title}</p>
                      <Badge variant={variant}>{label}</Badge>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-[var(--text3)]">
                      <span>📍 {app.job.location}</span>
                      <span>💷 {formatHourlyRate(app.job.hourlyRate)}/hr</span>
                      {app.job.employerName && <span>🏢 {app.job.employerName}</span>}
                    </div>
                    {app.coverNote && (
                      <p className="mt-2 text-xs text-[var(--text2)] italic line-clamp-2">"{app.coverNote}"</p>
                    )}
                    <p className="mt-2 text-xs text-[var(--text3)]">Applied {formatDate(app.appliedAt)}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </PageWrapper>
  )
}
