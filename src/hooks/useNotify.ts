import { useNotificationStore } from '@/stores/notificationStore'

export function useNotify() {
  const add = useNotificationStore((s) => s.add)

  return {
    success: (title: string, message?: string) =>
      add({ type: 'success', title, message }),
    error: (title: string, message?: string) =>
      add({ type: 'error', title, message }),
    warning: (title: string, message?: string) =>
      add({ type: 'warning', title, message }),
    info: (title: string, message?: string) =>
      add({ type: 'info', title, message }),
  }
}
