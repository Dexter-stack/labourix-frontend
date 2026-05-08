import Card from './Card'
import { cn } from '@/utils/cn'

interface StatCardProps {
  title: string
  value: string | number
  sub?: string
  trend?: 'up' | 'down'
  icon?: React.ReactNode
  color?: string
  className?: string
}

export default function StatCard({ title, value, sub, trend, icon, color = 'var(--accent)', className }: StatCardProps) {
  return (
    <Card className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-center justify-between">
        {icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `color-mix(in oklch, ${color} 18%, transparent)` }}>
            <span style={{ color }}>{icon}</span>
          </div>
        )}
      </div>
      <div>
        <div className="font-mono text-[28px] font-semibold leading-none tracking-tight text-[var(--text)]">
          {value}
        </div>
        <div className="mt-1 text-[12px] text-[var(--text3)]">{title}</div>
      </div>
      {sub && (
        <div className="flex items-center gap-1">
          {trend === 'up' && (
            <svg className="h-3 w-3 text-[oklch(0.72_0.16_145)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
            </svg>
          )}
          {trend === 'down' && (
            <svg className="h-3 w-3 text-[oklch(0.65_0.2_25)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
            </svg>
          )}
          <span className={cn('text-[11px]', trend === 'up' ? 'text-[oklch(0.72_0.16_145)]' : trend === 'down' ? 'text-[oklch(0.65_0.2_25)]' : 'text-[var(--text3)]')}>
            {sub}
          </span>
        </div>
      )}
    </Card>
  )
}
