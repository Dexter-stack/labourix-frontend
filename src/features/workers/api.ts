import api from '@/lib/axios'
import type { ApiResponse, Job, JobApplication, JobFilters, PaginatedResponse, WorkerProfile } from '@/types'

// Normalizes API worker profile to the frontend WorkerProfile interface
// Handles field renames: trade→tradeCategory, isAvailable→availability, averageRating→rating
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeProfile(raw: any): WorkerProfile {
  let availability: WorkerProfile['availability'] = 'unavailable'
  if (raw.availability) {
    availability = raw.availability
  } else if (raw.isAvailable === true) {
    availability = 'available'
  } else if (raw.isAvailable === false) {
    availability = 'unavailable'
  }

  return {
    id: raw.id,
    userId: raw.userId,
    skills: raw.skills ?? [],
    tradeCategory: raw.tradeCategory ?? raw.trade ?? '',
    location: raw.location ?? '',
    latitude: raw.latitude,
    longitude: raw.longitude,
    availability,
    availableDates: raw.availableDates,
    hourlyRate: raw.hourlyRate ?? 0,
    bio: raw.bio ?? '',
    yearsExperience: raw.yearsExperience ?? 0,
    rating: typeof raw.averageRating === 'string' ? parseFloat(raw.averageRating) : (raw.rating ?? 0),
    ratingCount: raw.ratingCount ?? 0,
    totalJobsCompleted: raw.totalJobsCompleted ?? 0,
    certifications: raw.certifications ?? [],
    complianceStatus: raw.complianceStatus ?? 'compliant',
  }
}

export async function fetchWorkerProfile(): Promise<WorkerProfile> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await api.get<ApiResponse<any>>('/worker/profile')
  return normalizeProfile(data.data)
}

export async function updateWorkerProfile(payload: Partial<WorkerProfile>): Promise<WorkerProfile> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await api.put<ApiResponse<any>>('/worker/profile', payload)
  return normalizeProfile(data.data)
}

export async function fetchPublicJobs(filters: JobFilters = {}): Promise<PaginatedResponse<Job>> {
  const { data } = await api.get<PaginatedResponse<Job>>('/jobs', { params: filters })
  return data
}

export async function fetchAvailableJobs(filters: JobFilters = {}): Promise<PaginatedResponse<Job>> {
  const { data } = await api.get<PaginatedResponse<Job>>('/worker/jobs', { params: filters })
  return data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeApplication(raw: any): JobApplication {
  const job = raw.job ?? {}
  return {
    id: String(raw.id),
    status: raw.status,
    coverNote: raw.coverNote,
    appliedAt: raw.appliedAt,
    job: {
      id: String(job.id),
      title: job.title ?? '',
      location: job.location ?? '',
      hourlyRate: job.hourlyRate ?? 0,
      employerName: job.employer?.name ?? job.employerName,
    },
  }
}

export async function applyToJob(jobId: string, coverNote?: string): Promise<JobApplication> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await api.post<ApiResponse<any>>(`/worker/jobs/${jobId}/apply`, coverNote ? { coverNote } : {})
  return normalizeApplication(data.data)
}

export async function fetchWorkerApplications(params: { page?: number; perPage?: number } = {}): Promise<PaginatedResponse<JobApplication>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await api.get<PaginatedResponse<any>>('/worker/applications', { params })
  return { ...data, data: data.data.map(normalizeApplication) }
}

export async function updateAvailability(isAvailable: boolean): Promise<WorkerProfile> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await api.post<ApiResponse<any>>('/worker/profile/availability', { isAvailable })
  return normalizeProfile(data.data)
}

export interface WorkerStats {
  bookings: { pending: number; confirmed: number; completed: number; cancelled: number }
  earnings: { total: number; thisMonth: number }
  profile: { averageRating: number; totalJobsCompleted: number; isAvailable: boolean }
  certifications: { active: number; expiringSoon: number; expired: number }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeWorkerStats(raw: any): WorkerStats {
  const profile = raw.profile ?? {}
  const earnings = raw.earnings ?? {}
  return {
    bookings: raw.bookings ?? { pending: 0, confirmed: 0, completed: 0, cancelled: 0 },
    earnings: {
      total: parseFloat(earnings.total ?? '0'),
      thisMonth: parseFloat(earnings.thisMonth ?? '0'),
    },
    profile: {
      averageRating: parseFloat(profile.averageRating ?? '0'),
      totalJobsCompleted: profile.totalJobsCompleted ?? 0,
      isAvailable: profile.isAvailable ?? false,
    },
    certifications: raw.certifications ?? { active: 0, expiringSoon: 0, expired: 0 },
  }
}

export async function fetchWorkerStats(): Promise<WorkerStats> {
  const { data } = await api.get('/worker/stats')
  return normalizeWorkerStats(data.data)
}
