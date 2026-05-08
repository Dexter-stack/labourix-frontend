import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import PageWrapper from '@/components/layout/PageWrapper'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { PageSpinner } from '@/components/ui/Spinner'
import { useJob, useCreateJob, useUpdateJob } from '../hooks/useJobs'
import { parseApiError } from '@/utils/apiError'

const TRADES = [
  'Electrician', 'Plumber', 'Carpenter', 'Bricklayer', 'Roofer',
  'HVAC Technician', 'Scaffolder', 'Painter', 'Plasterer', 'General Labour',
  'Welder', 'Pipefitter', 'Tiler', 'Glazier', 'Steelworker',
]

const COMMON_SKILLS = [
  'Wiring', 'Plumbing', 'Joinery', 'Brickwork', 'Roofing',
  'HVAC', 'Scaffolding', 'Painting', 'Plastering', 'Inspection', 'Health & Safety',
]

const COMMON_CERTS = ['CSCS Card', 'IPAF', 'PASMA', 'Gas Safe', 'ECS Card', 'SMSTS', 'SSSTS', 'First Aid']

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(255),
  trade: z.string().min(1, 'Trade is required'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  location: z.string().min(2, 'Location required'),
  hourlyRate: z.coerce.number().min(0, 'Rate required'),
  startDate: z.string().min(1, 'Start date required'),
  endDate: z.string().optional(),
  workersNeeded: z.coerce.number().min(1).max(999).default(1),
})

type FormData = z.infer<typeof schema>

export default function PostJobPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const navigate = useNavigate()

  const { data: existingJob, isLoading: jobLoading } = useJob(id)
  const createJob = useCreateJob()
  const updateJob = useUpdateJob()
  const isPending = isEdit ? updateJob.isPending : createJob.isPending

  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState('')
  const [certs, setCerts] = useState<string[]>([])
  const formRef = useRef<HTMLFormElement>(null)

  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { workersNeeded: 1 },
  })

  useEffect(() => {
    if (existingJob) {
      reset({
        title: existingJob.title,
        trade: existingJob.trade,
        description: existingJob.description,
        location: existingJob.location,
        hourlyRate: existingJob.hourlyRate,
        startDate: existingJob.startDate?.slice(0, 10) ?? '',
        endDate: existingJob.endDate?.slice(0, 10) ?? '',
        workersNeeded: existingJob.workersNeeded ?? 1,
      })
      setSkills(existingJob.requiredSkills ?? [])
      setCerts(existingJob.requiredCertifications ?? [])
    }
  }, [existingJob]) // eslint-disable-line react-hooks/exhaustive-deps

  const addSkill = (skill: string) => {
    const s = skill.trim()
    if (s && !skills.includes(s)) setSkills((prev) => [...prev, s])
    setSkillInput('')
  }
  const removeSkill = (s: string) => setSkills((prev) => prev.filter((x) => x !== s))
  const toggleCert = (cert: string) =>
    setCerts((prev) => prev.includes(cert) ? prev.filter((c) => c !== cert) : [...prev, cert])

  const handleFieldErrors = (error: unknown) => {
    const { errors: fieldErrors } = parseApiError(error)
    if (fieldErrors) {
      Object.entries(fieldErrors).forEach(([field, msgs]) =>
        setError(field as keyof FormData, { message: msgs[0] })
      )
    }
  }

  const onSubmit = handleSubmit((data) => {
    const payload = {
      ...data,
      requiredSkills: skills,
      requiredCertifications: certs.length > 0 ? certs : undefined,
      endDate: data.endDate || undefined,
    }
    if (isEdit) {
      updateJob.mutate(
        { id: id!, ...payload },
        { onSuccess: () => navigate('/jobs'), onError: handleFieldErrors }
      )
    } else {
      createJob.mutate(
        payload,
        { onSuccess: () => navigate('/jobs'), onError: handleFieldErrors }
      )
    }
  })

  if (isEdit && jobLoading) return <PageSpinner />

  const tradeOptions = [...TRADES]
  if (existingJob?.trade && !TRADES.includes(existingJob.trade)) {
    tradeOptions.unshift(existingJob.trade)
  }

  return (
    <PageWrapper
      title={isEdit ? `Edit job` : 'Post a new job'}
      subtitle={isEdit ? existingJob?.title : 'Fill in the details below to create a job listing'}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/jobs')}>Cancel</Button>
          <Button loading={isPending} onClick={() => formRef.current?.requestSubmit()}>
            {isEdit ? 'Save changes' : 'Post Job'}
          </Button>
        </div>
      }
    >
      <form ref={formRef} onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-6">
        {/* Title + Trade */}
        <Card>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--text3)]">Basic info</p>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Job title"
                placeholder="e.g. Senior Electrician"
                error={errors.title?.message}
                {...register('title')}
              />
              <Select
                label="Trade"
                options={tradeOptions.map((t) => ({ value: t, label: t }))}
                placeholder="Select trade"
                error={errors.trade?.message}
                {...register('trade')}
              />
            </div>
            <Textarea
              label="Description"
              placeholder="Describe the role, site conditions, requirements..."
              rows={4}
              error={errors.description?.message}
              {...register('description')}
            />
          </div>
        </Card>

        {/* Location, Rate, Dates, Workers */}
        <Card>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--text3)]">Details</p>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Location"
                placeholder="London, UK"
                error={errors.location?.message}
                {...register('location')}
              />
              <Input
                label="Hourly rate (£)"
                type="number"
                step="0.01"
                placeholder="25.00"
                error={errors.hourlyRate?.message}
                {...register('hourlyRate')}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Start date"
                type="date"
                error={errors.startDate?.message}
                {...register('startDate')}
              />
              <Input
                label="End date (optional)"
                type="date"
                error={errors.endDate?.message}
                {...register('endDate')}
              />
              <Input
                label="Workers needed"
                type="number"
                min={1}
                error={errors.workersNeeded?.message}
                {...register('workersNeeded')}
              />
            </div>
          </div>
        </Card>

        {/* Skills */}
        <Card>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--text3)]">
            Required skills <span className="text-[oklch(0.65_0.2_25)]">*</span>
          </p>
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
          <div className="mt-3 flex flex-wrap gap-1.5">
            {COMMON_SKILLS.map((s) => (
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
          {skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <Badge key={s} variant="teal" className="gap-1">
                  {s}
                  <button type="button" onClick={() => removeSkill(s)} className="ml-0.5 opacity-70 hover:opacity-100">×</button>
                </Badge>
              ))}
            </div>
          )}
        </Card>

        {/* Certifications */}
        <Card>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--text3)]">
            Required certifications{' '}
            <span className="text-[11px] normal-case font-normal text-[var(--text3)]">(optional)</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_CERTS.map((cert) => (
              <button
                key={cert}
                type="button"
                onClick={() => toggleCert(cert)}
                className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                  certs.includes(cert)
                    ? 'border-[var(--accent)] bg-[oklch(0.65_0.16_28_/_0.12)] text-[var(--accent)]'
                    : 'border-[var(--border)] text-[var(--text2)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                }`}
              >
                {certs.includes(cert) ? '✓ ' : '+ '}{cert}
              </button>
            ))}
          </div>
        </Card>

        {/* Bottom actions (repeat for convenience) */}
        <div className="flex justify-end gap-2 pb-6">
          <Button variant="outline" type="button" onClick={() => navigate('/jobs')}>Cancel</Button>
          <Button type="submit" loading={isPending}>
            {isEdit ? 'Save changes' : 'Post Job'}
          </Button>
        </div>
      </form>
    </PageWrapper>
  )
}
