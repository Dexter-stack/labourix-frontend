import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger' | 'amber'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const variants = {
  primary: 'bg-[var(--accent)] text-[#0a1a18] font-bold hover:opacity-90 border-0',
  outline: 'bg-[oklch(0.65_0.16_28_/_0.1)] border border-[oklch(0.65_0.16_28_/_0.25)] text-[var(--accent)] font-semibold hover:bg-[oklch(0.65_0.16_28_/_0.18)]',
  ghost:   'bg-transparent border border-[var(--border2)] text-[var(--text2)] hover:border-[var(--border2)] hover:text-[var(--text)]',
  danger:  'bg-[oklch(0.65_0.2_25_/_0.12)] border border-[oklch(0.65_0.2_25_/_0.25)] text-[oklch(0.65_0.2_25)] font-semibold hover:bg-[oklch(0.65_0.2_25_/_0.2)]',
  amber:   'bg-[oklch(0.78_0.15_72_/_0.12)] border border-[oklch(0.78_0.15_72_/_0.25)] text-[oklch(0.78_0.15_72)] font-semibold hover:bg-[oklch(0.78_0.15_72_/_0.2)]',
}

const sizes = {
  sm: 'px-3 py-1.5 text-[12px]',
  md: 'px-[14px] py-[7px] text-[13px]',
  lg: 'px-5 py-2.5 text-[14px]',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-sans transition-all',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--surface)]',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading && (
          <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
