import PageWrapper from '@/components/layout/PageWrapper'
import Card, { CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { PageSpinner } from '@/components/ui/Spinner'
import { useWorkforceOptimisation } from '../hooks/useEmployerStats'

const priorityVariant = { high: 'danger', medium: 'amber', low: 'gray' } as const
const priorityDot = { high: 'bg-red-500', medium: 'bg-amber-500', low: 'bg-gray-400' } as const

const typeIcon: Record<string, string> = {
  coverage_gap: '⚠️',
  pending_action: '📋',
  overstaffed: '👥',
  rate_anomaly: '💰',
}

export default function WorkforcePage() {
  const { data, isLoading } = useWorkforceOptimisation()

  return (
    <PageWrapper
      title="Workforce Optimisation"
      subtitle="AI-powered recommendations to improve your workforce allocation"
    >
      {isLoading ? (
        <PageSpinner />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Optimisation Recommendations</CardTitle>
              <Badge variant={data?.recommendations.length ? 'danger' : 'green'}>
                {data?.recommendations.length ?? 0} insights
              </Badge>
            </CardHeader>

            {!data?.recommendations.length ? (
              <p className="py-6 text-center text-sm text-[var(--text3)]">
                Your workforce is well optimised. Check back later for new insights.
              </p>
            ) : (
              <ul className="space-y-3">
                {data.recommendations.map((rec, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface2)] p-3"
                  >
                    <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${priorityDot[rec.priority]}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-medium text-[var(--text3)] uppercase tracking-wide">
                          {typeIcon[rec.type] ?? '🔍'} {rec.type.replace(/_/g, ' ')}
                        </span>
                        <Badge variant={priorityVariant[rec.priority]}>{rec.priority} priority</Badge>
                      </div>
                      <p className="text-sm font-semibold text-[var(--text)]">{rec.title}</p>
                      <p className="mt-0.5 text-xs text-[var(--text2)] leading-relaxed">{rec.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Utilisation by Trade */}
          <Card>
            <CardHeader>
              <CardTitle>Utilisation by Trade</CardTitle>
            </CardHeader>

            {!data?.utilisationByTrade.length ? (
              <p className="py-6 text-center text-sm text-[var(--text3)]">No active trade data yet.</p>
            ) : (
              <div className="space-y-5">
                {data.utilisationByTrade.map((item) => {
                  const rate = item.utilisationRate
                  const barColor =
                    rate >= 80 ? 'bg-green-500' : rate >= 50 ? 'bg-amber-500' : 'bg-red-500'
                  const rateColor =
                    rate >= 80 ? 'text-green-500' : rate >= 50 ? 'text-amber-500' : 'text-red-500'
                  return (
                    <div key={item.trade}>
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-sm font-semibold text-[var(--text)]">{item.trade}</span>
                        <span className={`text-sm font-bold tabular-nums ${rateColor}`}>
                          {rate.toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-[var(--surface2)]">
                        <div
                          className={`h-2 rounded-full transition-all ${barColor}`}
                          style={{ width: `${Math.min(rate, 100)}%` }}
                        />
                      </div>
                      <div className="mt-1.5 flex items-center justify-between text-xs text-[var(--text3)]">
                        <span>{item.workersBooked} of {item.workersNeeded} workers filled</span>
                        <span>avg £{parseFloat(item.avgHourlyRate).toFixed(2)}/hr</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        </div>
      )}
    </PageWrapper>
  )
}
