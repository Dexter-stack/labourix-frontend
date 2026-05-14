import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageWrapper from '@/components/layout/PageWrapper'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { PageSpinner } from '@/components/ui/Spinner'
import EmptyState from '@/components/ui/EmptyState'
import { useJobs, useDeleteJob, usePublishJob } from '../hooks/useJobs'
import { useDebounce } from '@/hooks/useDebounce'
import JobCard from '../components/JobCard'
import { ConfirmModal } from '@/components/ui/Modal'
import type { JobStatus } from '@/types'

export default function JobsPage() {
  const navigate = useNavigate()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [trade, setTrade] = useState('')
  const [status, setStatus] = useState<JobStatus | ''>('')
  const debouncedTrade = useDebounce(trade)

  const { data, isLoading } = useJobs({
    trade: debouncedTrade || undefined,
    status: status || undefined,
  })
  const deleteJob = useDeleteJob()
  const publishJob = usePublishJob()

  return (
    <PageWrapper
      title="Jobs"
      subtitle={`${data?.meta.total ?? 0} jobs`}
      actions={<Button onClick={() => navigate('/jobs/new')}>+ Post Job</Button>}
    >
      <div className="mb-4 flex gap-3">
        <Input
          placeholder="Filter by trade..."
          value={trade}
          onChange={(e) => setTrade(e.target.value)}
          className="max-w-xs"
        />
        <Select
          options={[
            { value: 'draft', label: 'Draft' },
            { value: 'active', label: 'Active' },
            { value: 'filled', label: 'Filled' },
            { value: 'in_progress', label: 'In Progress' },
            { value: 'completed', label: 'Completed' },
            { value: 'cancelled', label: 'Cancelled' },
          ]}
          placeholder="All statuses"
          value={status}
          onChange={(e) => setStatus(e.target.value as JobStatus)}
          className="w-44"
        />
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : data?.data.length === 0 ? (
        <EmptyState
          title="No jobs found"
          description="Post your first job to start finding workers."
          action={{ label: 'Post a job', onClick: () => navigate('/jobs/new') }}
        />
      ) : (
        <div className="space-y-3 pb-8">
          {data?.data.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              actions={
                <div className="flex items-center gap-2">
                  {job.status === 'draft' && (
                    <Button
                      size="sm"
                      variant="outline"
                      loading={publishJob.isPending}
                      onClick={() => publishJob.mutate(job.id)}
                    >
                      Publish
                    </Button>
                  )}
                  {job.status === 'active' && (
                    <>
                      <Link to={`/jobs/${job.id}/applications`}>
                        <Button size="sm" variant="ghost">Applications</Button>
                      </Link>
                      <Link to={`/jobs/${job.id}/matches`}>
                        <Button size="sm" variant="ghost">AI Matches</Button>
                      </Link>
                    </>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => navigate(`/jobs/${job.id}/edit`)}>Edit</Button>
                  <Button size="sm" variant="outline" onClick={() => setDeleteId(job.id)}>Delete</Button>
                </div>
              }
            />
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) deleteJob.mutate(deleteId, { onSuccess: () => setDeleteId(null) }) }}
        title="Delete job"
        message="Are you sure you want to delete this job? This cannot be undone."
        confirmLabel="Delete"
        loading={deleteJob.isPending}
      />
    </PageWrapper>
  )
}
