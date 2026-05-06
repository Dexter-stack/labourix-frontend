import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import PageWrapper from '@/components/layout/PageWrapper'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Avatar from '@/components/ui/Avatar'
import { PageSpinner } from '@/components/ui/Spinner'
import EmptyState from '@/components/ui/EmptyState'
import { fetchUsers, suspendUser, unsuspendUser } from '../api'
import { useNotify } from '@/hooks/useNotify'
import { parseApiError } from '@/utils/apiError'
import { formatDate } from '@/utils/format'
import type { User, UserRole } from '@/types'

const roleBadge: Record<UserRole, { label: string; variant: 'teal' | 'gray' | 'amber' | 'danger' }> = {
  employer:    { label: 'Employer',    variant: 'teal' },
  worker:      { label: 'Worker',      variant: 'gray' },
  admin:       { label: 'Admin',       variant: 'amber' },
  super_admin: { label: 'Super Admin', variant: 'danger' },
}

function SuspendToggle({ user }: { user: User }) {
  const notify = useNotify()

  const handleError = (error: unknown, action: string) => {
    const { message } = parseApiError(error)
    notify.error(`Failed to ${action} user`, message)
  }

  const suspend = useMutation({
    mutationFn: () => suspendUser(user.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      notify.success('User suspended', 'The user is blocked from role-specific actions.')
    },
    onError: (error) => handleError(error, 'suspend'),
  })

  const unsuspend = useMutation({
    mutationFn: () => unsuspendUser(user.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      notify.success('User unsuspended', 'The user can now access the platform again.')
    },
    onError: (error) => handleError(error, 'unsuspend'),
  })

  if (user.isSuspended) {
    return (
      <Button
        size="sm"
        variant="outline"
        loading={unsuspend.isPending}
        onClick={() => unsuspend.mutate()}
      >
        Unsuspend
      </Button>
    )
  }

  return (
    <Button
      size="sm"
      variant="outline"
      loading={suspend.isPending}
      onClick={() => suspend.mutate()}
    >
      Suspend
    </Button>
  )
}

export default function AdminUsersPage() {
  const [role, setRole] = useState('')
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', role],
    queryFn: () => fetchUsers({ role: role || undefined }),
  })

  return (
    <PageWrapper title="User Management" subtitle={`${data?.meta.total ?? 0} users`}>
      <div className="mb-4 flex gap-3">
        <Select
          options={[
            { value: 'employer',    label: 'Employers' },
            { value: 'worker',      label: 'Workers' },
            { value: 'admin',       label: 'Admins' },
            { value: 'super_admin', label: 'Super Admins' },
          ]}
          placeholder="All roles"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-44"
        />
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : data?.data.length === 0 ? (
        <EmptyState title="No users found" />
      ) : (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[var(--border)] bg-[var(--surface2)]">
                <tr>
                  {['User', 'Role', 'Profile', 'Status', 'Joined', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text3)]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {data?.data.map((user) => {
                  const { label, variant } = roleBadge[user.role] ?? { label: user.role, variant: 'gray' as const }
                  return (
                    <tr
                      key={user.id}
                      className={`cursor-pointer transition-colors hover:bg-[var(--surface2)] ${user.isSuspended ? 'opacity-60' : ''}`}
                      onClick={(e) => {
                        if ((e.target as HTMLElement).closest('button')) return
                        navigate(`/admin/users/${user.id}`)
                      }}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={user.name} src={user.avatar} size="sm" />
                          <div className="min-w-0">
                            <p className="font-medium text-[var(--text)]">{user.name}</p>
                            <p className="truncate text-xs text-[var(--text3)]">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <Badge variant={variant}>{label}</Badge>
                      </td>

                      <td className="px-4 py-3">
                        {user.profile ? (
                          <div className="space-y-0.5">
                            {user.profile.tradeCategory && (
                              <p className="text-xs font-medium text-[var(--text)]">{user.profile.tradeCategory}</p>
                            )}
                            {user.profile.location && (
                              <p className="text-xs text-[var(--text3)]">{user.profile.location}</p>
                            )}
                            {user.profile.rating != null && (
                              <p className="text-xs text-[var(--text3)]">⭐ {user.profile.rating.toFixed(1)}</p>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-[var(--text3)]">—</span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        {user.isSuspended ? (
                          <div>
                            <Badge variant="danger">Suspended</Badge>
                            {user.suspendedAt && (
                              <p className="mt-1 text-[10px] text-[var(--text3)]">{formatDate(user.suspendedAt)}</p>
                            )}
                          </div>
                        ) : (
                          <Badge variant="green">Active</Badge>
                        )}
                      </td>

                      <td className="px-4 py-3 text-xs text-[var(--text3)]">
                        {formatDate(user.createdAt)}
                      </td>

                      <td className="px-4 py-3">
                        <SuspendToggle user={user} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </PageWrapper>
  )
}
