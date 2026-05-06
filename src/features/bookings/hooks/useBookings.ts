import { useQuery, useMutation } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import {
  cancelBooking,
  cancelWorkerBooking,
  confirmBooking,
  createBooking,
  fetchBooking,
  fetchBookings,
  fetchWorkerBooking,
  fetchWorkerBookings,
  rateBooking,
} from '../api'
import { useNotify } from '@/hooks/useNotify'
import { getApiErrorMessage } from '@/utils/apiError'

export function useBooking(id: string) {
  return useQuery({
    queryKey: ['bookings', id],
    queryFn: () => fetchBooking(id),
    enabled: !!id,
  })
}

export function useBookings(status?: string) {
  return useQuery({
    queryKey: ['bookings', status],
    queryFn: () => fetchBookings({ status }),
  })
}

export function useWorkerBookings(status?: string) {
  return useQuery({
    queryKey: ['worker-bookings', status],
    queryFn: () => fetchWorkerBookings({ status }),
  })
}

export function useWorkerBooking(id: string) {
  return useQuery({
    queryKey: ['worker-bookings', id],
    queryFn: () => fetchWorkerBooking(id),
    enabled: !!id,
  })
}

export function useCancelWorkerBooking() {
  const notify = useNotify()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => cancelWorkerBooking(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['worker-bookings'] })
      notify.success('Booking cancelled')
    },
    onError: (error) => notify.error('Failed to cancel booking', getApiErrorMessage(error)),
  })
}

export function useCreateBooking() {
  const notify = useNotify()
  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      notify.success('Worker booked', 'The booking has been confirmed.')
    },
    onError: (error) => notify.error('Booking failed', getApiErrorMessage(error)),
  })
}

export function useConfirmBooking() {
  const notify = useNotify()
  return useMutation({
    mutationFn: (id: string) => confirmBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      notify.success('Booking confirmed')
    },
    onError: (error) => notify.error('Failed to confirm booking', getApiErrorMessage(error)),
  })
}

export function useCancelBooking() {
  const notify = useNotify()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => cancelBooking(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      notify.success('Booking cancelled')
    },
    onError: (error) => notify.error('Failed to cancel booking', getApiErrorMessage(error)),
  })
}

export function useRateBooking() {
  const notify = useNotify()
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string; rating: number; review?: string }) => rateBooking(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      notify.success('Rating submitted', 'Thank you for your feedback.')
    },
    onError: (error) => notify.error('Failed to submit rating', getApiErrorMessage(error)),
  })
}
