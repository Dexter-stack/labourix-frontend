import Button from './Button'

interface EmptyStateProps {
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
  icon?: React.ReactNode
}

export default function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="mb-4 text-[var(--text3)]">{icon}</div>}
      {!icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface2)] text-[var(--text3)]">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
        </div>
      )}
      <p className="text-[14px] font-semibold text-[var(--text)]">{title}</p>
      {description && <p className="mt-1 max-w-xs text-[12px] text-[var(--text3)]">{description}</p>}
      {action && (
        <div className="mt-4">
          <Button size="sm" onClick={action.onClick}>{action.label}</Button>
        </div>
      )}
    </div>
  )
}
