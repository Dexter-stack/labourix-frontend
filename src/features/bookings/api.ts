import api from '@/lib/axios'
import type { ApiResponse, Booking, PaginatedResponse } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeBooking(raw: any): Booking {
  return {
    id: raw.id,
    jobId: raw.jobId ?? raw.jobListingId ?? raw.job?.id,
    jobTitle: raw.jobTitle ?? raw.job?.title,
    workerId: raw.workerId ?? raw.worker?.id,
    workerName: raw.workerName ?? raw.worker?.name,
    workerAvatar: raw.workerAvatar ?? raw.worker?.avatar,
    employerId: raw.employerId ?? raw.employer?.id,
    employerName: raw.employerName ?? raw.employer?.name,
    status: raw.status,
    startDate: raw.startDate,
    endDate: raw.endDate,
    hourlyRate: raw.hourlyRate,
    totalHours: raw.totalHours,
    totalAmount: raw.totalAmount,
    workerRating: raw.workerRating,
    employerRating: raw.employerRating,
    notes: raw.notes,
    cancelReason: raw.cancelReason ?? raw.reason,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  }
}

export async function fetchBookings(params: { status?: string; page?: number } = {}): Promise<PaginatedResponse<Booking>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await api.get<PaginatedResponse<any>>('/employer/bookings', { params })
  return { ...data, data: data.data.map(normalizeBooking) }
}

export async function fetchWorkerBookings(params: { status?: string; page?: number } = {}): Promise<PaginatedResponse<Booking>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await api.get<PaginatedResponse<any>>('/worker/bookings', { params })
  return { ...data, data: data.data.map(normalizeBooking) }
}

export async function fetchBooking(id: string): Promise<Booking> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await api.get<ApiResponse<any>>(`/employer/bookings/${id}`)
  return normalizeBooking(data.data)
}

export async function createBooking(payload: { jobListingId: string; workerId: string }): Promise<Booking> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await api.post<ApiResponse<any>>('/employer/bookings', payload)
  return normalizeBooking(data.data)
}

export async function confirmBooking(id: string): Promise<Booking> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await api.post<ApiResponse<any>>(`/employer/bookings/${id}/confirm`)
  return normalizeBooking(data.data)
}

export async function cancelBooking(id: string, reason: string): Promise<Booking> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await api.post<ApiResponse<any>>(`/employer/bookings/${id}/cancel`, { reason })
  return normalizeBooking(data.data)
}

export async function rateBooking(id: string, payload: { rating: number; review?: string }): Promise<void> {
  await api.post(`/employer/bookings/${id}/rate`, payload)
}

export async function fetchWorkerBooking(id: string): Promise<Booking> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await api.get<ApiResponse<any>>(`/worker/bookings/${id}`)
  return normalizeBooking(data.data)
}

export async function cancelWorkerBooking(id: string, reason: string): Promise<Booking> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await api.post<ApiResponse<any>>(`/worker/bookings/${id}/cancel`, { reason })
  return normalizeBooking(data.data)
}
