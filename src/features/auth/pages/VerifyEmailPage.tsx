import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useLocation } from 'react-router-dom'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useVerifyEmail, useResendOtp } from '../hooks/useRegister'
import { parseApiError } from '@/utils/apiError'

const schema = z.object({
  code: z.string().min(4, 'Enter the verification code').max(8),
})
type FormData = z.infer<typeof schema>

export default function VerifyEmailPage() {
  const location = useLocation()
  const email = (location.state as { email?: string })?.email ?? ''
  const verifyEmail = useVerifyEmail()
  const resendOtp = useResendOtp()
  const [countdown, setCountdown] = useState(60)

  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  const { register, handleSubmit, setError, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg)] px-4">
      <div className="w-full max-w-sm fade-in">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ background: 'var(--accent)', boxShadow: '0 0 28px oklch(0.65 0.16 28 / 0.4)' }}
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

        <div className="rounded-2xl border border-[var(--border2)] bg-[var(--surface)] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.4)]">
          <h2 className="text-[15px] font-semibold text-[var(--text)] mb-1">Check your email</h2>
          <p className="mb-6 text-[13px] text-[var(--text2)]">
            We sent a verification code to{' '}
            {email && <span className="font-medium text-[var(--text)]">{email}</span>}
          </p>

          <form
            onSubmit={handleSubmit((d) =>
              verifyEmail.mutate({ email, code: d.code }, {
                onError: (error) => {
                  const { errors: fieldErrors } = parseApiError(error)
                  if (fieldErrors?.code) setError('code', { message: fieldErrors.code[0] })
                },
              })
            )}
            className="space-y-4"
          >
            <Input
              label="Verification code"
              placeholder="Enter code"
              autoComplete="one-time-code"
              error={errors.code?.message}
              {...register('code')}
            />
            <Button type="submit" className="w-full" loading={verifyEmail.isPending}>
              Verify email
            </Button>
          </form>

          <div className="mt-4 text-center">
            {countdown > 0 ? (
              <p className="text-[12px] text-[var(--text3)]">Resend code in {countdown}s</p>
            ) : (
              <button
                type="button"
                onClick={() => { resendOtp.mutate({ email }); setCountdown(60) }}
                className="text-[12px] text-[var(--accent)] hover:underline disabled:opacity-50"
                disabled={resendOtp.isPending}
              >
                {resendOtp.isPending ? 'Sending…' : 'Resend code'}
              </button>
            )}
          </div>
        </div>

        <p className="mt-5 text-center text-[12px] text-[var(--text3)]">
          <Link to="/login" className="text-[var(--accent)] hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
