import PageWrapper from '@/components/layout/PageWrapper'
import Card, { CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { PageSpinner } from '@/components/ui/Spinner'
import { useWorkforceOptimisation } from '../hooks/useEmployerStats'

const impactVariant = { high: 'danger', medium: 'amber', low: 'gray' } as const

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
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Optimisation Recommendations</CardTitle>
                <Badge variant="teal">{data?.recommendations.length ?? 0} insights</Badge>
              </CardHeader>
              {data?.recommendations.length === 0 ? (
                <p className="py-4 text-center text-sm text-[var(--text3)]">Your workforce is well optimised. Check back later for new insights.</p>
              ) : (
                <ul className="space-y-3">
                  {data?.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface2)] p-3">
                      <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${rec.impact === 'high' ? 'bg-red-500' : rec.impact === 'medium' ? 'bg-amber-500' : 'bg-gray-400'}`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-[var(--text3)] uppercase tracking-wide">{rec.type.replace('_', ' ')}</span>
                          <Badge variant={impactVariant[rec.impact]}>{rec.impact} impact</Badge>
                        </div>
                        <p className="mt-1 text-sm text-[var(--text)]">{rec.message}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Utilisation by Trade</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {data?.utilizationByTrade.map((item) => (
                <div key={item.trade}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-[var(--text)]">{item.trade}</span>
                    <span className={`font-semibold ${item.rate >= 80 ? 'text-green-600' : item.rate >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                      {item.rate}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[var(--surface2)]">
                    <div
                      className={`h-2 rounded-full ${item.rate >= 80 ? 'bg-green-500' : item.rate >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${item.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </PageWrapper>
  )
}
