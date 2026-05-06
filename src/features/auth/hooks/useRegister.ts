import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  forgotPassword,
  registerEmployer,
  registerWorker,
  resendOtp,
  resetPassword,
  verifyEmail,
  verifyResetCode,
} from '../api'
import { useAuthStore } from '@/stores/authStore'
import { useNotify } from '@/hooks/useNotify'
import { getApiErrorMessage } from '@/utils/apiError'
import type {
  ForgotPasswordData,
  RegisterEmployerData,
  RegisterWorkerData,
  ResendOtpData,
  ResetPasswordData,
  VerifyEmailData,
  VerifyResetCodeData,
} from '@/types'

export function useRegisterEmployer() {
  const navigate = useNavigate()
  const notify = useNotify()
  return useMutation({
    mutationFn: (data: RegisterEmployerData) => registerEmployer(data),
    onSuccess: (_, variables) => {
      navigate('/verify-email', { state: { email: variables.email } })
    },
    onError: (error) => notify.error('Registration failed', getApiErrorMessage(error)),
  })
}

export function useRegisterWorker() {
  const navigate = useNavigate()
  const notify = useNotify()
  return useMutation({
    mutationFn: (data: RegisterWorkerData) => registerWorker(data),
    onSuccess: (_, variables) => {
      navigate('/verify-email', { state: { email: variables.email } })
    },
    onError: (error) => notify.error('Registration failed', getApiErrorMessage(error)),
  })
}

export function useVerifyEmail() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()
  const notify = useNotify()
  return useMutation({
    mutationFn: (data: VerifyEmailData) => verifyEmail(data),
    onSuccess: ({ user, token }) => {
      setAuth(user, token)
      const destination = user.role === 'worker' ? '/worker/profile' : '/dashboard'
      navigate(destination, { replace: true, state: { newAccount: true } })
    },
    onError: (error) => notify.error('Verification failed', getApiErrorMessage(error)),
  })
}

export function useResendOtp() {
  const notify = useNotify()
  return useMutation({
    mutationFn: (data: ResendOtpData) => resendOtp(data),
    onSuccess: () => notify.success('Code resent', 'Check your email for a new verification code.'),
    onError: (error) => notify.error('Failed to resend code', getApiErrorMessage(error)),
  })
}

export function useForgotPassword() {
  const notify = useNotify()
  return useMutation({
    mutationFn: (data: ForgotPasswordData) => forgotPassword(data),
    onError: (error) => notify.error('Failed', getApiErrorMessage(error)),
  })
}

export function useVerifyResetCode() {
  const notify = useNotify()
  return useMutation({
    mutationFn: (data: VerifyResetCodeData) => verifyResetCode(data),
    onError: (error) => notify.error('Invalid code', getApiErrorMessage(error)),
  })
}

export function useResetPassword() {
  const navigate = useNavigate()
  const notify = useNotify()
  return useMutation({
    mutationFn: (data: ResetPasswordData) => resetPassword(data),
    onSuccess: () => {
      notify.success('Password reset', 'You can now sign in with your new password.')
      navigate('/login', { replace: true })
    },
    onError: (error) => notify.error('Reset failed', getApiErrorMessage(error)),
  })
}
