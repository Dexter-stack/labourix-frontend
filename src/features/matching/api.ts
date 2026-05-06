import api from '@/lib/axios'
import type { ApiResponse, WorkerMatch } from '@/types'

export async function fetchJobMatches(jobId: string): Promise<WorkerMatch[]> {
  const { data } = await api.get<ApiResponse<WorkerMatch[]>>(`/employer/jobs/${jobId}/matched-workers`)
  return data.data
}
