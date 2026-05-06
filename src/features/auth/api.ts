import api from '@/lib/axios'
import type {
  ForgotPasswordData,
  LoginCredentials,
  RegisterData,
  RegisterEmployerData,
  RegisterWorkerData,
  ResendOtpData,
  ResetPasswordData,
  User,
  VerifyEmailData,
  VerifyResetCodeData,
} from '@/types'

/**
 * Pulls { user, token } from whatever shape the backend returns.
 * Handles:
 *   { data: { user, token } }                        ← flat Sanctum style
 *   { data: { user, access_token } }                 ← raw snake (before transform)
 *   { data: { user, auth: { access_token } } }       ← nested style
 *   { data: { user, accessToken } }                  ← already camelCased
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractAuth(responseData: any): { user: User; token: string } {
  const d = responseData?.data ?? responseData
  const user: User = d?.user

  const token: string =
    d?.token ??
    d?.accessToken ??
    d?.access_token ??
    d?.auth?.accessToken ??
    d?.auth?.access_token ??
    ''

  if (!user) throw new Error('Invalid response: missing user')
  if (!token) throw new Error('Invalid response: missing token')

  return { user, token }
}

export async function login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
  const res = await api.post('/auth/login', credentials)
  return extractAuth(res.data)
}

export async function register(payload: RegisterData): Promise<{ message: string }> {
  const res = await api.post('/auth/register', payload)
  return res.data
}

export async function registerEmployer(payload: RegisterEmployerData): Promise<{ message: string }> {
  return register({ ...payload, role: 'employer' })
}

export async function registerWorker(payload: RegisterWorkerData): Promise<{ message: string }> {
  return register({ ...payload, role: 'worker' })
}

export async function verifyEmail(payload: VerifyEmailData): Promise<{ user: User; token: string }> {
  const res = await api.post('/auth/verify-email', payload)
  return extractAuth(res.data)
}

export async function resendOtp(payload: ResendOtpData): Promise<{ message: string }> {
  const res = await api.post('/auth/resend-otp', payload)
  return res.data
}

export async function forgotPassword(payload: ForgotPasswordData): Promise<{ message: string }> {
  const res = await api.post('/auth/forgot-password', payload)
  return res.data
}

export async function verifyResetCode(payload: VerifyResetCodeData): Promise<{ resetToken: string }> {
  const res = await api.post('/auth/verify-reset-otp', payload)
  const d = res.data?.data ?? res.data
  const token = d?.resetToken ?? d?.reset_token
  if (!token) throw new Error('Invalid response: missing reset token')
  return { resetToken: token }
}

export async function resetPassword(payload: ResetPasswordData): Promise<{ message: string }> {
  const res = await api.post('/auth/reset-password', payload)
  return res.data
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout')
}

export async function getMe(): Promise<User> {
  const res = await api.get('/auth/me')
  const d = res.data?.data ?? res.data
  return d
}
