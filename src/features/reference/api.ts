import api from '@/lib/axios'
import type { ApiResponse } from '@/types'

export interface Trade {
  id: number
  name: string
  slug: string
  category: 'construction_building' | 'engineering_technical'
  categoryLabel: string
}

export interface CertificationBody {
  id: number
  name: string
  slug: string
  abbreviation: string
}

export async function fetchTrades(): Promise<Trade[]> {
  const { data } = await api.get<ApiResponse<Trade[]>>('/trades')
  return data.data
}

export async function fetchCertificationBodies(): Promise<CertificationBody[]> {
  const { data } = await api.get<ApiResponse<CertificationBody[]>>('/certification-bodies')
  return data.data
}
