import { cn } from '@/utils/cn'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'teal' | 'green' | 'purple' | 'amber' | 'danger' | 'gray' | 'outline'
  className?: string
}

const variants = {
  teal:    'bg-[oklch(0.74_0.14_185_/_0.15)] text-[oklch(0.74_0.14_185)] border-[oklch(0.74_0.14_185_/_0.2)]',
  green:   'bg-[oklch(0.72_0.16_145_/_0.15)] text-[oklch(0.72_0.16_145)] border-[oklch(0.72_0.16_145_/_0.2)]',
  purple:  'bg-[oklch(0.72_0.15_280_/_0.15)] text-[oklch(0.72_0.15_280)] border-[oklch(0.72_0.15_280_/_0.2)]',
  amber:   'bg-[oklch(0.78_0.15_72_/_0.15)]  text-[oklch(0.78_0.15_72)]  border-[oklch(0.78_0.15_72_/_0.2)]',
  danger:  'bg-[oklch(0.65_0.2_25_/_0.15)]   text-[oklch(0.65_0.2_25)]   border-[oklch(0.65_0.2_25_/_0.2)]',
  gray:    'bg-[rgba(255,255,255,0.06)] text-[var(--text2)] border-transparent',
  outline: 'bg-transparent text-[var(--text3)] border-[var(--border2)]',
}

export default function Badge({ children, variant = 'gray', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center rounded border px-[7px] py-[2px]',
      'font-mono text-[10px] font-medium tracking-wide whitespace-nowrap',
      variants[variant],
      className
    )}>
      {children}
    </span>
  )
}
