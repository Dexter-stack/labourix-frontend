import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import PageWrapper from '@/components/layout/PageWrapper'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useUploadCertification } from '../hooks/useCertifications'

const schema = z.object({
  name: z.string().min(2, 'Certification name required'),
  issuingBody: z.string().optional(),
  certificateNumber: z.string().optional(),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function AddCertificationPage() {
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)
  const uploadCert = useUploadCertification()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: FormData) => {
    const form = new FormData()
    Object.entries(data).forEach(([k, v]) => { if (v) form.append(k, v) })
    if (fileRef.current?.files?.[0]) form.append('document', fileRef.current.files[0])
    uploadCert.mutate(form, { onSuccess: () => navigate('/worker/certifications') })
  }

  return (
    <PageWrapper
      title="Add Certification"
      subtitle="Upload a trade certificate to improve your job matches"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/worker/certifications')}>Cancel</Button>
          <Button loading={uploadCert.isPending} onClick={() => handleSubmit(onSubmit)()}>
            Upload
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-xl space-y-6">
        <Card>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--text3)]">Certificate details</p>
          <div className="space-y-4">
            <Input
              label="Certification name"
              placeholder="e.g. CSCS Card, ECS Card, Gas Safe"
              error={errors.name?.message}
              {...register('name')}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Issuing body"
                placeholder="e.g. CITB, JIB"
                error={errors.issuingBody?.message}
                {...register('issuingBody')}
              />
              <Input
                label="Certificate number"
                placeholder="e.g. ABC123"
                error={errors.certificateNumber?.message}
                {...register('certificateNumber')}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Issue date"
                type="date"
                error={errors.issueDate?.message}
                {...register('issueDate')}
              />
              <Input
                label="Expiry date"
                type="date"
                error={errors.expiryDate?.message}
                {...register('expiryDate')}
              />
            </div>
          </div>
        </Card>

        <Card>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--text3)]">Document</p>
          <label className="block text-[12px] font-medium uppercase tracking-wide text-[var(--text2)] mb-2">
            Upload file <span className="normal-case font-normal text-[var(--text3)]">(PDF, JPG, PNG)</span>
          </label>
          <div className="rounded-lg border-2 border-dashed border-[var(--border2)] px-6 py-8 text-center">
            <svg className="mx-auto mb-3 h-8 w-8 text-[var(--text3)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p className="mb-2 text-sm text-[var(--text2)]">Drag and drop or click to choose a file</p>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="text-sm text-[var(--text2)] file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--surface2)] file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-[var(--text2)] hover:file:bg-[var(--border)]"
            />
          </div>
        </Card>

        <div className="flex justify-end gap-2 pb-6">
          <Button variant="outline" type="button" onClick={() => navigate('/worker/certifications')}>Cancel</Button>
          <Button type="submit" loading={uploadCert.isPending}>Upload</Button>
        </div>
      </form>
    </PageWrapper>
  )
}
