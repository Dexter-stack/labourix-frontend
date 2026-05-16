import { useQuery } from '@tanstack/react-query'
import { fetchCertificationBodies } from '../api'

export function useCertificationBodies() {
  return useQuery({
    queryKey: ['reference', 'certification-bodies'],
    queryFn: fetchCertificationBodies,
    staleTime: 60 * 60 * 1000,
  })
}
