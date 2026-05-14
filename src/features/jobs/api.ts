import api from '@/lib/axios'
import type { ApiResponse, Job, JobApplication, JobFilters, PaginatedResponse } from '@/types'

export async function fetchJobs(filters: JobFilters = {}): Promise<PaginatedResponse<Job>> {
  const { data } = await api.get<PaginatedResponse<Job>>('/employer/jobs', { params: filters })
  return data
}

export async function fetchJob(id: string): Promise<Job> {
  const { data } = await api.get<ApiResponse<Job>>(`/employer/jobs/${id}`)
  return data.data
}

export async function createJob(payload: Partial<Job>): Promise<Job> {
  const { data } = await api.post<ApiResponse<Job>>('/employer/jobs', payload)
  return data.data
}

export async function updateJob(id: string, payload: Partial<Job>): Promise<Job> {
  const { data } = await api.put<ApiResponse<Job>>(`/employer/jobs/${id}`, payload)
  return data.data
}

export async function deleteJob(id: string): Promise<void> {
  await api.delete(`/employer/jobs/${id}`)
}

export async function publishJob(id: string): Promise<Job> {
  const { data } = await api.post<ApiResponse<Job>>(`/employer/jobs/${id}/publish`)
  return data.data
}

export interface EmployerStats {
  jobs: { draft: number; active: number; filled: number; cancelled: number }
  bookings: { pending: number; confirmed: number; completed: number; cancelled: number }
  spend: { total: number; thisMonth: number }
  uniqueWorkersHired: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeEmployerStats(raw: any): EmployerStats {
  const spend = raw.spend ?? {}
  return {
    jobs: raw.jobs ?? { draft: 0, active: 0, filled: 0, cancelled: 0 },
    bookings: raw.bookings ?? { pending: 0, confirmed: 0, completed: 0, cancelled: 0 },
    spend: {
      total: parseFloat(spend.total ?? '0'),
      thisMonth: parseFloat(spend.thisMonth ?? '0'),
    },
    uniqueWorkersHired: raw.uniqueWorkersHired ?? 0,
  }
}

export async function fetchEmployerStats(): Promise<EmployerStats> {
  const { data } = await api.get('/employer/stats')
  return normalizeEmployerStats(data.data)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeJobApplication(raw: any): JobApplication {
  const worker = raw.worker ?? {}
  const user = worker.user ?? {}
  return {
    id: String(raw.id),
    status: raw.status,
    coverNote: raw.coverNote,
    appliedAt: raw.appliedAt,
    job: { id: '', title: '', location: '', hourlyRate: 0 },
    worker: {
      id: String(worker.id ?? ''),
      name: user.name ?? worker.name ?? '',
      tradeCategory: worker.tradeCategory ?? worker.trade,
      location: worker.location,
      hourlyRate: worker.hourlyRate != null ? Number(worker.hourlyRate) : undefined,
      rating: typeof worker.averageRating === 'string' ? parseFloat(worker.averageRating) : worker.rating,
      ratingCount: worker.ratingCount,
    },
  }
}

export async function fetchJobApplications(
  jobId: string,
  params: { page?: number; perPage?: number } = {}
): Promise<PaginatedResponse<JobApplication>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await api.get<PaginatedResponse<any>>(`/employer/jobs/${jobId}/applications`, { params })
  return { ...data, data: data.data.map(normalizeJobApplication) }
}

export interface WorkforceRecommendation {
  type: string
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
}

export interface TradeUtilisation {
  trade: string
  workersNeeded: number
  workersBooked: number
  utilisationRate: number
  avgHourlyRate: string
}

export interface WorkforceOptimisationData {
  recommendations: WorkforceRecommendation[]
  utilisationByTrade: TradeUtilisation[]
}

export async function fetchWorkforceOptimisation(): Promise<WorkforceOptimisationData> {
  const { data } = await api.get('/employer/workforce-optimisation')
  return data.data
}
