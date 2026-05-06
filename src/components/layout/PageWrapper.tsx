import { cn } from '@/utils/cn'

interface PageWrapperProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export default function PageWrapper({ title, subtitle, actions, children, className }: PageWrapperProps) {
  return (
    <div className={cn('p-4 sm:p-6 lg:p-8 fade-in', className)}>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div>
          <h1 className="text-[20px] font-bold tracking-tight text-[var(--text)] sm:text-[22px]">{title}</h1>
          {subtitle && (
            <p className="mt-0.5 font-mono text-[11px] text-[var(--text3)]">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  )
}
