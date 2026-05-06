import { useQuery, useMutation } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { fetchWorkerProfile, fetchAvailableJobs, fetchPublicJobs, fetchWorkerStats, fetchWorkerApplications, updateWorkerProfile, updateAvailability, applyToJob } from '../api'
import { useNotify } from '@/hooks/useNotify'
import { getApiErrorMessage } from '@/utils/apiError'
import type { JobFilters, WorkerProfile } from '@/types'

export function useWorkerProfile() {
  return useQuery({
    queryKey: ['worker-profile'],
    queryFn: fetchWorkerProfile,
  })
}

export function useUpdateAvailability() {
  const notify = useNotify()
  return useMutation({
    mutationFn: (isAvailable: boolean) => updateAvailability(isAvailable),
    onSuccess: (profile) => {
      queryClient.setQueryData(['worker-profile'], profile)
      notify.success('Availability updated')
    },
    onError: (error) => notify.error('Failed to update availability', getApiErrorMessage(error)),
  })
}

export function useUpdateWorkerProfile() {
  const notify = useNotify()
  return useMutation({
    mutationFn: (payload: Partial<WorkerProfile>) => updateWorkerProfile(payload),
    onSuccess: (profile) => {
      queryClient.setQueryData(['worker-profile'], profile)
      notify.success('Profile updated')
    },
    onError: (error) => notify.error('Failed to update profile', getApiErrorMessage(error)),
  })
}

export function usePublicJobs(filters: JobFilters = {}) {
  return useQuery({
    queryKey: ['public-jobs', filters],
    queryFn: () => fetchPublicJobs(filters),
  })
}

export function useAvailableJobs(filters: JobFilters = {}) {
  return useQuery({
    queryKey: ['worker-jobs', filters],
    queryFn: () => fetchAvailableJobs(filters),
  })
}

export function useApplyToJob() {
  const notify = useNotify()
  return useMutation({
    mutationFn: ({ jobId, coverNote }: { jobId: string; coverNote?: string }) => applyToJob(jobId, coverNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['public-jobs'] })
      queryClient.invalidateQueries({ queryKey: ['worker-applications'] })
      notify.success('Application sent', 'The employer will be notified.')
    },
    onError: (error) => notify.error('Application failed', getApiErrorMessage(error)),
  })
}

export function useWorkerApplications(params: { page?: number } = {}) {
  return useQuery({
    queryKey: ['worker-applications', params],
    queryFn: () => fetchWorkerApplications(params),
  })
}

export function useWorkerStats() {
  return useQuery({
    queryKey: ['worker-stats'],
    queryFn: fetchWorkerStats,
  })
}
