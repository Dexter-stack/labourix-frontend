import type { AxiosError } from 'axios'

interface ApiErrorBody {
  message?: string
  errors?: Record<string, string[]>
}

export interface ParsedApiError {
  message: string
  errors?: Record<string, string[]>
}

export function parseApiError(error: unknown): ParsedApiError {
  // Plain JS Error (e.g. thrown inside a mutationFn)
  if (error instanceof Error && !('response' in error)) {
    return { message: error.message }
  }

  const axiosError = error as AxiosError<ApiErrorBody>
  const data = axiosError?.response?.data

  if (data?.message) {
    return { message: data.message, errors: data.errors }
  }

  // Network / connection refused — no response at all
  if (!axiosError?.response) {
    return { message: 'Cannot reach the server. Make sure the backend is running.' }
  }

  // Unexpected server error with no message body
  const status = axiosError.response.status
  if (status >= 500) return { message: 'Server error. Please try again later.' }
  if (status === 404) return { message: 'Resource not found.' }
  if (status === 403) return { message: 'You do not have permission to do that.' }

  return { message: 'Something went wrong. Please try again.' }
}

export function getApiErrorMessage(error: unknown): string {
  return parseApiError(error).message
}
