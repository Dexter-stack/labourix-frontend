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

const ROLE_CONFIG = {
  employer: { accent: 'oklch(0.74 0.14 185)', label: "I'm hiring" },
  worker:   { accent: 'oklch(0.72 0.16 145)', label: "I'm a worker" },
}

export default function RegisterPage() {
  const [role, setRole] = useState<'employer' | 'worker'>('employer')
  const registerEmployer = useRegisterEmployer()
  const registerWorker = useRegisterWorker()
  const { isDark, toggle } = useTheme()

  const employerForm = useForm<EmployerForm>({ resolver: zodResolver(employerSchema) })
  const workerForm = useForm<WorkerForm>({ resolver: zodResolver(workerSchema) })

  const accent = ROLE_CONFIG[role].accent

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
            className="flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ background: accent, boxShadow: `0 0 28px color-mix(in oklch, ${accent} 40%, transparent)` }}
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
          <p className="mb-5 text-[13px] text-[var(--text2)]">Create your account</p>

          {/* Role toggle */}
          <div className="mb-6 flex gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface2)] p-1">
            {(['employer', 'worker'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className="flex-1 rounded-lg py-2 text-[12px] font-medium transition-all"
                style={role === r ? {
                  background: `color-mix(in oklch, ${ROLE_CONFIG[r].accent} 18%, transparent)`,
                  color: ROLE_CONFIG[r].accent,
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderColor: `color-mix(in oklch, ${ROLE_CONFIG[r].accent} 28%, transparent)`,
                } : { color: 'var(--text3)' }}
              >
                {ROLE_CONFIG[r].label}
              </button>
            ))}
          </div>

          {role === 'employer' ? (
            <form
              onSubmit={employerForm.handleSubmit((data) =>
                registerEmployer.mutate(data, {
                  onError: (error) => {
                    const { errors } = parseApiError(error)
                    if (errors) {
                      Object.entries(errors).forEach(([field, msgs]) =>
                        employerForm.setError(field as keyof EmployerForm, { message: msgs[0] })
                      )
                    }
                  },
                })
              )}
              className="space-y-4"
            >
              <Input label="Full name" placeholder="John Smith" error={employerForm.formState.errors.name?.message} {...employerForm.register('name')} />
              <Input label="Email address" type="email" placeholder="you@company.com" error={employerForm.formState.errors.email?.message} {...employerForm.register('email')} />
              <Input label="Company name" placeholder="Acme Construction Ltd" error={employerForm.formState.errors.companyName?.message} {...employerForm.register('companyName')} />
              <Select label="Industry" options={industries} placeholder="Select industry" error={employerForm.formState.errors.industry?.message} {...employerForm.register('industry')} />
              <Input label="Password" type="password" placeholder="••••••••" error={employerForm.formState.errors.password?.message} {...employerForm.register('password')} />
              <Input label="Confirm password" type="password" placeholder="••••••••" error={employerForm.formState.errors.passwordConfirmation?.message} {...employerForm.register('passwordConfirmation')} />
              <Button type="submit" className="w-full mt-2" loading={registerEmployer.isPending}>Create employer account</Button>
            </form>
          ) : (
            <form
              onSubmit={workerForm.handleSubmit((data) =>
                registerWorker.mutate(data, {
                  onError: (error) => {
                    const { errors } = parseApiError(error)
                    if (errors) {
                      Object.entries(errors).forEach(([field, msgs]) =>
                        workerForm.setError(field as keyof WorkerForm, { message: msgs[0] })
                      )
                    }
                  },
                })
              )}
              className="space-y-4"
            >
              <Input label="Full name" placeholder="John Smith" error={workerForm.formState.errors.name?.message} {...workerForm.register('name')} />
              <Input label="Email address" type="email" placeholder="you@email.com" error={workerForm.formState.errors.email?.message} {...workerForm.register('email')} />
              <Select label="Trade / skill" options={trades} placeholder="Select your trade" error={workerForm.formState.errors.tradeCategory?.message} {...workerForm.register('tradeCategory')} />
              <Input label="Location" placeholder="London, UK" error={workerForm.formState.errors.location?.message} {...workerForm.register('location')} />
              <Input label="Password" type="password" placeholder="••••••••" error={workerForm.formState.errors.password?.message} {...workerForm.register('password')} />
              <Input label="Confirm password" type="password" placeholder="••••••••" error={workerForm.formState.errors.passwordConfirmation?.message} {...workerForm.register('passwordConfirmation')} />
              <Button type="submit" className="w-full mt-2" loading={registerWorker.isPending}>Create worker account</Button>
            </form>
          )}
        </div>

        <p className="mt-5 text-center text-[12px] text-[var(--text3)]">
          Already have an account?{' '}
          <Link to="/login" className="text-[oklch(0.74_0.14_185)] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
