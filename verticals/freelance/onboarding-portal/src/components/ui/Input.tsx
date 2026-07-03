import type { InputHTMLAttributes, ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  icon?: ReactNode
}

export function Input({ label, error, icon, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-dark-200">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-dark-400">
            {icon}
          </div>
        )}
        <input
          className={`w-full rounded-lg border bg-dark-800 text-white placeholder-dark-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
            icon ? 'pl-10' : 'pl-4'
          } pr-4 py-2.5 text-sm ${
            error ? 'border-red-500' : 'border-dark-600 hover:border-dark-500'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
