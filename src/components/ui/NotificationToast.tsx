import { useNotificationStore } from '@/stores/notificationStore'

const config = {
  success: { color: 'oklch(0.72 0.16 145)', label: '✓' },
  error:   { color: 'oklch(0.65 0.2 25)',   label: '✕' },
  warning: { color: 'oklch(0.78 0.15 72)',   label: '!' },
  info:    { color: 'var(--accent)',  label: 'i' },
}

export default function NotificationToast() {
  const { notifications, remove } = useNotificationStore()
  if (!notifications.length) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" style={{ maxWidth: 360 }}>
      {notifications.map((n) => {
        const { color, label } = config[n.type]
        return (
          <div
            key={n.id}
            className="flex items-start gap-3 rounded-xl border border-[var(--border2)] bg-[var(--surface)] p-4 shadow-[0_8px_40px_rgba(0,0,0,0.5)] fade-in"
            style={{ borderLeftWidth: 3, borderLeftColor: color }}
          >
            <div
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-bold"
              style={{ background: `color-mix(in oklch, ${color} 18%, transparent)`, color }}
            >
              {label}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-[var(--text)]">{n.title}</p>
              {n.message && <p className="mt-0.5 text-[12px] text-[var(--text2)]">{n.message}</p>}
            </div>
            <button
              onClick={() => remove(n.id)}
              className="shrink-0 rounded p-0.5 text-[var(--text3)] hover:text-[var(--text2)] transition-colors"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        )
      })}
    </div>
  )
}
