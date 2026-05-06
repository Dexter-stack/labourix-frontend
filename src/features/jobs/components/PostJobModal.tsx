import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { useCreateJob, useUpdateJob } from '../hooks/useJobs'
import { parseApiError } from '@/utils/apiError'
import type { Job } from '@/types'

const TRADES = [
  'Electrician', 'Plumber', 'Carpenter', 'Bricklayer', 'Roofer',
  'HVAC Technician', 'Scaffolder', 'Painter', 'Plasterer', 'General Labour',
  'Welder', 'Pipefitter', 'Tiler', 'Glazier', 'Steelworker',
]

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(255),
  trade: z.string().min(1, 'Trade is required').max(100),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  location: z.string().min(2, 'Location required').max(255),
  hourlyRate: z.coerce.number().min(0, 'Rate required'),
  startDate: z.string().min(1, 'Start date required'),
  endDate: z.string().optional(),
  workersNeeded: z.coerce.number().min(1).max(999).default(1),
})

type FormData = z.infer<typeof schema>

interface PostJobModalProps {
  open: boolean
  onClose: () => void
  job?: Job
}

const COMMON_SKILLS = ['Wiring', 'Plumbing', 'Joinery', 'Brickwork', 'Roofing', 'HVAC', 'Scaffolding', 'Painting', 'Plastering', 'Inspection', 'Health & Safety']
const COMMON_CERTS = ['CSCS Card', 'IPAF', 'PASMA', 'Gas Safe', 'ECS Card', 'SMSTS', 'SSSTS', 'First Aid']

export default function PostJobModal({ open, onClose, job }: PostJobModalProps) {
  const isEdit = !!job
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

  // Populate form whenever the modal opens (create or edit)
  useEffect(() => {
    if (!open) return
    if (job) {
      reset({
        title: job.title,
        trade: job.trade,
        description: job.description,
        location: job.location,
        hourlyRate: job.hourlyRate,
        startDate: job.startDate?.slice(0, 10) ?? '',
        endDate: job.endDate?.slice(0, 10) ?? '',
        workersNeeded: job.workersNeeded ?? 1,
      })
      setSkills(job.requiredSkills ?? [])
      setCerts(job.requiredCertifications ?? [])
    } else {
      reset({ workersNeeded: 1 })
      setSkills([])
      setCerts([])
      setSkillInput('')
    }
  }, [open, job]) // eslint-disable-line react-hooks/exhaustive-deps

  const tradeOptions = [...TRADES]
  if (job?.trade && !TRADES.includes(job.trade)) tradeOptions.unshift(job.trade)

  const addSkill = (skill: string) => {
    const s = skill.trim()
    if (s && !skills.includes(s)) setSkills([...skills, s])
    setSkillInput('')
  }
  const removeSkill = (s: string) => setSkills(skills.filter((x) => x !== s))

  const toggleCert = (cert: string) =>
    setCerts((prev) => prev.includes(cert) ? prev.filter((c) => c !== cert) : [...prev, cert])

  const handleClose = () => {
    reset()
    setSkills([])
    setCerts([])
    setSkillInput('')
    onClose()
  }

  const handleFieldErrors = (error: unknown) => {
    const { errors: fieldErrors } = parseApiError(error)
    if (fieldErrors) {
      Object.entries(fieldErrors).forEach(([field, msgs]) =>
        setError(field as keyof FormData, { message: msgs[0] })
      )
    }
  }

  const onSubmit = handleSubmit((data: FormData) => {
    const payload = {
      ...data,
      requiredSkills: skills,
      requiredCertifications: certs.length > 0 ? certs : undefined,
      endDate: data.endDate || undefined,
    }

    if (isEdit) {
      updateJob.mutate(
        { id: job.id, ...payload },
        { onSuccess: handleClose, onError: handleFieldErrors }
      )
    } else {
      createJob.mutate(
        payload,
        { onSuccess: handleClose, onError: handleFieldErrors }
      )
    }
  })

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEdit ? `Edit job — ${job.title}` : 'Post a new job'}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={handleClose} type="button">Cancel</Button>
          <Button
            type="button"
            loading={isPending}
            onClick={() => formRef.current?.requestSubmit()}
          >
            {isEdit ? 'Save changes' : 'Post Job'}
          </Button>
        </>
      }
    >
      <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
        {/* Title + Trade */}
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
          error={errors.description?.message}
          {...register('description')}
        />

        {/* Location + Rate */}
        <div className="grid grid-cols-2 gap-4">
          <Input label="Location" placeholder="London, UK" error={errors.location?.message} {...register('location')} />
          <Input label="Hourly rate (£)" type="number" step="0.01" placeholder="25.00" error={errors.hourlyRate?.message} {...register('hourlyRate')} />
        </div>

        {/* Dates + Workers */}
        <div className="grid grid-cols-3 gap-4">
          <Input label="Start date" type="date" error={errors.startDate?.message} {...register('startDate')} />
          <Input label="End date (optional)" type="date" error={errors.endDate?.message} {...register('endDate')} />
          <Input label="Workers needed" type="number" min={1} error={errors.workersNeeded?.message} {...register('workersNeeded')} />
        </div>

        {/* Required skills */}
        <div>
          <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-wide text-[var(--text2)]">
            Required skills <span className="text-[oklch(0.65_0.2_25)]">*</span>
          </label>
          <div className="flex gap-2">
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput) } }}
              placeholder="Type a skill and press Enter"
              className="flex-1 rounded-lg border border-[var(--border2)] bg-[var(--input-bg)] px-3 py-2 text-[13px] text-[var(--text)] focus:border-[oklch(0.74_0.14_185)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.74_0.14_185_/_0.15)]"
            />
            <Button type="button" variant="outline" size="sm" onClick={() => addSkill(skillInput)}>Add</Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {COMMON_SKILLS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addSkill(s)}
                className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--text2)] hover:border-[oklch(0.74_0.14_185)] hover:text-[oklch(0.74_0.14_185)] transition-colors"
              >
                + {s}
              </button>
            ))}
          </div>
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

        {/* Required certifications */}
        <div>
          <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-wide text-[var(--text2)]">
            Required certifications <span className="text-[11px] normal-case text-[var(--text3)]">(optional)</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_CERTS.map((cert) => (
              <button
                key={cert}
                type="button"
                onClick={() => toggleCert(cert)}
                className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                  certs.includes(cert)
                    ? 'border-[oklch(0.74_0.14_185)] bg-[oklch(0.74_0.14_185_/_0.12)] text-[oklch(0.74_0.14_185)]'
                    : 'border-[var(--border)] text-[var(--text2)] hover:border-[oklch(0.74_0.14_185)] hover:text-[oklch(0.74_0.14_185)]'
                }`}
              >
                {certs.includes(cert) ? '✓ ' : '+ '}{cert}
              </button>
            ))}
          </div>
        </div>
      </form>
    </Modal>
  )
}
