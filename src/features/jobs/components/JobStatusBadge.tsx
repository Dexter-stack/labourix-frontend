import Badge from '@/components/ui/Badge'
import type { JobStatus } from '@/types'

const config: Record<JobStatus, { label: string; variant: 'gray' | 'green' | 'teal' | 'amber' | 'danger' }> = {
  draft:       { label: 'Draft',       variant: 'gray' },
  open:        { label: 'Open',        variant: 'green' },
  active:      { label: 'Active',      variant: 'green' },
  filled:      { label: 'Filled',      variant: 'teal' },
  in_progress: { label: 'In Progress', variant: 'amber' },
  completed:   { label: 'Completed',   variant: 'gray' },
  cancelled:   { label: 'Cancelled',   variant: 'danger' },
}

export default function JobStatusBadge({ status }: { status: JobStatus }) {
  const entry = config[status] ?? { label: status, variant: 'gray' as const }
  return <Badge variant={entry.variant}>{entry.label}</Badge>
}
