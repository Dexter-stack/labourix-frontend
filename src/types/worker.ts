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

export interface MatchCertification {
  id: number
  name: string
  issuingBody: string
  certificateNumber: string
  issuedAt: string
  expiresAt: string
  isVerified: boolean
  isExpired: boolean
}

export interface WorkerMatch {
  id: number
  trade: string
  skills: string[]
  location: string
  hourlyRate: string
  bio: string
  isAvailable: boolean
  availabilitySchedule?: Record<string, string>
  averageRating: string
  totalJobsCompleted: number
  certifications: MatchCertification[]
  matchScore: number  // 0–1 decimal, multiply × 100 for display
}
