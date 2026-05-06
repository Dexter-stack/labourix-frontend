import { useParams, Link, useNavigate } from 'react-router-dom'
import PageWrapper from '@/components/layout/PageWrapper'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { PageSpinner } from '@/components/ui/Spinner'
import JobStatusBadge from '../components/JobStatusBadge'
import { useJob } from '../hooks/useJobs'
import { formatDate, formatHourlyRate } from '@/utils/format'

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: job, isLoading } = useJob(id)

  if (isLoading) return <PageSpinner />
  if (!job) return <div className="p-8 text-center text-[var(--text3)]">Job not found.</div>

  return (
    <PageWrapper
      title={job.title}
      subtitle={job.employerName}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate(`/jobs/${id}/edit`)}>Edit job</Button>
          {job.status === 'active' && (
            <>
              <Link to={`/jobs/${job.id}/applications`}>
                <Button variant="outline">Applications</Button>
              </Link>
              <Link to={`/jobs/${job.id}/matches`}>
                <Button>View AI Matches</Button>
              </Link>
            </>
          )}
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex flex-wrap gap-2 mb-4">
              <JobStatusBadge status={job.status} />
              {job.trade && <Badge variant="teal">{job.trade}</Badge>}
            </div>
            <h2 className="text-sm font-semibold text-[var(--text)] mb-2">Description</h2>
            <p className="text-sm text-[var(--text2)] leading-relaxed whitespace-pre-wrap">{job.description}</p>
          </Card>

          <Card>
            <h2 className="text-sm font-semibold text-[var(--text)] mb-3">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills?.map((skill) => (
                <Badge key={skill} variant="teal">{skill}</Badge>
              ))}
            </div>
          </Card>

          {job.requiredCertifications && job.requiredCertifications.length > 0 && (
            <Card>
              <h2 className="text-sm font-semibold text-[var(--text)] mb-3">Required Certifications</h2>
              <div className="flex flex-wrap gap-2">
                {job.requiredCertifications.map((cert) => (
                  <Badge key={cert} variant="amber">{cert}</Badge>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <h2 className="text-sm font-semibold text-[var(--text)] mb-4">Job Details</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-[var(--text3)]">Location</dt>
                <dd className="font-medium text-[var(--text)]">{job.location}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--text3)]">Hourly Rate</dt>
                <dd className="font-medium text-[var(--text)]">{formatHourlyRate(job.hourlyRate)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--text3)]">Start Date</dt>
                <dd className="font-medium text-[var(--text)]">{formatDate(job.startDate)}</dd>
              </div>
              {job.endDate && (
                <div className="flex justify-between">
                  <dt className="text-[var(--text3)]">End Date</dt>
                  <dd className="font-medium text-[var(--text)]">{formatDate(job.endDate)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-[var(--text3)]">Workers Needed</dt>
                <dd className="font-medium text-[var(--text)]">
                  {job.workersFilled != null ? `${job.workersFilled}/` : ''}{job.workersNeeded}
                </dd>
              </div>
            </dl>
          </Card>

          {job.status === 'active' && (
            <Link to={`/jobs/${job.id}/matches`} className="block">
              <Card className="cursor-pointer hover:bg-[var(--surface2)] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[oklch(0.74_0.14_185)] text-[#0a1a18] text-lg font-bold">AI</div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text)]">AI Worker Matching</p>
                    <p className="text-xs text-[oklch(0.74_0.14_185)]">See ranked worker recommendations</p>
                  </div>
                </div>
              </Card>
            </Link>
          )}
        </div>
      </div>

    </PageWrapper>
  )
}
