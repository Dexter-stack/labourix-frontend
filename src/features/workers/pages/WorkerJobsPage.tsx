import { useState } from 'react'
import PageWrapper from '@/components/layout/PageWrapper'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Textarea from '@/components/ui/Textarea'
import { PageSpinner } from '@/components/ui/Spinner'
import EmptyState from '@/components/ui/EmptyState'
import { usePublicJobs, useApplyToJob, useWorkerApplications } from '../hooks/useWorkerProfile'
import { useDebounce } from '@/hooks/useDebounce'
import { formatDate, formatHourlyRate } from '@/utils/format'
import type { Job } from '@/types'

const TRADES = [
  'Electrician', 'Plumber', 'Carpenter', 'Bricklayer', 'Roofer',
  'HVAC Technician', 'Scaffolder', 'Painter', 'Plasterer', 'General Labour',
  'Welder', 'Pipefitter', 'Tiler', 'Glazier', 'Steelworker',
]

export default function WorkerJobsPage() {
  const [trade, setTrade] = useState('')
  const [location, setLocation] = useState('')
  const [maxRate, setMaxRate] = useState('')
  const [applyingTo, setApplyingTo] = useState<Job | null>(null)
  const [coverNote, setCoverNote] = useState('')
  const debouncedLocation = useDebounce(location)
  const debouncedMaxRate = useDebounce(maxRate)

  const { data, isLoading } = usePublicJobs({
    trade: trade || undefined,
    location: debouncedLocation || undefined,
    maxRate: debouncedMaxRate ? Number(debouncedMaxRate) : undefined,
  })
  const applyToJob = useApplyToJob()
  const { data: applicationsData } = useWorkerApplications()
  const appliedJobIds = new Set(applicationsData?.data.map((a) => a.job.id) ?? [])

  const handleOpenApply = (job: Job) => {
    setApplyingTo(job)
    setCoverNote('')
  }

  const handleCloseApply = () => {
    setApplyingTo(null)
    setCoverNote('')
  }

  const handleSubmitApply = () => {
    if (!applyingTo) return
    applyToJob.mutate(
      { jobId: applyingTo.id, coverNote: coverNote.trim() || undefined },
      { onSuccess: handleCloseApply }
    )
  }

  return (
    <PageWrapper title="Available Jobs" subtitle="Find work that matches your skills">
      <div className="mb-4 flex flex-wrap gap-3">
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
        {(trade || location || maxRate) && (
          <Button variant="ghost" size="sm" onClick={() => { setTrade(''); setLocation(''); setMaxRate('') }}>
            Clear filters
          </Button>
        )}
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : data?.data.length === 0 ? (
        <EmptyState title="No jobs available" description="Check back soon for new opportunities." />
      ) : (
        <div className="space-y-3">
          {data?.data.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-base font-semibold text-[var(--text)]">{job.title}</p>
                    {job.trade && <Badge variant="teal">{job.trade}</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-[var(--text3)] line-clamp-2">{job.description}</p>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-[var(--text3)]">
                    <span>📍 {job.location}</span>
                    <span>💷 {formatHourlyRate(job.hourlyRate)}</span>
                    <span>📅 Starts {formatDate(job.startDate)}</span>
                    {job.workersFilled != null && (
                      <span>👷 {job.workersFilled}/{job.workersNeeded} filled</span>
                    )}
                  </div>
                  {job.requiredSkills?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {job.requiredSkills.slice(0, 4).map((s) => (
                        <Badge key={s} variant="outline">{s}</Badge>
                      ))}
                    </div>
                  )}
                </div>
                {appliedJobIds.has(job.id) ? (
                  <Badge variant="green">Applied ✓</Badge>
                ) : (
                  <Button
                    size="sm"
                    disabled={job.status !== 'active'}
                    onClick={() => handleOpenApply(job)}
                  >
                    Apply
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={!!applyingTo}
        onClose={handleCloseApply}
        title={`Apply — ${applyingTo?.title ?? ''}`}
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={handleCloseApply} type="button">Cancel</Button>
            <Button loading={applyToJob.isPending} onClick={handleSubmitApply} type="button">
              Submit application
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="rounded-lg bg-[var(--surface2)] px-4 py-3 text-sm text-[var(--text2)]">
            <p className="font-medium text-[var(--text)]">{applyingTo?.title}</p>
            <p className="mt-0.5 text-xs text-[var(--text3)]">📍 {applyingTo?.location} · 💷 {applyingTo ? formatHourlyRate(applyingTo.hourlyRate) : ''}/hr</p>
          </div>
          <Textarea
            label="Cover note (optional)"
            placeholder="Briefly describe your relevant experience..."
            value={coverNote}
            onChange={(e) => setCoverNote(e.target.value)}
            rows={4}
          />
        </div>
      </Modal>
    </PageWrapper>
  )
}
