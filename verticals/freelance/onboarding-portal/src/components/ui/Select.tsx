import type { SelectHTMLAttributes, ReactNode } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: { value: string; label: string }[]
  error?: string
  icon?: ReactNode
}

export function Select({ label, options, error, icon, className = '', ...props }: SelectProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-dark-200">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-dark-400">
            {icon}
          </div>
        )}
        <select
          className={`w-full rounded-lg border bg-dark-800 text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent appearance-none ${
            icon ? 'pl-10' : 'pl-4'
          } pr-10 py-2.5 text-sm ${
            error ? 'border-red-500' : 'border-dark-600 hover:border-dark-500'
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-dark-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
