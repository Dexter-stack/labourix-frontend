import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import Button from './Button'

export default function SuspendedModal() {
  const message = useAuthStore((s) => s.suspensionMessage)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  if (!message) return null

  const handleSignOut = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-2xl border border-[oklch(0.65_0.2_25_/_0.3)] bg-[var(--surface)] p-8 shadow-2xl">
        {/* Icon */}
        <div className="mb-5 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[oklch(0.65_0.2_25_/_0.12)]">
            <svg className="h-7 w-7 text-[oklch(0.72_0.18_25)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
        </div>

        <h2 className="mb-2 text-center text-lg font-semibold text-[var(--text)]">
          Account Suspended
        </h2>
        <p className="mb-7 text-center text-sm text-[var(--text3)]">
          {message}
        </p>

        <Button className="w-full" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
    </div>
  )
}
