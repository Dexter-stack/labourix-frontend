import api from '@/lib/axios'
import type { PaginatedResponse, User } from '@/types'

export interface AdminStats {
  users: {
    total: number
    workers: number
    employers: number
    admins: number
    newThisMonth: number
  }
  jobs: {
    total: number
    draft: number
    active: number
    filled: number
    cancelled: number
  }
  bookings: {
    total: number
    pending: number
    confirmed: number
    completed: number
    cancelled: number
    totalSpend: number
  }
  platform: {
    workersAvailable: number
    complianceAlerts: number
    totalSpend: number
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeAdminStats(raw: any): AdminStats {
  const bookings = raw.bookings ?? {}
  const platform = raw.platform ?? {}
  return {
    users: raw.users ?? { total: 0, workers: 0, employers: 0, admins: 0, newThisMonth: 0 },
    jobs: raw.jobs ?? { total: 0, draft: 0, active: 0, filled: 0, cancelled: 0 },
    bookings: {
      total: bookings.total ?? 0,
      pending: bookings.pending ?? 0,
      confirmed: bookings.confirmed ?? 0,
      completed: bookings.completed ?? 0,
      cancelled: bookings.cancelled ?? 0,
      totalSpend: parseFloat(bookings.totalSpend ?? '0'),
    },
    platform: {
      workersAvailable: platform.workersAvailable ?? 0,
      complianceAlerts: platform.complianceAlerts ?? 0,
      totalSpend: parseFloat(platform.totalSpend ?? '0'),
    },
  }
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const { data } = await api.get('/admin/stats')
  return normalizeAdminStats(data.data)
}

export async function fetchUsers(params: { role?: string; page?: number } = {}): Promise<PaginatedResponse<User>> {
  const { data } = await api.get<PaginatedResponse<User>>('/admin/users', { params })
  return data
}

export async function fetchUser(id: string): Promise<User> {
  const { data } = await api.get<{ data: User }>(`/admin/users/${id}`)
  return data.data
}

export async function suspendUser(id: string): Promise<User> {
  const { data } = await api.post<{ data: User }>(`/admin/users/${id}/suspend`)
  return data.data
}

export async function unsuspendUser(id: string): Promise<User> {
  const { data } = await api.post<{ data: User }>(`/admin/users/${id}/unsuspend`)
  return data.data
}

export async function fetchAdminJobs(
  params: { trade?: string; location?: string; maxRate?: number; page?: number } = {}
): Promise<PaginatedResponse<import('@/types').Job>> {
  const { data } = await api.get('/jobs', { params })
  return data
}

export interface Dispute {
  id: string
  bookingId: string
  reportedBy: string
  reportedAgainst: string
  reason: string
  status: 'open' | 'investigating' | 'resolved' | 'closed'
  createdAt: string
}

export async function fetchDisputes(): Promise<PaginatedResponse<Dispute>> {
  const { data } = await api.get('/admin/disputes')
  return data
}

export async function resolveDispute(id: string, resolution: string): Promise<void> {
  await api.post(`/admin/disputes/${id}/resolve`, { resolution })
}
