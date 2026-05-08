import { cn } from '@/utils/cn'

interface AvatarProps {
  name: string
  src?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = {
  xs: 'h-6 w-6 text-[9px]',
  sm: 'h-8 w-8 text-[10px]',
  md: 'h-9 w-9 text-[12px]',
  lg: 'h-11 w-11 text-[14px]',
  xl: 'h-14 w-14 text-[18px]',
}

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
}

export default function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  if (src) {
    return <img src={src} alt={name} className={cn('rounded-full object-cover border border-[var(--border)]', sizes[size], className)} />
  }
  return (
    <div className={cn(
      'flex items-center justify-center rounded-full border border-[rgba(255,255,255,0.1)]',
      'bg-[oklch(0.65_0.16_28_/_0.12)] text-[var(--accent)] font-semibold font-sans',
      sizes[size],
      className
    )}>
      {getInitials(name)}
    </div>
  )
}
