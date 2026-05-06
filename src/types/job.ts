export type JobStatus = 'draft' | 'open' | 'active' | 'filled' | 'in_progress' | 'completed' | 'cancelled'

export interface Job {
  id: string
  title: string
  description: string
  trade: string
  employerId: string
  employerName?: string
  location: string
  latitude?: number
  longitude?: number
  requiredSkills: string[]
  requiredCertifications?: string[]
  hourlyRate: number
  startDate: string
  endDate?: string
  status: JobStatus
  urgency?: 'low' | 'medium' | 'high'
  workersNeeded: number
  workersFilled?: number
  createdAt: string
  updatedAt: string
}

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn'

export interface JobApplication {
  id: string
  status: ApplicationStatus
  coverNote?: string
  appliedAt: string
  job: {
    id: string
    title: string
    location: string
    hourlyRate: number
    employerName?: string
  }
  worker?: {
    id: string
    name: string
    tradeCategory?: string
    location?: string
    hourlyRate?: number
    rating?: number
    ratingCount?: number
  }
}

export interface JobFilters {
  trade?: string
  location?: string
  skills?: string[]
  maxRate?: number
  status?: JobStatus
  page?: number
  perPage?: number
}
