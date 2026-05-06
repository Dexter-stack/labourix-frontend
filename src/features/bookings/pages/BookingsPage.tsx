import { useState } from 'react'
import PageWrapper from '@/components/layout/PageWrapper'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import { PageSpinner } from '@/components/ui/Spinner'
import EmptyState from '@/components/ui/EmptyState'
import Modal from '@/components/ui/Modal'
import Textarea from '@/components/ui/Textarea'
import { useBookings, useCancelBooking, useConfirmBooking } from '../hooks/useBookings'
import { formatDate, formatCurrency } from '@/utils/format'
import type { BookingStatus } from '@/types'

const statusConfig: Record<BookingStatus, { label: string; variant: 'gray' | 'green' | 'amber' | 'danger' | 'teal' }> = {
  pending: { label: 'Pending', variant: 'amber' },
  confirmed: { label: 'Confirmed', variant: 'green' },
  in_progress: { label: 'In Progress', variant: 'teal' },
  completed: { label: 'Completed', variant: 'gray' },
  cancelled: { label: 'Cancelled', variant: 'danger' },
  disputed: { label: 'Disputed', variant: 'danger' },
}

const tabs: { label: string; value: string }[] = [
  { label: 'All', value: '' },
  { label: 'Active', value: 'confirmed' },
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
]

export default function BookingsPage() {
  const [tab, setTab] = useState('')
  const [cancelId, setCancelId] = useState<string | null>(null)
  const [cancelReason, setCancelReason] = useState('')
  const { data, isLoading } = useBookings(tab || undefined)
  const cancelBooking = useCancelBooking()
  const confirmBooking = useConfirmBooking()

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
    <PageWrapper title="Bookings" subtitle="Manage your worker bookings">
      <div className="mb-4 flex gap-1 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${tab === t.value ? 'bg-[oklch(0.74_0.14_185)] text-white' : 'text-[var(--text2)] hover:bg-[var(--surface2)]'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : data?.data.length === 0 ? (
        <EmptyState title="No bookings" description="Book a worker from the AI Matches page." />
      ) : (
        <div className="space-y-3">
          {data?.data.map((booking) => {
            const { label, variant } = statusConfig[booking.status]
            return (
              <Card key={booking.id}>
                <div className="flex items-start gap-4">
                  <Avatar name={booking.workerName} src={booking.workerAvatar} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-[var(--text)]">{booking.workerName}</p>
                      <Badge variant={variant}>{label}</Badge>
                    </div>
                    <p className="text-sm text-[var(--text3)] mt-0.5">{booking.jobTitle}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-[var(--text3)]">
                      <span>Start: {formatDate(booking.startDate)}</span>
                      {booking.endDate && <span>End: {formatDate(booking.endDate)}</span>}
                      <span>{formatCurrency(booking.hourlyRate)}/hr</span>
                      {booking.totalAmount && <span>Total: {formatCurrency(booking.totalAmount)}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {booking.status === 'pending' && (
                      <Button
                        size="sm"
                        loading={confirmBooking.isPending}
                        onClick={() => confirmBooking.mutate(booking.id)}
                      >
                        Confirm
                      </Button>
                    )}
                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                      <Button size="sm" variant="outline" onClick={() => handleCancelOpen(booking.id)}>
                        Cancel
                      </Button>
                    )}
                  </div>
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
          placeholder="e.g. Worker no longer needed, project postponed..."
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          rows={3}
        />
      </Modal>
    </PageWrapper>
  )
}
