import { useQuery, useMutation } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { deleteCertification, fetchCertifications, uploadCertification } from '../api'
import { useNotify } from '@/hooks/useNotify'
import { getApiErrorMessage } from '@/utils/apiError'

export function useCertifications() {
  return useQuery({
    queryKey: ['certifications'],
    queryFn: fetchCertifications,
  })
}

export function useUploadCertification() {
  const notify = useNotify()
  return useMutation({
    mutationFn: (payload: FormData) => uploadCertification(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] })
      notify.success('Certification uploaded', 'It will be reviewed shortly.')
    },
    onError: (error) => notify.error('Upload failed', getApiErrorMessage(error)),
  })
}

export function useDeleteCertification() {
  const notify = useNotify()
  return useMutation({
    mutationFn: (id: string) => deleteCertification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] })
      notify.success('Certification removed')
    },
    onError: (error) => notify.error('Failed to remove certification', getApiErrorMessage(error)),
  })
}
