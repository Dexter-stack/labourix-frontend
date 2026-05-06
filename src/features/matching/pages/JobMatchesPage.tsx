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
import { formatHourlyRate } from '@/utils/format'

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-[var(--text3)]">{label}</span>
        <span className="font-medium text-[var(--text)]">{value}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-[var(--surface2)]">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

export default function JobMatchesPage() {
  const { id: jobId } = useParams<{ id: string }>()
  const { data: job } = useJob(jobId!)
  const { data: matches, isLoading } = useJobMatches(jobId!)
  const createBooking = useCreateBooking()
  const [bookingId, setBookingId] = useState<string | null>(null)

  const handleBook = (workerId: string) => {
    setBookingId(workerId)
    createBooking.mutate(
      { jobListingId: jobId!, workerId },
      { onSettled: () => setBookingId(null) }
    )
  }

  return (
    <PageWrapper
      title="AI Worker Matches"
      subtitle={job ? `Best matches for: ${job.title}` : 'Loading...'}
      actions={<Link to={`/jobs/${jobId}`}><Button variant="outline">← Back to Job</Button></Link>}
    >
      {/* Scoring explanation */}
      <Card className="mb-6 bg-[var(--surface2)] border-[var(--border)]">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🤖</span>
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">How AI matching works</p>
            <p className="text-xs text-[oklch(0.74_0.14_185)] mt-0.5">
              Workers are scored on: <strong>Skill match (40%)</strong> · <strong>Proximity (20%)</strong> · <strong>Availability (20%)</strong> · <strong>Rating/Performance (20%)</strong>
            </p>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <PageSpinner />
      ) : !matches?.length ? (
        <EmptyState title="No matches found" description="No available workers match this job's requirements yet. Try broadening the required skills." />
      ) : (
        <div className="space-y-4">
          {matches.map((match, index) => (
            <Card key={match.worker.id} className={match.isRecommended ? 'border-[var(--border2)] bg-[var(--surface2)]/30' : ''}>
              <div className="flex items-start gap-4">
                <div className="relative">
                  <Avatar name={match.worker.name} src={match.worker.avatar} size="lg" />
                  {index === 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[oklch(0.74_0.14_185)] text-white text-xs font-bold">
                      #1
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-[var(--text)]">{match.worker.name}</p>
                        {match.isRecommended && <Badge variant="teal">⭐ Best Match</Badge>}
                        {match.worker.complianceStatus === 'blocked' && <Badge variant="danger">Compliance Issue</Badge>}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-[var(--text3)]">
                        <span>⭐ {match.worker.rating.toFixed(1)} ({match.worker.ratingCount} reviews)</span>
                        <span>{match.distanceKm.toFixed(1)} km away</span>
                        <span>{formatHourlyRate(match.worker.hourlyRate)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${match.matchScore >= 80 ? 'text-green-600' : match.matchScore >= 60 ? 'text-amber-600' : 'text-[var(--text2)]'}`}>
                          {match.matchScore}%
                        </div>
                        <div className="text-xs text-[var(--text3)]">match score</div>
                      </div>
                      <Button
                        size="sm"
                        disabled={match.worker.complianceStatus === 'blocked' || (createBooking.isPending && bookingId === match.worker.id)}
                        loading={createBooking.isPending && bookingId === match.worker.id}
                        onClick={() => handleBook(match.worker.id)}
                      >
                        Book
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
                    <ScoreBar label="Skill Match" value={match.skillScore} color="bg-blue-500" />
                    <ScoreBar label="Proximity" value={match.proximityScore} color="bg-green-500" />
                    <ScoreBar label="Availability" value={match.availabilityScore} color="bg-amber-500" />
                    <ScoreBar label="Performance" value={match.ratingScore} color="bg-purple-500" />
                  </div>

                  {match.worker.skills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {match.worker.skills.slice(0, 5).map((s) => (
                        <Badge key={s} variant="outline">{s}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageWrapper>
  )
}
