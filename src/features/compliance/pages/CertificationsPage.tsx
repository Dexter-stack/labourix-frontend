import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageWrapper from '@/components/layout/PageWrapper'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { ConfirmModal } from '@/components/ui/Modal'
import { PageSpinner } from '@/components/ui/Spinner'
import EmptyState from '@/components/ui/EmptyState'
import { useCertifications, useDeleteCertification } from '../hooks/useCertifications'
import { formatDate } from '@/utils/format'
import type { Certification } from '@/types'
import { differenceInDays, parseISO } from 'date-fns'

const statusBadge: Record<Certification['status'], { label: string; variant: 'gray' | 'green' | 'amber' | 'danger' }> = {
  pending: { label: 'Pending Review', variant: 'amber' },
  verified: { label: 'Verified', variant: 'green' },
  expired: { label: 'Expired', variant: 'danger' },
  rejected: { label: 'Rejected', variant: 'danger' },
}

function ExpiryWarning({ expiryDate }: { expiryDate: string }) {
  const days = differenceInDays(parseISO(expiryDate), new Date())
  if (days > 30) return null
  if (days < 0) return <p className="text-xs text-red-600 mt-1">Expired</p>
  return <p className="text-xs text-amber-600 mt-1">Expires in {days} days</p>
}

export default function CertificationsPage() {
  const navigate = useNavigate()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { data: certs, isLoading } = useCertifications()
  const deleteCert = useDeleteCertification()

  return (
    <PageWrapper
      title="Certifications"
      subtitle="Upload and manage your trade certifications"
      actions={<Button onClick={() => navigate('/worker/certifications/new')}>+ Add Certification</Button>}
    >
      {isLoading ? (
        <PageSpinner />
      ) : certs?.length === 0 ? (
        <EmptyState
          title="No certifications"
          description="Upload your trade certificates to improve job matches and unlock more opportunities."
          action={{ label: 'Add certification', onClick: () => navigate('/worker/certifications/new') }}
        />
      ) : (
        <div className="space-y-3">
          {certs?.map((cert) => {
            const { label, variant } = statusBadge[cert.status]
            return (
              <Card key={cert.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-[var(--text)]">{cert.name}</p>
                      <Badge variant={variant}>{label}</Badge>
                    </div>
                    <p className="text-sm text-[var(--text3)] mt-0.5">Issued by {cert.issuingBody}</p>
                    <div className="mt-1 flex gap-3 text-xs text-[var(--text3)]">
                      {cert.issueDate && <span>Issued: {formatDate(cert.issueDate)}</span>}
                      {cert.expiryDate && <span>Expires: {formatDate(cert.expiryDate)}</span>}
                    </div>
                    {cert.expiryDate && <ExpiryWarning expiryDate={cert.expiryDate} />}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {cert.documentUrl && (
                      <a href={cert.documentUrl} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline">View</Button>
                      </a>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => setDeleteId(cert.id)}>
                      <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) deleteCert.mutate(deleteId, { onSuccess: () => setDeleteId(null) }) }}
        title="Remove certification"
        message="Are you sure you want to remove this certification?"
        confirmLabel="Remove"
        loading={deleteCert.isPending}
      />
    </PageWrapper>
  )
}
