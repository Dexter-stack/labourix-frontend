import { useEffect } from 'react'
import echo from '@/lib/echo'
import { queryClient } from '@/lib/queryClient'
import { useAuthStore } from '@/stores/authStore'

export function useEcho() {
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    if (!user) return

    if (user.role === 'employer') {
      const channel = echo.private(`employer.${user.id}`)
      channel.listen('.job.matched', (data: { jobId: string }) => {
        queryClient.invalidateQueries({ queryKey: ['matched-workers', data.jobId] })
      })
      channel.listen('.booking.updated', () => {
        queryClient.invalidateQueries({ queryKey: ['bookings'] })
      })
      channel.listen('.demand.alert', () => {
        queryClient.invalidateQueries({ queryKey: ['demand-forecast'] })
      })
      return () => echo.leaveChannel(`private-employer.${user.id}`)
    }

    if (user.role === 'worker') {
      const channel = echo.private(`worker.${user.id}`)
      channel.listen('.job.offer', () => {
        queryClient.invalidateQueries({ queryKey: ['worker-jobs'] })
      })
      channel.listen('.booking.confirmed', () => {
        queryClient.invalidateQueries({ queryKey: ['worker-bookings'] })
      })
      channel.listen('.certification.expiring', () => {
        queryClient.invalidateQueries({ queryKey: ['certifications'] })
      })
      return () => echo.leaveChannel(`private-worker.${user.id}`)
    }
  }, [user])
}
