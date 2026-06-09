'use client'

import { cn } from '@/lib/utils'
import { useOnboardingStore } from '@/lib/store'
import { PLATFORM_LABELS } from '@/types'

const platforms = [
  {
    key: 'neovibe',
    label: 'NeoVibe',
    subtitle: 'Creative Design Studio',
    color: 'from-brand-600 to-brand-800',
    icon: '🎨',
  },
  {
    key: 'q-grid',
    label: 'Q-Grid',
    subtitle: 'PQC Compliance & Security',
    color: 'from-emerald-600 to-emerald-800',
    icon: '🔐',
  },
  {
    key: 'bizflow',
    label: 'BizFlow',
    subtitle: 'Agentic Intelligence Automation',
    color: 'from-blue-600 to-blue-800',
    icon: '⚡',
  },
  {
    key: 'mater-maria',
    label: 'Mater Maria',
    subtitle: 'Faith-Based Brand',
    color: 'from-amber-600 to-amber-800',
    icon: '✝️',
  },
]

export function PlatformSelectStep() {
  const { formData, updateFormData } = useOnboardingStore()

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-display font-bold text-white mb-2">Platform Selection</h2>
        <p className="text-dark-400 text-sm">Choose which platform this client will be onboarded to.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {platforms.map((p) => {
          const isSelected = formData.platform === p.key
          return (
            <button
              key={p.key}
              type="button"
              className={cn(
                'relative p-5 rounded-xl border-2 text-left transition-all duration-200 group',
                isSelected
                  ? `border-brand-500 bg-gradient-to-br ${p.color} shadow-xl`
                  : 'border-dark-600 bg-dark-800 hover:border-dark-500 hover:bg-dark-750'
              )}
              onClick={() => updateFormData({ platform: p.key as ClientFormData['platform'] })}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{p.icon}</span>
                <div>
                  <h3 className={cn('font-semibold', isSelected ? 'text-white' : 'text-dark-100')}>
                    {p.label}
                  </h3>
                  <p className={cn('text-sm mt-0.5', isSelected ? 'text-white/70' : 'text-dark-400')}>
                    {p.subtitle}
                  </p>
                </div>
              </div>
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
