import { Link } from 'react-router-dom'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import JobStatusBadge from './JobStatusBadge'
import { formatDate, formatHourlyRate } from '@/utils/format'
import type { Job } from '@/types'



interface JobCardProps {
  job: Job
  actions?: React.ReactNode
}

export default function JobCard({ job, actions }: JobCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Link to={`/jobs/${job.id}`} className="text-base font-semibold text-[var(--text)] hover:text-[var(--accent)] truncate">
              {job.title}
            </Link>
            <JobStatusBadge status={job.status} />
            {job.trade && <Badge variant="teal">{job.trade}</Badge>}
          </div>
          <p className="mt-1 text-sm text-[var(--text3)] line-clamp-2">{job.description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[var(--text3)]">
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {formatHourlyRate(job.hourlyRate)}
            </span>
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {formatDate(job.startDate)}
            </span>
            {job.workersFilled != null && (
              <span>{job.workersFilled}/{job.workersNeeded} workers</span>
            )}
          </div>
          {job.requiredSkills?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {job.requiredSkills.slice(0, 4).map((skill) => (
                <Badge key={skill} variant="outline">{skill}</Badge>
              ))}
              {job.requiredSkills.length > 4 && (
                <Badge variant="outline">+{job.requiredSkills.length - 4}</Badge>
              )}
            </div>
          )}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
    </Card>
  )
}
