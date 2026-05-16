import { useQuery } from '@tanstack/react-query'
import { fetchTrades } from '../api'

export function useTrades() {
  return useQuery({
    queryKey: ['reference', 'trades'],
    queryFn: fetchTrades,
    staleTime: 60 * 60 * 1000, // 1 hour — trades rarely change
  })
}
