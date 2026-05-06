import { useQuery, useMutation } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { createJob, deleteJob, fetchJob, fetchJobApplications, fetchJobs, publishJob, updateJob } from '../api'
import { useNotify } from '@/hooks/useNotify'
import { getApiErrorMessage } from '@/utils/apiError'
import type { Job, JobFilters } from '@/types'

export function useJobApplications(jobId: string) {
  return useQuery({
    queryKey: ['job-applications', jobId],
    queryFn: () => fetchJobApplications(jobId),
    enabled: !!jobId,
  })
}

export function useJobs(filters: JobFilters = {}) {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => fetchJobs(filters),
  })
}

export function useJob(id: string | undefined) {
  return useQuery({
    queryKey: ['jobs', id],
    queryFn: () => fetchJob(id!),
    enabled: !!id,
  })
}

export function useCreateJob() {
  const notify = useNotify()
  return useMutation({
    mutationFn: (payload: Partial<Job>) => createJob(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      notify.success('Job posted', 'Your job is now live and visible to workers.')
    },
    onError: (error) => notify.error('Failed to post job', getApiErrorMessage(error)),
  })
}

export function useUpdateJob() {
  const notify = useNotify()
  return useMutation({
    mutationFn: ({ id, ...payload }: Partial<Job> & { id: string }) => updateJob(id, payload),
    onSuccess: (job) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      queryClient.setQueryData(['jobs', job.id], job)
      notify.success('Job updated')
    },
    onError: (error) => notify.error('Failed to update job', getApiErrorMessage(error)),
  })
}

export function useDeleteJob() {
  const notify = useNotify()
  return useMutation({
    mutationFn: (id: string) => deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      notify.success('Job deleted')
    },
    onError: (error) => notify.error('Failed to delete job', getApiErrorMessage(error)),
  })
}

export function usePublishJob() {
  const notify = useNotify()
  return useMutation({
    mutationFn: (id: string) => publishJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      notify.success('Job published', 'Your job is now live and visible to workers.')
    },
    onError: (error) => notify.error('Failed to publish job', getApiErrorMessage(error)),
  })
}
