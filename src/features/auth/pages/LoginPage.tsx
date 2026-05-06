import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useLogin } from '../hooks/useLogin'
import { useTheme } from '@/hooks/useTheme'
import { parseApiError } from '@/utils/apiError'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})
type FormData = z.infer<typeof schema>

const DEMO_ACCOUNTS = [
  { role: 'Employer', email: 'james@acmeconstruction.co.uk', color: 'oklch(0.74 0.14 185)' },
  { role: 'Worker',   email: 'danny@email.com',              color: 'oklch(0.72 0.16 145)' },
  { role: 'Admin',    email: 'sarah@labourix.com',           color: 'oklch(0.72 0.15 280)' },
]

export default function LoginPage() {
  const login = useLogin()
  const { isDark, toggle } = useTheme()
  const [bannerError, setBannerError] = useState('')
  const { register, handleSubmit, setValue, setError, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    const msg = sessionStorage.getItem('auth_redirect_message')
    if (msg) {
      setBannerError(msg)
      sessionStorage.removeItem('auth_redirect_message')
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg)] px-4">
      {/* Theme toggle */}
      <button
        onClick={toggle}
        className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text3)] hover:text-[var(--text2)] transition-colors"
      >
        {isDark ? (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
          </svg>
        )}
      </button>

      <div className="w-full max-w-sm fade-in">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ background: 'oklch(0.74 0.14 185)', boxShadow: '0 0 28px oklch(0.74 0.14 185 / 0.4)' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#0a1a18" opacity="0.9"/>
              <path d="M2 17l10 5 10-5" stroke="#0a1a18" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M2 12l10 5 10-5" stroke="#0a1a18" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="text-center">
            <div className="text-[22px] font-bold tracking-tight text-[var(--text)]">Labourix</div>
            <div className="font-mono text-[10px] tracking-[0.08em] text-[var(--text3)]">WORKFORCE INTELLIGENCE PLATFORM</div>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[var(--border2)] bg-[var(--surface)] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.4)]">
          <p className="mb-6 text-[13px] text-[var(--text2)]">Sign in to your account</p>
          {bannerError && (
            <div className="mb-4 rounded-lg border border-[oklch(0.65_0.2_25_/_0.35)] bg-[oklch(0.65_0.2_25_/_0.10)] px-4 py-3 text-sm text-[oklch(0.72_0.18_25)]">
              {bannerError}
            </div>
          )}

          <form
            onSubmit={handleSubmit((d) => {
              setBannerError('')
              login.mutate(d, {
                onError: (error) => {
                  const { message, errors } = parseApiError(error)
                  if (errors?.email) setError('email', { message: errors.email[0] })
                  if (errors?.password) setError('password', { message: errors.password[0] })
                  if (!errors?.email && !errors?.password) setBannerError(message)
                },
              })
            })}
            className="space-y-4"
          >
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <div>
              <Input
                label="Password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />
              <div className="mt-1 text-right">
                <Link to="/forgot-password" className="text-[11px] text-[var(--text3)] hover:text-[oklch(0.74_0.14_185)] transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>
            <Button type="submit" className="w-full mt-2" loading={login.isPending}>
              Sign in
            </Button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6">
            <div className="mb-3 flex items-center gap-2">
              <div className="h-px flex-1 bg-[var(--border)]" />
              <span className="font-mono text-[10px] text-[var(--text3)]">DEMO ACCOUNTS</span>
              <div className="h-px flex-1 bg-[var(--border)]" />
            </div>
            <div className="flex flex-col gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => { setValue('email', acc.email); setValue('password', 'demo1234') }}
                  className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 text-left transition-colors hover:border-[var(--border2)]"
                >
                  <div
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[9px] font-bold"
                    style={{ background: `color-mix(in oklch, ${acc.color} 20%, transparent)`, color: acc.color }}
                  >
                    {acc.role[0]}
                  </div>
                  <div className="flex-1">
                    <div className="text-[12px] font-medium text-[var(--text)]">{acc.role}</div>
                    <div className="font-mono text-[10px] text-[var(--text3)]">{acc.email}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-[12px] text-[var(--text3)]">
          Don't have an account?{' '}
          <Link to="/register" className="text-[oklch(0.74_0.14_185)] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
