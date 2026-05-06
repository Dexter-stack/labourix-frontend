import { useQuery } from '@tanstack/react-query'
import { fetchJobMatches } from '../api'

export function useJobMatches(jobId: string) {
  return useQuery({
    queryKey: ['matched-workers', jobId],
    queryFn: () => fetchJobMatches(jobId),
    enabled: !!jobId,
  })
}
