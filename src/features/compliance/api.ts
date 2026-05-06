import api from '@/lib/axios'
import type { ApiResponse, Certification } from '@/types'

// Normalizes API certification to the frontend Certification interface
// Handles field renames: issuedAt→issueDate, expiresAt→expiryDate, isVerified/isExpired→status
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeCertification(raw: any): Certification {
  let status: Certification['status'] = 'pending'
  if (raw.status) {
    status = raw.status
  } else if (raw.isExpired) {
    status = 'expired'
  } else if (raw.isVerified) {
    status = 'verified'
  }
  return {
    id: raw.id,
    workerId: raw.workerId,
    name: raw.name,
    issuingBody: raw.issuingBody,
    certificateNumber: raw.certificateNumber,
    issueDate: raw.issueDate ?? raw.issuedAt,
    expiryDate: raw.expiryDate ?? raw.expiresAt,
    documentUrl: raw.documentUrl,
    status,
    createdAt: raw.createdAt,
  }
}

export async function fetchCertifications(): Promise<Certification[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await api.get<ApiResponse<any[]>>('/worker/certifications')
  return data.data.map(normalizeCertification)
}

export async function uploadCertification(payload: FormData): Promise<Certification> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await api.post<ApiResponse<any>>('/worker/certifications', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return normalizeCertification(data.data)
}

export async function deleteCertification(id: string): Promise<void> {
  await api.delete(`/worker/certifications/${id}`)
}
