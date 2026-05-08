import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useForgotPassword, useVerifyResetCode, useResetPassword } from '../hooks/useRegister'
import { parseApiError } from '@/utils/apiError'

const emailSchema = z.object({
  email: z.string().email('Enter a valid email'),
})

const codeSchema = z.object({
  code: z.string().min(4, 'Enter the code from your email'),
})

const passwordSchema = z
  .object({
    password: z.string().min(8, 'At least 8 characters'),
    passwordConfirmation: z.string(),
  })
  .refine((d) => d.password === d.passwordConfirmation, {
    message: "Passwords don't match",
    path: ['passwordConfirmation'],
  })

type EmailForm = z.infer<typeof emailSchema>
type CodeForm = z.infer<typeof codeSchema>
type PasswordForm = z.infer<typeof passwordSchema>

function Logo() {
  return (
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
  )
}

function StepIndicator({ current }: { current: 1 | 2 | 3 }) {
  const steps = ['Email', 'Verify', 'Reset']
  return (
    <div className="mb-6 flex items-center gap-2">
      {steps.map((label, i) => {
        const n = i + 1
        const done = n < current
        const active = n === current
        return (
          <div key={label} className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div
                className="flex h-5 w-5 items-center justify-center rounded-full font-mono text-[10px] font-bold transition-colors"
                style={{
                  background: done || active ? 'var(--accent)' : 'var(--surface2)',
                  color: done || active ? '#0a1a18' : 'var(--text3)',
                }}
              >
                {done ? '✓' : n}
              </div>
              <span
                className="text-[11px] font-medium"
                style={{ color: active ? 'var(--text)' : done ? 'var(--accent)' : 'var(--text3)' }}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="h-px w-6 transition-colors"
                style={{ background: done ? 'var(--accent)' : 'var(--border)' }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [email, setEmail] = useState('')
  const [resetToken, setResetToken] = useState('')

  const forgotPassword = useForgotPassword()
  const verifyResetCode = useVerifyResetCode()
  const resetPassword = useResetPassword()

  const emailForm = useForm<EmailForm>({ resolver: zodResolver(emailSchema) })
  const codeForm = useForm<CodeForm>({ resolver: zodResolver(codeSchema) })
  const passwordForm = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) })

  const onEmailSubmit = (data: EmailForm) => {
    forgotPassword.mutate(data, {
      onSuccess: () => {
        setEmail(data.email)
        setStep(2)
      },
      onError: (error) => {
        const { errors: fieldErrors } = parseApiError(error)
        if (fieldErrors?.email) emailForm.setError('email', { message: fieldErrors.email[0] })
      },
    })
  }

  const onCodeSubmit = (data: CodeForm) => {
    verifyResetCode.mutate(
      { email, code: data.code },
      {
        onSuccess: ({ resetToken: token }) => {
          setResetToken(token)
          setStep(3)
        },
        onError: (error) => {
          const { errors: fieldErrors } = parseApiError(error)
          if (fieldErrors?.code) codeForm.setError('code', { message: fieldErrors.code[0] })
        },
      }
    )
  }

  const onPasswordSubmit = (data: PasswordForm) => {
    resetPassword.mutate(
      { email, resetToken, password: data.password, passwordConfirmation: data.passwordConfirmation },
      {
        onError: (error) => {
          const { errors: fieldErrors } = parseApiError(error)
          if (fieldErrors) {
            Object.entries(fieldErrors).forEach(([field, msgs]) =>
              passwordForm.setError(field as keyof PasswordForm, { message: msgs[0] })
            )
          }
        },
      }
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg)] px-4">
      <div className="w-full max-w-sm fade-in">
        <Logo />

        <div className="rounded-2xl border border-[var(--border2)] bg-[var(--surface)] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.4)]">
          <StepIndicator current={step} />

          {step === 1 && (
            <>
              <h2 className="text-[15px] font-semibold text-[var(--text)] mb-1">Forgot your password?</h2>
              <p className="mb-6 text-[13px] text-[var(--text2)]">
                Enter your email and we'll send a verification code.
              </p>
              <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                <Input
                  label="Email address"
                  type="email"
                  placeholder="you@company.com"
                  error={emailForm.formState.errors.email?.message}
                  {...emailForm.register('email')}
                />
                <Button type="submit" className="w-full" loading={forgotPassword.isPending}>
                  Send verification code
                </Button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-[15px] font-semibold text-[var(--text)] mb-1">Check your email</h2>
              <p className="mb-6 text-[13px] text-[var(--text2)]">
                We sent a code to <span className="font-medium text-[var(--text)]">{email}</span>
              </p>
              <form onSubmit={codeForm.handleSubmit(onCodeSubmit)} className="space-y-4">
                <Input
                  label="Verification code"
                  placeholder="Enter the code"
                  autoComplete="one-time-code"
                  error={codeForm.formState.errors.code?.message}
                  {...codeForm.register('code')}
                />
                <Button type="submit" className="w-full" loading={verifyResetCode.isPending}>
                  Verify code
                </Button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-center text-[12px] text-[var(--text3)] hover:text-[var(--text2)] transition-colors"
                >
                  Use a different email
                </button>
              </form>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-[15px] font-semibold text-[var(--text)] mb-1">Set new password</h2>
              <p className="mb-6 text-[13px] text-[var(--text2)]">
                Choose a strong password for your account.
              </p>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <Input
                  label="New password"
                  type="password"
                  placeholder="••••••••"
                  error={passwordForm.formState.errors.password?.message}
                  {...passwordForm.register('password')}
                />
                <Input
                  label="Confirm password"
                  type="password"
                  placeholder="••••••••"
                  error={passwordForm.formState.errors.passwordConfirmation?.message}
                  {...passwordForm.register('passwordConfirmation')}
                />
                <Button type="submit" className="w-full" loading={resetPassword.isPending}>
                  Reset password
                </Button>
              </form>
            </>
          )}
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
