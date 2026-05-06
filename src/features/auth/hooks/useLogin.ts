import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { login } from '../api'
import { useAuthStore } from '@/stores/authStore'
import { useNotify } from '@/hooks/useNotify'
import { parseApiError } from '@/utils/apiError'
import type { LoginCredentials } from '@/types'

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()
  const notify = useNotify()

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: ({ user, token }) => {
      setAuth(user, token)
      const home =
        user.role === 'worker'
          ? '/worker/dashboard'
          : user.role === 'admin' || user.role === 'super_admin'
            ? '/admin/users'
            : '/dashboard'
      navigate(home, { replace: true })
    },
    onError: (error, variables) => {
      const { message, errors } = parseApiError(error)
      const isUnverified =
        message.toLowerCase().includes('verif') ||
        errors?.email?.some((e) => e.toLowerCase().includes('verif'))
      if (isUnverified) {
        navigate('/verify-email', { state: { email: variables.email } })
        return
      }
      notify.error('Login failed', message)
    },
  })
}
