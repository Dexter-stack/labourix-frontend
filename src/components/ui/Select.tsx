import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-[12px] font-medium text-[var(--text2)] uppercase tracking-wide">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'block w-full rounded-lg border px-3 py-2 text-[13px] font-sans transition-colors appearance-none',
            'bg-[var(--input-bg)] text-[var(--text)]',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            error
              ? 'border-[oklch(0.65_0.2_25_/_0.4)] focus:ring-[oklch(0.65_0.2_25_/_0.25)]'
              : 'border-[var(--input-border)] focus:border-[oklch(0.65_0.16_28_/_0.5)] focus:ring-[oklch(0.65_0.16_28_/_0.15)]',
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {error && <p className="text-[11px] text-[oklch(0.65_0.2_25)]">{error}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'
export default Select
