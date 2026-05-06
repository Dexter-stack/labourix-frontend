export type UserRole = 'employer' | 'worker' | 'admin' | 'super_admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  emailVerifiedAt?: string | null
  isSuspended?: boolean
  suspendedAt?: string | null
  createdAt: string
  updatedAt: string
  profile?: {
    tradeCategory?: string
    location?: string
    rating?: number
    isAvailable?: boolean
    complianceStatus?: string
  }
}

export interface Employer extends User {
  role: 'employer'
  companyName: string
  companySize?: string
  industry?: string
  location?: string
  verified: boolean
}

export interface Worker extends User {
  role: 'worker'
  skills: string[]
  location: string
  availability: 'available' | 'busy' | 'unavailable'
  hourlyRate?: number
  rating: number
  totalJobs: number
  verified: boolean
  bio?: string
  profileComplete: boolean
}
