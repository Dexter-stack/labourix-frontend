import { format, formatDistanceToNow, parseISO } from 'date-fns'

export function formatDate(date: string | null | undefined, pattern = 'dd MMM yyyy'): string {
  if (!date) return '—'
  return format(parseISO(date), pattern)
}

export function formatRelativeTime(date: string | null | undefined): string {
  if (!date) return '—'
  return formatDistanceToNow(parseISO(date), { addSuffix: true })
}

export function formatCurrency(amount: number, currency = 'GBP'): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatHourlyRate(rate: number): string {
  return `${formatCurrency(rate)}/hr`
}
