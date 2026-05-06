import api from '@/lib/axios'
import type { ApiResponse } from '@/types'

export interface DemandForecast {
  period: string
  forecastedDemand: number
  currentCapacity: number
  gap: number
  tradeBreakdown: Array<{ trade: string; needed: number; available: number }>
  alerts: Array<{ severity: 'critical' | 'warning' | 'info'; message: string; daysUntil: number }>
}

export async function fetchDemandForecast(): Promise<DemandForecast[]> {
  const { data } = await api.get<ApiResponse<DemandForecast[]>>('/employer/demand-forecast')
  return data.data
}
