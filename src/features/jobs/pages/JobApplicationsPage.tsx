import { useState, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageWrapper from '@/components/layout/PageWrapper'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import Modal from '@/components/ui/Modal'
import { PageSpinner } from '@/components/ui/Spinner'
import EmptyState from '@/components/ui/EmptyState'
import { useJob } from '../hooks/useJobs'
import { useJobApplications } from '../hooks/useJobs'
import { useCreateBooking } from '@/features/bookings/hooks/useBookings'
import { formatDate, formatHourlyRate } from '@/utils/format'
import type { ApplicationStatus, JobApplication } from '@/types'

const statusConfig: Record<ApplicationStatus, { label: string; variant: 'gray' | 'green' | 'amber' | 'danger' }> = {
  pending:   { label: 'Pending',   variant: 'amber' },
  accepted:  { label: 'Accepted',  variant: 'green' },
  rejected:  { label: 'Rejected',  variant: 'danger' },
  withdrawn: { label: 'Withdrawn', variant: 'gray' },
}

function ApplicantCard({
  app,
  onBook,
  isBooking,
}: {
  app: JobApplication
  onBook: (app: JobApplication) => void
  isBooking: boolean
}) {
  const { label, variant } = statusConfig[app.status] ?? { label: app.status, variant: 'gray' as const }
  const worker = app.worker

  return (
    <Card>
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="shrink-0">
          <Avatar name={worker?.name ?? '?'} size="lg" />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Name + status row */}
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-base font-semibold text-[var(--text)]">
                  {worker?.name ?? 'Unknown worker'}
                </span>
                <Badge variant={variant}>{label}</Badge>
                {worker?.tradeCategory && (
                  <Badge variant="teal">{worker.tradeCategory}</Badge>
                )}
              </div>

              {/* Worker meta */}
              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--text3)]">
                {worker?.location && (
                  <span className="flex items-center gap-1">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {worker.location}
                  </span>
                )}
                {worker?.hourlyRate != null && (
                  <span className="flex items-center gap-1">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatHourlyRate(worker.hourlyRate)}/hr
                  </span>
                )}
                {worker?.rating != null && (
                  <span className="flex items-center gap-1">
                    <svg className="h-3.5 w-3.5 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>{worker.rating.toFixed(1)}</span>
                    {worker.ratingCount != null && (
                      <span className="text-[var(--text3)]">({worker.ratingCount} reviews)</span>
                    )}
                  </span>
                )}
              </div>
            </div>

            {/* Book action */}
            {app.status === 'pending' && worker && (
              <Button
                size="sm"
                loading={isBooking}
                onClick={() => onBook(app)}
                className="shrink-0"
              >
                Book Worker
              </Button>
            )}
          </div>

          {/* Cover note */}
          {app.coverNote && (
            <blockquote className="mt-3 border-l-2 border-[var(--border2)] pl-3 text-sm text-[var(--text2)] italic leading-relaxed">
              "{app.coverNote}"
            </blockquote>
          )}

          {/* Footer */}
          <p className="mt-3 text-xs text-[var(--text3)]">
            Applied {formatDate(app.appliedAt)}
          </p>
        </div>
      </div>
    </Card>
  )
}

type TabValue = '' | ApplicationStatus

