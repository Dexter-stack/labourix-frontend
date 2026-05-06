import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import PageWrapper from '@/components/layout/PageWrapper'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import { PageSpinner } from '@/components/ui/Spinner'
import { fetchUser, suspendUser, unsuspendUser } from '../api'
import { useNotify } from '@/hooks/useNotify'
import { parseApiError } from '@/utils/apiError'
import { formatDate } from '@/utils/format'
import type { UserRole } from '@/types'

const roleBadge: Record<UserRole, { label: string; variant: 'teal' | 'gray' | 'amber' | 'danger' }> = {
  employer:    { label: 'Employer',    variant: 'teal' },
  worker:      { label: 'Worker',      variant: 'gray' },
  admin:       { label: 'Admin',       variant: 'amber' },
  super_admin: { label: 'Super Admin', variant: 'danger' },
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-[var(--border)] last:border-0">
      <span className="text-xs font-medium text-[var(--text3)] uppercase tracking-wide shrink-0">{label}</span>
      <span className="text-sm text-[var(--text)] text-right">{value}</span>
    </div>
  )
}

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const notify = useNotify()

  const { data: user, isLoading } = useQuery({
    queryKey: ['admin-user', id],
    queryFn: () => fetchUser(id!),
  })

  const handleError = (error: unknown, action: string) => {
    const { message } = parseApiError(error)
    notify.error(`Failed to ${action} user`, message)
  }

  const suspend = useMutation({
    mutationFn: () => suspendUser(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-user', id] })
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      notify.success('User suspended', 'The user is blocked from role-specific actions.')
    },
    onError: (error) => handleError(error, 'suspend'),
  })

  const unsuspend = useMutation({
    mutationFn: () => unsuspendUser(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-user', id] })
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      notify.success('User unsuspended', 'The user can now access the platform again.')
    },
    onError: (error) => handleError(error, 'unsuspend'),
  })

  if (isLoading) return <PageSpinner />
  if (!user) return <div className="p-8 text-center text-[var(--text3)]">User not found.</div>

  const { label, variant } = roleBadge[user.role] ?? { label: user.role, variant: 'gray' as const }

  return (
    <PageWrapper
      title={user.name}
      subtitle={user.email}
      actions={
        <div className="flex items-center gap-2">
          <Link to="/admin/users">
            <Button variant="outline" size="sm">Back to Users</Button>
          </Link>
          {user.isSuspended ? (
            <Button
              size="sm"
              variant="outline"
              loading={unsuspend.isPending}
              onClick={() => unsuspend.mutate()}
            >
              Unsuspend
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              loading={suspend.isPending}
              onClick={() => suspend.mutate()}
            >
              Suspend
            </Button>
          )}
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6">
          {/* Identity card */}
          <Card>
            <div className="flex flex-col items-center gap-3 pb-4 border-b border-[var(--border)]">
              <Avatar name={user.name} src={user.avatar} size="lg" />
              <div className="text-center">
                <p className="font-semibold text-[var(--text)]">{user.name}</p>
                <p className="text-xs text-[var(--text3)] mt-0.5">{user.email}</p>
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                <Badge variant={variant}>{label}</Badge>
                {user.isSuspended
                  ? <Badge variant="danger">Suspended</Badge>
                  : <Badge variant="green">Active</Badge>
                }
              </div>
            </div>
            <div className="pt-2">
              <DetailRow label="Joined" value={formatDate(user.createdAt)} />
              <DetailRow
                label="Email verified"
                value={
                  user.emailVerifiedAt
                    ? <span className="text-[oklch(0.72_0.16_145)]">Verified</span>
                    : <span className="text-[oklch(0.78_0.15_72)]">Not verified</span>
                }
              />
              {user.isSuspended && user.suspendedAt && (
                <DetailRow label="Suspended on" value={formatDate(user.suspendedAt)} />
              )}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Suspension warning */}
          {user.isSuspended && (
            <div className="rounded-xl border border-[oklch(0.65_0.2_25_/_0.35)] bg-[oklch(0.65_0.2_25_/_0.08)] px-4 py-3 flex items-center gap-3">
              <svg className="h-5 w-5 shrink-0 text-[oklch(0.72_0.18_25)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-[oklch(0.72_0.18_25)]">Account suspended</p>
                <p className="text-xs text-[var(--text3)]">
                  This user cannot access role-specific features.
                  {user.suspendedAt && ` Suspended on ${formatDate(user.suspendedAt)}.`}
                </p>
              </div>
            </div>
          )}

          {/* Profile details */}
          <Card>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text3)] mb-4">Profile</p>
            {user.profile ? (
              <div>
                {user.profile.tradeCategory && (
                  <DetailRow label="Trade" value={<Badge variant="teal">{user.profile.tradeCategory}</Badge>} />
                )}
                {user.profile.location && (
                  <DetailRow label="Location" value={user.profile.location} />
                )}
                {user.profile.rating != null && (
                  <DetailRow label="Rating" value={`${user.profile.rating.toFixed(1)} / 5.0`} />
                )}
                {user.profile.isAvailable != null && (
                  <DetailRow
                    label="Availability"
                    value={
                      user.profile.isAvailable
                        ? <Badge variant="green">Available</Badge>
                        : <Badge variant="gray">Unavailable</Badge>
                    }
                  />
                )}
                {user.profile.complianceStatus && (
                  <DetailRow
                    label="Compliance"
                    value={
                      <Badge variant={user.profile.complianceStatus === 'compliant' ? 'green' : 'amber'}>
                        {user.profile.complianceStatus}
                      </Badge>
                    }
                  />
                )}
                {!user.profile.tradeCategory &&
                  !user.profile.location &&
                  user.profile.rating == null &&
                  user.profile.isAvailable == null &&
                  !user.profile.complianceStatus && (
                    <p className="text-sm text-[var(--text3)]">No profile details available.</p>
                  )}
              </div>
            ) : (
              <p className="text-sm text-[var(--text3)]">This user has not completed their profile.</p>
            )}
          </Card>

          {/* Account metadata */}
          <Card>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text3)] mb-4">Account</p>
            <DetailRow label="User ID" value={<span className="font-mono text-xs">{user.id}</span>} />
            <DetailRow label="Role" value={<Badge variant={variant}>{label}</Badge>} />
            <DetailRow label="Created" value={formatDate(user.createdAt)} />
            <DetailRow label="Last updated" value={formatDate(user.updatedAt)} />
          </Card>
        </div>
      </div>
    </PageWrapper>
  )
}
