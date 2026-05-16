import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import PageWrapper from '@/components/layout/PageWrapper'
import Card, { CardHeader, CardTitle } from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import { PageSpinner } from '@/components/ui/Spinner'
import { useWorkerProfile, useUpdateWorkerProfile, useUpdateAvailability } from '../hooks/useWorkerProfile'
import { useAuthStore } from '@/stores/authStore'
import { parseApiError } from '@/utils/apiError'
import { useTrades } from '@/features/reference/hooks/useTrades'
import { getSkillsForTrade } from '@/features/reference/tradeSkills'

const schema = z.object({
  trade: z.string().min(1, 'Trade is required'),
  bio: z.string().max(1000),
  location: z.string().min(2),
  hourlyRate: z.coerce.number().min(1),
  yearsExperience: z.coerce.number().min(0),
})

type FormData = z.infer<typeof schema>

const complianceBadge = {
  compliant: { label: 'Compliant', variant: 'green' as const },
  warning: { label: 'Warning', variant: 'amber' as const },
  blocked: { label: 'Blocked', variant: 'danger' as const },
}

export default function WorkerProfilePage() {
  const user = useAuthStore((s) => s.user)
  const { data: profile, isLoading } = useWorkerProfile()
  const updateProfile = useUpdateWorkerProfile()
  const updateAvailability = useUpdateAvailability()
  const location = useLocation()
  const isNewAccount = (location.state as { newAccount?: boolean })?.newAccount === true

  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState('')

  const { register, handleSubmit, reset, setError, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const selectedTrade = watch('trade')
  const suggestedSkills = getSkillsForTrade(selectedTrade ?? '').filter((s) => !skills.includes(s))

  useEffect(() => {
    if (profile) {
      reset({
        trade: profile.tradeCategory,
        bio: profile.bio,
        location: profile.location,
        hourlyRate: profile.hourlyRate,
        yearsExperience: profile.yearsExperience,
      })
      setSkills(profile.skills ?? [])
    }
  }, [profile, reset])

  if (isLoading) return <PageSpinner />

  const compliance = profile?.complianceStatus ? complianceBadge[profile.complianceStatus] : null
  const isAvailable = profile?.availability === 'available'

  const addSkill = (skill: string) => {
    const s = skill.trim()
    if (s && !skills.includes(s)) setSkills((prev) => [...prev, s])
    setSkillInput('')
  }
  const removeSkill = (s: string) => setSkills((prev) => prev.filter((x) => x !== s))

  const { data: tradesData } = useTrades()
  const tradeGroups = tradesData
    ? [
        {
          label: 'Construction & Building',
          options: tradesData
            .filter((t) => t.category === 'construction_building')
            .map((t) => ({ value: t.name, label: t.name })),
        },
        {
          label: 'Engineering & Technical',
          options: tradesData
            .filter((t) => t.category === 'engineering_technical')
            .map((t) => ({ value: t.name, label: t.name })),
        },
      ]
    : undefined

  return (
    <PageWrapper title="My Profile" subtitle="Update your skills and availability">
      {isNewAccount && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-[oklch(0.65_0.16_28_/_0.3)] bg-[oklch(0.65_0.16_28_/_0.08)] px-4 py-4">
          <svg className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">Email verified — welcome to Labourix!</p>
            <p className="mt-0.5 text-xs text-[var(--text3)]">Complete your profile so employers can find and book you for jobs.</p>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <Card className="text-center">
            <div className="flex flex-col items-center gap-3">
              <Avatar name={user?.name ?? ''} size="xl" />
              <div>
                <p className="font-semibold text-[var(--text)]">{user?.name}</p>
                <p className="text-sm text-[var(--text3)]">{profile?.tradeCategory}</p>
              </div>
              {compliance && <Badge variant={compliance.variant}>{compliance.label}</Badge>}
              <div className="text-center">
                <p className="text-2xl font-bold text-[var(--text)]">{profile?.rating.toFixed(1)} ⭐</p>
                <p className="text-xs text-[var(--text3)]">{profile?.ratingCount} reviews</p>
              </div>
              <p className="text-sm text-[var(--text3)]">{profile?.totalJobsCompleted} jobs completed</p>
              <div className="w-full border-t border-[var(--border)] pt-3">
                <p className="text-xs text-[var(--text3)] mb-2">Availability</p>
                <div className="flex items-center justify-center gap-3">
                  <span className={`text-sm font-medium ${isAvailable ? 'text-green-600' : 'text-[var(--text3)]'}`}>
                    {isAvailable ? '✅ Available' : '❌ Unavailable'}
                  </span>
                  <Button
                    size="sm"
                    variant={isAvailable ? 'outline' : 'primary'}
                    loading={updateAvailability.isPending}
                    onClick={() => updateAvailability.mutate(!isAvailable)}
                  >
                    {isAvailable ? 'Go unavailable' : 'Go available'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Edit Profile</CardTitle></CardHeader>
            <form
              onSubmit={handleSubmit((data) =>
                updateProfile.mutate(
                  { ...data, tradeCategory: data.trade, skills },
                  {
                    onError: (error) => {
                      const { errors: fieldErrors } = parseApiError(error)
                      if (fieldErrors) {
                        Object.entries(fieldErrors).forEach(([field, msgs]) =>
                          setError(field as keyof FormData, { message: msgs[0] })
                        )
                      }
                    },
                  }
                )
              )}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Trade"
                  groups={tradeGroups}
                  options={[]}
                  placeholder={tradesData ? 'Select trade' : 'Loading...'}
                  error={errors.trade?.message}
                  {...register('trade')}
                />
                <Input label="Location" placeholder="London, UK" error={errors.location?.message} {...register('location')} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input label="Hourly Rate (£)" type="number" error={errors.hourlyRate?.message} {...register('hourlyRate')} />
                <Input label="Years Experience" type="number" min={0} error={errors.yearsExperience?.message} {...register('yearsExperience')} />
              </div>

              <Textarea label="Bio" placeholder="Tell employers about your experience..." error={errors.bio?.message} {...register('bio')} />

              {/* Skills */}
              <div>
                <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-wide text-[var(--text2)]">Skills</label>
                <div className="flex gap-2">
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput) } }}
                    placeholder="Type a skill and press Enter"
                    className="flex-1 rounded-lg border border-[var(--border2)] bg-[var(--input-bg)] px-3 py-2 text-[13px] text-[var(--text)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.65_0.16_28_/_0.15)]"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={() => addSkill(skillInput)}>Add</Button>
                </div>
                {suggestedSkills.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {suggestedSkills.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => addSkill(s)}
                        className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--text2)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                      >
                        + {s}
                      </button>
                    ))}
                  </div>
                ) : !selectedTrade ? (
                  <p className="mt-1.5 text-xs text-[var(--text3)]">Select a trade to see suggested skills.</p>
                ) : null}
                {skills.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {skills.map((s) => (
                      <Badge key={s} variant="teal" className="gap-1">
                        {s}
                        <button type="button" onClick={() => removeSkill(s)} className="ml-0.5 opacity-70 hover:opacity-100">×</button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button type="submit" loading={updateProfile.isPending}>Save Changes</Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </PageWrapper>
  )
}
