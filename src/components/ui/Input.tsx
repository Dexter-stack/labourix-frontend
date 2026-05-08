import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-[12px] font-medium text-[var(--text2)] uppercase tracking-wide">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'block w-full rounded-lg border px-3 py-2 text-[13px] font-sans transition-colors',
            'bg-[var(--input-bg)] text-[var(--text)]',
            'placeholder:text-[var(--placeholder)]',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            error
              ? 'border-[oklch(0.65_0.2_25_/_0.4)] focus:border-[oklch(0.65_0.2_25)] focus:ring-[oklch(0.65_0.2_25_/_0.25)]'
              : 'border-[var(--input-border)] focus:border-[oklch(0.65_0.16_28_/_0.5)] focus:ring-[oklch(0.65_0.16_28_/_0.15)]',
            className
          )}
          {...props}
        />
        {hint && !error && <p className="text-[11px] text-[var(--text3)]">{hint}</p>}
        {error && <p className="text-[11px] text-[oklch(0.65_0.2_25)]">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
