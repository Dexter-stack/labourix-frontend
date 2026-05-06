import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import PageWrapper from '@/components/layout/PageWrapper'
import Card, { CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { PageSpinner } from '@/components/ui/Spinner'
import { fetchDemandForecast } from '../api'

export default function DemandForecastPage() {
  const { data: forecasts, isLoading } = useQuery({
    queryKey: ['demand-forecast'],
    queryFn: fetchDemandForecast,
  })

  const alerts = forecasts?.flatMap((f) => f.alerts) ?? []
  const criticalAlerts = alerts.filter((a) => a.severity === 'critical')
  const warningAlerts = alerts.filter((a) => a.severity === 'warning')

  return (
    <PageWrapper
      title="Workforce Demand Forecast"
      subtitle="Predictive labour requirements based on project timelines and historical data"
    >
      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {criticalAlerts.map((alert, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <span className="text-red-500 text-lg">🚨</span>
              <div>
                <p className="text-sm font-semibold text-red-900">{alert.message}</p>
                <p className="text-xs text-red-700 mt-0.5">Action required within {alert.daysUntil} days</p>
              </div>
            </div>
          ))}
          {warningAlerts.map((alert, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <span className="text-amber-500 text-lg">⚠️</span>
              <div>
                <p className="text-sm font-semibold text-amber-900">{alert.message}</p>
                <p className="text-xs text-amber-700 mt-0.5">Plan ahead – {alert.daysUntil} days remaining</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {isLoading ? (
        <PageSpinner />
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Labour Demand vs Capacity (Next 12 Weeks)</CardTitle>
            </CardHeader>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={forecasts?.map((f) => ({ period: f.period, Demand: f.forecastedDemand, Capacity: f.currentCapacity }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Demand" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Capacity" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {forecasts?.map((forecast) => (
              <Card key={forecast.period} padding="sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-[var(--text)]">{forecast.period}</p>
                  <Badge variant={forecast.gap > 0 ? 'danger' : 'green'}>
                    {forecast.gap > 0 ? `+${forecast.gap} needed` : 'Sufficient'}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {forecast.tradeBreakdown.map((t) => (
                    <div key={t.trade} className="flex items-center justify-between text-xs">
                      <span className="text-[var(--text2)]">{t.trade}</span>
                      <span className={`font-medium ${t.needed > t.available ? 'text-red-600' : 'text-green-600'}`}>
                        {t.available}/{t.needed}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </PageWrapper>
  )
}
