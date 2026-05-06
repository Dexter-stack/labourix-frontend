import { useAuthStore } from '@/stores/authStore'
import Avatar from '@/components/ui/Avatar'
import type { UserRole } from '@/types'

const roleLabel: Record<UserRole, string> = {
  employer:   'Employer',
  worker:     'Worker',
  admin:      'Admin',
  super_admin:'Super Admin',
}

const searchPlaceholder: Partial<Record<UserRole, string>> = {
  employer:   'Search jobs, workers, bookings…',
  worker:     'Search jobs, certifications…',
  admin:      'Search users, jobs, analytics…',
  super_admin:'Search users, jobs, analytics…',
}

interface TopbarProps {
  onMenuOpen: () => void
}

export default function Topbar({ onMenuOpen }: TopbarProps) {
  const user = useAuthStore((s) => s.user)

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-[var(--border)] bg-[var(--surface)] px-4 lg:px-6">
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuOpen}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text3)] hover:text-[var(--text2)] transition-colors lg:hidden"
        aria-label="Open menu"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile logo */}
      <div className="mr-1 font-bold text-[var(--accent)] lg:hidden">Labourix</div>

      {/* Search */}
      <div className="flex flex-1 items-center">
        <div className="relative w-full max-w-md">
          <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text3)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder={user ? (searchPlaceholder[user.role] ?? 'Search…') : 'Search…'}
            className="w-full rounded-lg border border-[var(--border2)] bg-[var(--surface2)] py-2 pl-9 pr-3 text-[13px] text-[var(--text)] placeholder:text-[var(--text3)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-dim)] transition-colors"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface2)] text-[var(--text3)] hover:text-[var(--text2)] transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {/* Notification dot */}
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
        </button>

        {/* AI assistant icon */}
        <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface2)] text-[var(--text3)] hover:text-[var(--text2)] transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H4a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-1" />
          </svg>
        </button>

        {/* Divider */}
        <div className="mx-1 h-6 w-px bg-[var(--border2)]" />

        {/* User */}
        {user && (
          <div className="flex items-center gap-2.5">
            <Avatar name={user.name} size="sm" />
            <div className="hidden sm:block">
              <p className="text-[13px] font-semibold leading-tight text-[var(--text)]">{user.name}</p>
              <p className="text-[11px] leading-tight text-[var(--text3)]">{roleLabel[user.role]}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
