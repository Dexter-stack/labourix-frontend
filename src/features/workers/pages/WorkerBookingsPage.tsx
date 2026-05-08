import { useState } from 'react'
import PageWrapper from '@/components/layout/PageWrapper'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Textarea from '@/components/ui/Textarea'
import { PageSpinner } from '@/components/ui/Spinner'
import EmptyState from '@/components/ui/EmptyState'
import { useWorkerBookings, useCancelWorkerBooking } from '@/features/bookings/hooks/useBookings'
import { formatDate, formatCurrency } from '@/utils/format'
import type { BookingStatus } from '@/types'

const statusConfig: Record<BookingStatus, { label: string; variant: 'gray' | 'green' | 'amber' | 'danger' | 'teal' }> = {
  pending:     { label: 'Pending',     variant: 'amber' },
  confirmed:   { label: 'Confirmed',   variant: 'green' },
  in_progress: { label: 'In Progress', variant: 'teal' },
  completed:   { label: 'Completed',   variant: 'gray' },
  cancelled:   { label: 'Cancelled',   variant: 'danger' },
  disputed:    { label: 'Disputed',    variant: 'danger' },
}

const tabs: { label: string; value: string }[] = [
  { label: 'All', value: '' },
  { label: 'Upcoming', value: 'confirmed' },
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
]

export default function WorkerBookingsPage() {
  const [tab, setTab] = useState('')
  const [cancelId, setCancelId] = useState<string | null>(null)
  const [cancelReason, setCancelReason] = useState('')
  const { data, isLoading } = useWorkerBookings(tab || undefined)
  const cancelBooking = useCancelWorkerBooking()

  const handleCancelOpen = (id: string) => {
    setCancelId(id)
    setCancelReason('')
  }

  const handleCancelClose = () => {
    setCancelId(null)
    setCancelReason('')
  }

  const handleCancelConfirm = () => {
    if (!cancelId || !cancelReason.trim()) return
    cancelBooking.mutate({ id: cancelId, reason: cancelReason.trim() }, { onSuccess: handleCancelClose })
  }

  return (
    <PageWrapper title="My Bookings" subtitle="Your job history and upcoming work">
      <div className="mb-4 flex gap-1 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${tab === t.value ? 'bg-[var(--accent)] text-white' : 'text-[var(--text2)] hover:bg-[var(--surface2)]'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : data?.data.length === 0 ? (
        <EmptyState title="No bookings yet" description="Apply to jobs to start building your history." />
      ) : (
        <div className="space-y-3">
          {data?.data.map((booking) => {
            const { label, variant } = statusConfig[booking.status] ?? { label: booking.status, variant: 'gray' as const }
            return (
              <Card key={booking.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-[var(--text)]">{booking.jobTitle}</p>
                      <Badge variant={variant}>{label}</Badge>
                    </div>
                    <p className="text-sm text-[var(--text3)] mt-0.5">{booking.employerName}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-[var(--text3)]">
                      <span>📅 {formatDate(booking.startDate)}</span>
                      {booking.endDate && <span>→ {formatDate(booking.endDate)}</span>}
                      <span>💷 {formatCurrency(booking.hourlyRate)}/hr</span>
                      {booking.totalAmount && <span>Total: {formatCurrency(booking.totalAmount)}</span>}
                    </div>
                    {booking.workerRating && (
                      <p className="mt-2 text-xs text-[var(--text3)]">Your rating: {'⭐'.repeat(booking.workerRating)}</p>
                    )}
                  </div>
                  {(booking.status === 'pending' || booking.status === 'confirmed') && (
                    <Button size="sm" variant="outline" onClick={() => handleCancelOpen(booking.id)}>
                      Cancel
                    </Button>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <Modal
        open={!!cancelId}
        onClose={handleCancelClose}
        title="Cancel booking"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={handleCancelClose} type="button">Keep booking</Button>
            <Button
              variant="danger"
              disabled={!cancelReason.trim()}
              loading={cancelBooking.isPending}
              onClick={handleCancelConfirm}
              type="button"
            >
              Cancel booking
            </Button>
          </>
        }
      >
        <p className="text-sm text-[var(--text2)] mb-4">Please provide a reason for cancelling this booking.</p>
        <Textarea
          label="Reason"
          placeholder="e.g. Personal circumstances, found alternative work..."
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          rows={3}
        />
      </Modal>
    </PageWrapper>
  )
}
