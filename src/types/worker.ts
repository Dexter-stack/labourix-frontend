export interface Certification {
  id: string
  workerId: string
  name: string
  issuingBody: string
  certificateNumber?: string
  issueDate?: string
  expiryDate?: string
  documentUrl?: string
  status: 'pending' | 'verified' | 'expired' | 'rejected'
  createdAt: string
}

export interface WorkerProfile {
  id: string
  userId: string
  skills: string[]
  tradeCategory: string
  location: string
  latitude?: number
  longitude?: number
  availability: 'available' | 'busy' | 'unavailable'
  availableDates?: string[]
  hourlyRate: number
  bio: string
  yearsExperience: number
  rating: number
  ratingCount: number
  totalJobsCompleted: number
  certifications: Certification[]
  complianceStatus: 'compliant' | 'warning' | 'blocked'
}

export interface WorkerMatch {
  worker: WorkerProfile & { name: string; avatar?: string }
  matchScore: number
  skillScore: number
  proximityScore: number
  availabilityScore: number
  ratingScore: number
  distanceKm: number
  isRecommended: boolean
}