export default function JobApplicationsPage() {
  const { id: jobId } = useParams<{ id: string }>()
  const { data: job } = useJob(jobId!)
  const { data, isLoading } = useJobApplications(jobId!)
  const createBooking = useCreateBooking()

  const [activeTab, setActiveTab] = useState<TabValue>('')
  const [bookingApp, setBookingApp] = useState<JobApplication | null>(null)

  const counts = useMemo(() => {
    const all = data?.data ?? []
    return {
      '': all.length,
      pending: all.filter((a) => a.status === 'pending').length,
      accepted: all.filter((a) => a.status === 'accepted').length,
      rejected: all.filter((a) => a.status === 'rejected').length,
      withdrawn: all.filter((a) => a.status === 'withdrawn').length,
    }
  }, [data])

  const filtered = useMemo(() => {
    const all = data?.data ?? []
    return activeTab ? all.filter((a) => a.status === activeTab) : all
  }, [data, activeTab])

  const tabs: { label: string; value: TabValue }[] = [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'Accepted', value: 'accepted' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Withdrawn', value: 'withdrawn' },
  ]

  const handleBook = (app: JobApplication) => setBookingApp(app)

  const confirmBook = () => {
    if (!bookingApp?.worker) return
    createBooking.mutate(
      { jobListingId: jobId!, workerId: bookingApp.worker.id },
      { onSuccess: () => setBookingApp(null) }
    )
  }

  return (
    <PageWrapper
      title="Applicants"
      subtitle={job ? `${data?.data.length ?? 0} application${(data?.data.length ?? 0) !== 1 ? 's' : ''} for ${job.title}` : 'Loading...'}
      actions={
        <Link to={`/jobs/${jobId}`}>
          <Button variant="outline">← Back to Job</Button>
        </Link>
      }
    >
      {/* Summary strip */}
      {!isLoading && (data?.data.length ?? 0) > 0 && (
        <div className="mb-5 grid grid-cols-4 gap-3">
          {(
            [
              { label: 'Pending',   value: counts.pending,   color: 'text-[oklch(0.78_0.15_72)]',    bg: 'bg-[oklch(0.78_0.15_72_/_0.08)]'  },
              { label: 'Accepted',  value: counts.accepted,  color: 'text-[oklch(0.72_0.16_145)]',   bg: 'bg-[oklch(0.72_0.16_145_/_0.08)]' },
              { label: 'Rejected',  value: counts.rejected,  color: 'text-[oklch(0.65_0.2_25)]',     bg: 'bg-[oklch(0.65_0.2_25_/_0.08)]'   },
              { label: 'Withdrawn', value: counts.withdrawn, color: 'text-[var(--text3)]',            bg: 'bg-[var(--surface2)]'              },
            ] as const
          ).map((s) => (
            <div key={s.label} className={`rounded-xl p-3 ${s.bg}`}>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-[var(--text3)] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter tabs */}
      <div className="mb-4 flex gap-1 overflow-x-auto">
        {tabs.map((t) => {
          const count = counts[t.value]
          return (
            <button
              key={t.value}
              onClick={() => setActiveTab(t.value)}
              className={`shrink-0 flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === t.value
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--text2)] hover:bg-[var(--surface2)]'
              }`}
            >
              {t.label}
              {count > 0 && (
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none ${
                  activeTab === t.value
                    ? 'bg-white/25 text-white'
                    : 'bg-[var(--surface2)] text-[var(--text3)]'
                }`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Content */}
      {isLoading ? (
        <PageSpinner />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={activeTab ? `No ${activeTab} applications` : 'No applications yet'}
          description={
            activeTab
              ? `No applicants with status "${activeTab}" for this job.`
              : "Workers haven't applied to this job yet. Make sure it's active and visible."
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => (
            <ApplicantCard
              key={app.id}
              app={app}
              onBook={handleBook}
              isBooking={createBooking.isPending && bookingApp?.worker?.id === app.worker?.id}
            />
          ))}
        </div>
      )}

      {/* Book confirmation modal */}
      <Modal
        open={!!bookingApp}
        onClose={() => setBookingApp(null)}
        title="Confirm booking"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setBookingApp(null)} type="button">Cancel</Button>
            <Button loading={createBooking.isPending} onClick={confirmBook} type="button">
              Confirm booking
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl bg-[var(--surface2)] p-4">
            <Avatar name={bookingApp?.worker?.name ?? '?'} size="lg" />
            <div>
              <p className="font-semibold text-[var(--text)]">{bookingApp?.worker?.name}</p>
              <div className="mt-0.5 flex flex-wrap gap-2 text-xs text-[var(--text3)]">
                {bookingApp?.worker?.tradeCategory && <span>{bookingApp.worker.tradeCategory}</span>}
                {bookingApp?.worker?.location && <span>· {bookingApp.worker.location}</span>}
                {bookingApp?.worker?.hourlyRate != null && (
                  <span>· {formatHourlyRate(bookingApp.worker.hourlyRate)}/hr</span>
                )}
              </div>
            </div>
          </div>
          <p className="text-sm text-[var(--text2)]">
            You're about to book <strong className="text-[var(--text)]">{bookingApp?.worker?.name}</strong> for{' '}
            <strong className="text-[var(--text)]">{job?.title}</strong>. The worker will be notified and the booking will appear in your Bookings page.
          </p>
        </div>
      </Modal>
    </PageWrapper>
  )
}
