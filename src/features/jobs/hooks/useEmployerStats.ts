import { useQuery } from '@tanstack/react-query'
import { fetchEmployerStats, fetchWorkforceOptimisation } from '../api'

export function useEmployerStats() {
  return useQuery({
    queryKey: ['employer-stats'],
    queryFn: fetchEmployerStats,
  })
}

export function useWorkforceOptimisation() {
  return useQuery({
    queryKey: ['workforce-optimisation'],
    queryFn: fetchWorkforceOptimisation,
  })
}
