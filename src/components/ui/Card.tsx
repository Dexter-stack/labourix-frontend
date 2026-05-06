import { cn } from '@/utils/cn'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md'
}

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
}

export default function Card({ children, className, padding = 'md' }: CardProps) {
  return (
    <div className={cn(
      'rounded-xl border bg-[var(--surface)] border-[var(--border)]',
      paddings[padding],
      className
    )}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('mb-4 flex items-center justify-between', className)}>{children}</div>
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn('text-[13px] font-semibold text-[var(--text)]', className)}>{children}</h3>
}
