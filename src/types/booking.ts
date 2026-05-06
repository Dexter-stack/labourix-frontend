export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'disputed'

export interface Booking {
  id: string
  jobId: string
  jobTitle: string
  workerId: string
  workerName: string
  workerAvatar?: string
  employerId: string
  employerName: string
  status: BookingStatus
  startDate: string
  endDate?: string
  hourlyRate: number
  totalHours?: number
  totalAmount?: number
  workerRating?: number
  employerRating?: number
  notes?: string
  cancelReason?: string
  createdAt: string
  updatedAt: string
}
