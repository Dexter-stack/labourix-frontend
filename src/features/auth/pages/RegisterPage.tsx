import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { useRegisterEmployer, useRegisterWorker } from '../hooks/useRegister'
import { useTheme } from '@/hooks/useTheme'
import { parseApiError } from '@/utils/apiError'

const employerSchema = z.object({
  name: z.string().min(2, 'Full name required'),
  email: z.string().email('Enter a valid email'),
  companyName: z.string().min(2, 'Company name required'),
  industry: z.string().optional(),
  password: z.string().min(8, 'At least 8 characters'),
  passwordConfirmation: z.string(),
}).refine((d) => d.password === d.passwordConfirmation, {
  message: "Passwords don't match",
  path: ['passwordConfirmation'],
})

const workerSchema = z.object({
  name: z.string().min(2, 'Full name required'),
  email: z.string().email('Enter a valid email'),
  tradeCategory: z.string().min(1, 'Select a trade'),
  location: z.string().min(2, 'Location required'),
  password: z.string().min(8, 'At least 8 characters'),
  passwordConfirmation: z.string(),
}).refine((d) => d.password === d.passwordConfirmation, {
  message: "Passwords don't match",
  path: ['passwordConfirmation'],
})

type EmployerForm = z.infer<typeof employerSchema>
type WorkerForm = z.infer<typeof workerSchema>

const trades = [
  { value: 'electrician', label: 'Electrician' },
  { value: 'plumber', label: 'Plumber' },
  { value: 'carpenter', label: 'Carpenter' },
  { value: 'plasterer', label: 'Plasterer' },
  { value: 'painter', label: 'Painter & Decorator' },
  { value: 'bricklayer', label: 'Bricklayer' },
  { value: 'roofer', label: 'Roofer' },
  { value: 'hvac', label: 'HVAC Engineer' },
  { value: 'scaffolder', label: 'Scaffolder' },
  { value: 'general_labourer', label: 'General Labourer' },
]

const industries = [
  { value: 'construction', label: 'Construction' },
  { value: 'facilities_management', label: 'Facilities Management' },
  { value: 'property', label: 'Property & Real Estate' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'civil_engineering', label: 'Civil Engineering' },
]

