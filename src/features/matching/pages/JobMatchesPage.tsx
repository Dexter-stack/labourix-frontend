import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import PageWrapper from '@/components/layout/PageWrapper'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import { PageSpinner } from '@/components/ui/Spinner'
import EmptyState from '@/components/ui/EmptyState'
import { useJobMatches } from '../hooks/useMatches'
import { useJob } from '@/features/jobs/hooks/useJobs'
import { useCreateBooking } from '@/features/bookings/hooks/useBookings'

function ScoreRing({ score }: { score: number }) {
  const pct = Math.round(score * 100)
  const color =
    pct >= 80 ? 'text-green-500' : pct >= 60 ? 'text-amber-500' : 'text-[var(--text3)]'
  return (
    <div className="flex flex-col items-center">
      <span className={`text-2xl font-bold tabular-nums ${color}`}>{pct}%</span>
      <span className="text-[10px] text-[var(--text3)] mt-0.5">match score</span>
    </div>
  )
}

export default function JobMatchesPage() {
  const { id: jobId } = useParams<{ id: string }>()
  const { data: job } = useJob(jobId!)
  const { data: matches, isLoading } = useJobMatches(jobId!)
  const createBooking = useCreateBooking()
  const [bookingWorkerId, setBookingWorkerId] = useState<number | null>(null)

  const handleBook = (workerId: number) => {
    setBookingWorkerId(workerId)
    createBooking.mutate(
      { jobListingId: jobId!, workerId: String(workerId) },
      { onSettled: () => setBookingWorkerId(null) },
    )
  }

  return (
    <PageWrapper
      title="AI Worker Matches"
      subtitle={job ? `Best matches for: ${job.title}` : 'Loading...'}
      actions={<Link to={`/jobs/${jobId}`}><Button variant="outline">← Back to Job</Button></Link>}
    >
      {/* Scoring explanation */}
      <Card className="mb-6 bg-[var(--surface2)]">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)] text-[#0a1a18] font-bold text-sm">AI</div>
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">How AI matching works</p>
            <p className="mt-0.5 text-xs text-[var(--text2)]">
              Workers are ranked by a composite score weighted across{' '}
              <span className="font-medium text-[var(--accent)]">Skill match (40%)</span>{' · '}
              <span className="font-medium text-[var(--accent)]">Proximity (20%)</span>{' · '}
              <span className="font-medium text-[var(--accent)]">Availability (20%)</span>{' · '}
              <span className="font-medium text-[var(--accent)]">Rating (20%)</span>
            </p>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <PageSpinner />
      ) : !matches?.length ? (
        <EmptyState
          title="No matches found"
          description="No available workers match this job's requirements yet. Try broadening the required skills."
        />
      ) : (
        <div className="space-y-4">
          {matches.map((match, index) => {
            const pct = Math.round(match.matchScore * 100)
            const isBest = index === 0
            return (
              <Card
                key={match.id}
                className={isBest ? 'border-[var(--border2)] ring-1 ring-[oklch(0.65_0.16_28_/_0.25)]' : ''}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar with rank badge */}
                  <div className="relative shrink-0">
                    <Avatar name={match.trade} size="lg" />
                    {isBest && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent)] text-[#0a1a18] text-[10px] font-bold">
                        #1
                      </span>
                    )}
                  </div>

                  {/* Main content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-[var(--text)]">{match.trade}</p>
                          {isBest && <Badge variant="teal">⭐ Best Match</Badge>}
                          {match.isAvailable
                            ? <Badge variant="green">Available</Badge>
                            : <Badge variant="amber">Unavailable</Badge>
                          }
                        </div>
                        <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-[var(--text3)]">
                          <span>📍 {match.location}</span>
                          <span>⭐ {parseFloat(match.averageRating).toFixed(1)}</span>
                          <span>{match.totalJobsCompleted} jobs</span>
                          <span className="font-medium text-[var(--text)]">£{parseFloat(match.hourlyRate).toFixed(2)}/hr</span>
                        </div>
                        {match.bio && (
                          <p className="mt-2 text-xs text-[var(--text2)] line-clamp-2 max-w-prose">
                            {match.bio}
                          </p>
                        )}
                      </div>

                      {/* Score + action */}
                      <div className="flex items-center gap-4 shrink-0">
                        <ScoreRing score={match.matchScore} />
                        <Button
                          size="sm"
                          disabled={!match.isAvailable || (createBooking.isPending && bookingWorkerId === match.id)}
                          loading={createBooking.isPending && bookingWorkerId === match.id}
                          onClick={() => handleBook(match.id)}
                        >
                          Book
                        </Button>
                      </div>
                    </div>

                    {/* Score bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-[10px] text-[var(--text3)] mb-1">
                        <span>AI Match Score</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[var(--surface2)]">
                        <div
                          className={`h-1.5 rounded-full transition-all ${pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-amber-500' : 'bg-[var(--text3)]'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    {/* Skills */}
                    {match.skills.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {match.skills.slice(0, 6).map((s) => (
                          <Badge key={s} variant="outline">{s}</Badge>
                        ))}
                        {match.skills.length > 6 && (
                          <span className="text-xs text-[var(--text3)] self-center">+{match.skills.length - 6} more</span>
                        )}
                      </div>
                    )}

                    {/* Certifications */}
                    {match.certifications.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {match.certifications.map((cert) => (
                          <Badge key={cert.id} variant="amber">{cert.name}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </PageWrapper>
  )
}
