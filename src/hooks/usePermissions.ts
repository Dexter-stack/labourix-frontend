import { useAuthStore } from '@/stores/authStore'
import type { UserRole } from '@/types'

type Permission =
  | 'post_job'
  | 'view_job_matches'
  | 'book_worker'
  | 'manage_workforce'
  | 'view_demand_forecast'
  | 'accept_job'
  | 'upload_certification'
  | 'set_availability'
  | 'manage_users'
  | 'moderate_jobs'
  | 'view_analytics'
  | 'resolve_disputes'
  | 'manage_platform'

const rolePermissions: Record<UserRole, Permission[]> = {
  employer: [
    'post_job',
    'view_job_matches',
    'book_worker',
    'manage_workforce',
    'view_demand_forecast',
  ],
  worker: ['accept_job', 'upload_certification', 'set_availability'],
  admin: [
    'manage_users',
    'moderate_jobs',
    'view_analytics',
    'resolve_disputes',
  ],
  super_admin: [
    'manage_users',
    'moderate_jobs',
    'view_analytics',
    'resolve_disputes',
    'manage_platform',
    'post_job',
    'view_job_matches',
  ],
}

export function usePermissions() {
  const user = useAuthStore((s) => s.user)

  const can = (permission: Permission): boolean => {
    if (!user) return false
    return rolePermissions[user.role]?.includes(permission) ?? false
  }

  const hasRole = (...roles: UserRole[]): boolean => {
    if (!user) return false
    return roles.includes(user.role)
  }

  return { can, hasRole }
}
