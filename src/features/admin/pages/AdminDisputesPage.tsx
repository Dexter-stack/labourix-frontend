import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import PageWrapper from '@/components/layout/PageWrapper'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Textarea from '@/components/ui/Textarea'
import { PageSpinner } from '@/components/ui/Spinner'
import EmptyState from '@/components/ui/EmptyState'
import { fetchDisputes, resolveDispute, type Dispute } from '../api'
import { formatDate } from '@/utils/format'
import { useNotify } from '@/hooks/useNotify'
import { getApiErrorMessage } from '@/utils/apiError'

const statusBadge: Record<Dispute['status'], { label: string; variant: 'gray' | 'green' | 'amber' | 'danger' }> = {
  open: { label: 'Open', variant: 'danger' },
  investigating: { label: 'Investigating', variant: 'amber' },
  resolved: { label: 'Resolved', variant: 'green' },
  closed: { label: 'Closed', variant: 'gray' },
}

export default function AdminDisputesPage() {
  const [selected, setSelected] = useState<Dispute | null>(null)
  const [resolution, setResolution] = useState('')
  const notify = useNotify()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-disputes'],
    queryFn: fetchDisputes,
  })

  const resolve = useMutation({
    mutationFn: ({ id, resolution }: { id: string; resolution: string }) => resolveDispute(id, resolution),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-disputes'] })
      notify.success('Dispute resolved')
      setSelected(null)
      setResolution('')
    },
    onError: (error) => notify.error('Failed to resolve dispute', getApiErrorMessage(error)),
  })

  return (
    <PageWrapper title="Disputes" subtitle="Review and resolve platform disputes">
      {isLoading ? (
        <PageSpinner />
      ) : data?.data.length === 0 ? (
        <EmptyState title="No disputes" description="No open disputes at the moment." />
      ) : (
        <div className="space-y-3">
          {data?.data.map((dispute) => {
            const { label, variant } = statusBadge[dispute.status]
            return (
              <Card key={dispute.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-[var(--text)]">Booking #{dispute.bookingId.slice(-6)}</p>
                      <Badge variant={variant}>{label}</Badge>
                    </div>
                    <p className="text-sm text-[var(--text2)] mt-1">{dispute.reason}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-[var(--text3)]">
                      <span>Filed by: {dispute.reportedBy}</span>
                      <span>Against: {dispute.reportedAgainst}</span>
                      <span>{formatDate(dispute.createdAt)}</span>
                    </div>
                  </div>
                  {(dispute.status === 'open' || dispute.status === 'investigating') && (
                    <Button size="sm" onClick={() => setSelected(dispute)}>Resolve</Button>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <Modal
        open={!!selected}
        onClose={() => { setSelected(null); setResolution('') }}
        title="Resolve Dispute"
        footer={
          <>
            <Button variant="outline" onClick={() => { setSelected(null); setResolution('') }}>Cancel</Button>
            <Button
              onClick={() => { if (selected) resolve.mutate({ id: selected.id, resolution }) }}
              loading={resolve.isPending}
              disabled={!resolution.trim()}
            >
              Mark Resolved
            </Button>
          </>
        }
      >
        {selected && (
          <div className="space-y-4">
            <div className="rounded-lg bg-[var(--surface2)] p-4 text-sm">
              <p className="font-medium text-[var(--text)]">Dispute reason</p>
              <p className="mt-1 text-[var(--text2)]">{selected.reason}</p>
            </div>
            <Textarea
              label="Resolution notes"
              placeholder="Describe the outcome and any action taken..."
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              rows={4}
            />
          </div>
        )}
      </Modal>
    </PageWrapper>
  )
}