const STEP_LABELS = ['Your role', 'Your details', 'Set password']

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="mb-6 flex items-center justify-center gap-0">
      {STEP_LABELS.map((label, i) => {
        const step = i + 1
        const done = step < current
        const active = step === current
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold transition-colors ${
                  done
                    ? 'bg-[var(--accent)] text-white'
                    : active
                    ? 'border-2 border-[var(--accent)] text-[var(--accent)]'
                    : 'border-2 border-[var(--border2)] text-[var(--text3)]'
                }`}
              >
                {done ? (
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : step}
              </div>
              <span className={`text-[10px] whitespace-nowrap ${active ? 'text-[var(--accent)] font-medium' : 'text-[var(--text3)]'}`}>
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={`mb-4 mx-2 h-px w-10 ${done ? 'bg-[var(--accent)]' : 'bg-[var(--border2)]'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function RegisterPage() {
  const [role, setRole] = useState<'employer' | 'worker'>('employer')
  const [step, setStep] = useState(1)
  const registerEmployer = useRegisterEmployer()
  const registerWorker = useRegisterWorker()
  const { isDark, toggle } = useTheme()

  const employerForm = useForm<EmployerForm>({ resolver: zodResolver(employerSchema) })
  const workerForm = useForm<WorkerForm>({ resolver: zodResolver(workerSchema) })

  const isPending = role === 'employer' ? registerEmployer.isPending : registerWorker.isPending

  const handleNext = async () => {
    let valid = false
    if (step === 1) {
      valid = role === 'employer'
        ? await employerForm.trigger(['name', 'email'])
        : await workerForm.trigger(['name', 'email'])
    } else if (step === 2) {
      valid = role === 'employer'
        ? await employerForm.trigger(['companyName'])
        : await workerForm.trigger(['tradeCategory', 'location'])
    }
    if (valid) setStep((s) => s + 1)
  }

  const handleSubmitEmployer = employerForm.handleSubmit((data) =>
    registerEmployer.mutate(data, {
      onError: (error) => {
        const { errors } = parseApiError(error)
        if (errors) {
          Object.entries(errors).forEach(([field, msgs]) =>
            employerForm.setError(field as keyof EmployerForm, { message: msgs[0] })
          )
          if (errors.name || errors.email) setStep(1)
          else if (errors.companyName || errors.industry) setStep(2)
        }
      },
    })
  )

  const handleSubmitWorker = workerForm.handleSubmit((data) =>
    registerWorker.mutate(data, {
      onError: (error) => {
        const { errors } = parseApiError(error)
        if (errors) {
          Object.entries(errors).forEach(([field, msgs]) =>
            workerForm.setError(field as keyof WorkerForm, { message: msgs[0] })
          )
          if (errors.name || errors.email) setStep(1)
          else if (errors.tradeCategory || errors.location) setStep(2)
        }
      },
    })
  )

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg)] px-4 py-10">
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
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)]"
            style={{ boxShadow: `0 0 28px var(--accent-dim)` }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" opacity="0.9"/>
              <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="text-center">
            <div className="text-[22px] font-bold tracking-tight text-[var(--text)]">Labourix</div>
            <div className="font-mono text-[10px] tracking-[0.08em] text-[var(--text3)]">WORKFORCE INTELLIGENCE PLATFORM</div>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[var(--border2)] bg-[var(--surface)] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.4)]">
          <StepIndicator current={step} />

          {/* ── Step 1: Role + Identity ── */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Role toggle */}
              <div className="flex gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface2)] p-1">
                {(['employer', 'worker'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex-1 rounded-lg py-2 text-[12px] font-medium transition-all ${
                      role === r
                        ? 'bg-[var(--accent)] text-white'
                        : 'text-[var(--text3)] hover:text-[var(--text2)]'
                    }`}
                  >
                    {r === 'employer' ? "I'm hiring" : "I'm a worker"}
                  </button>
                ))}
              </div>

              {role === 'employer' ? (
                <>
                  <Input label="Full name" placeholder="John Smith" error={employerForm.formState.errors.name?.message} {...employerForm.register('name')} />
                  <Input label="Email address" type="email" placeholder="you@company.com" error={employerForm.formState.errors.email?.message} {...employerForm.register('email')} />
                </>
              ) : (
                <>
                  <Input label="Full name" placeholder="John Smith" error={workerForm.formState.errors.name?.message} {...workerForm.register('name')} />
                  <Input label="Email address" type="email" placeholder="you@email.com" error={workerForm.formState.errors.email?.message} {...workerForm.register('email')} />
                </>
              )}

              <Button className="w-full mt-2" onClick={handleNext}>
                Next
                <svg className="ml-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          )}

          {/* ── Step 2: Role-specific details ── */}
          {step === 2 && (
            <div className="space-y-4">
              {role === 'employer' ? (
                <>
                  <Input label="Company name" placeholder="Acme Construction Ltd" error={employerForm.formState.errors.companyName?.message} {...employerForm.register('companyName')} />
                  <Select label="Industry" options={industries} placeholder="Select industry" error={employerForm.formState.errors.industry?.message} {...employerForm.register('industry')} />
                </>
              ) : (
                <>
                  <Select label="Trade / skill" options={trades} placeholder="Select your trade" error={workerForm.formState.errors.tradeCategory?.message} {...workerForm.register('tradeCategory')} />
                  <Input label="Location" placeholder="London, UK" error={workerForm.formState.errors.location?.message} {...workerForm.register('location')} />
                </>
              )}

              <div className="flex gap-2 mt-2">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                  <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </Button>
                <Button className="flex-1" onClick={handleNext}>
                  Next
                  <svg className="ml-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </div>
            </div>
          )}

          {/* ── Step 3: Password ── */}
          {step === 3 && (
            <form
              onSubmit={role === 'employer' ? handleSubmitEmployer : handleSubmitWorker}
              className="space-y-4"
            >
              {role === 'employer' ? (
                <>
                  <Input label="Password" type="password" placeholder="••••••••" error={employerForm.formState.errors.password?.message} {...employerForm.register('password')} />
                  <Input label="Confirm password" type="password" placeholder="••••••••" error={employerForm.formState.errors.passwordConfirmation?.message} {...employerForm.register('passwordConfirmation')} />
                </>
              ) : (
                <>
                  <Input label="Password" type="password" placeholder="••••••••" error={workerForm.formState.errors.password?.message} {...workerForm.register('password')} />
                  <Input label="Confirm password" type="password" placeholder="••••••••" error={workerForm.formState.errors.passwordConfirmation?.message} {...workerForm.register('passwordConfirmation')} />
                </>
              )}

              <div className="flex gap-2 mt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(2)}>
                  <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </Button>
                <Button type="submit" className="flex-1" loading={isPending}>
                  Create account
                </Button>
              </div>
            </form>
          )}
        </div>

        <p className="mt-5 text-center text-[12px] text-[var(--text3)]">
          Already have an account?{' '}
          <Link to="/login" className="text-[var(--accent)] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
