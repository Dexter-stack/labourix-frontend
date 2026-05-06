export interface ApiResponse<T> {
  data: T
  message?: string
  success?: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    currentPage: number
    lastPage: number
    perPage: number
    total: number
  }
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

export interface AuthTokens {
  accessToken: string
  tokenType: string
  expiresIn: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  passwordConfirmation: string
  role: 'employer' | 'worker'
  companyName?: string
  industry?: string
  tradeCategory?: string
  location?: string
}

export interface VerifyEmailData {
  email: string
  code: string
}

export interface ResendOtpData {
  email: string
}

export interface ForgotPasswordData {
  email: string
}

export interface VerifyResetCodeData {
  email: string
  code: string
}

export interface ResetPasswordData {
  email: string
  resetToken: string
  password: string
  passwordConfirmation: string
}

// Kept for RegisterPage form compatibility
export interface RegisterEmployerData {
  name: string
  email: string
  password: string
  passwordConfirmation: string
  companyName: string
  industry?: string
}

export interface RegisterWorkerData {
  name: string
  email: string
  password: string
  passwordConfirmation: string
  tradeCategory: string
  location: string
}
