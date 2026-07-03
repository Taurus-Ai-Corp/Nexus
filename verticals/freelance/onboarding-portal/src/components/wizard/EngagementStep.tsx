'use client'

import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useOnboardingStore } from '@/lib/store'
import { ENGAGEMENT_LABELS, BDM_OPTIONS } from '@/types'

export function EngagementStep() {
  const { formData, updateFormData } = useOnboardingStore()

  const engagementOptions = Object.entries(ENGAGEMENT_LABELS).map(([value, label]) => ({
    value,
    label,
  }))

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-display font-bold text-white mb-2">Engagement & Team</h2>
        <p className="text-dark-400 text-sm">Define the engagement type and assign your business development manager.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Select
          label="Engagement Type *"
          options={engagementOptions}
          value={formData.engagement_type}
          onChange={(e) =>
            updateFormData({ engagement_type: e.target.value as ClientFormData['engagement_type'] })
          }
        />
        <Input
          label="Monthly Budget (USD)"
          type="number"
          placeholder="5000"
          value={formData.monthly_budget || ''}
          onChange={(e) => updateFormData({ monthly_budget: Number(e.target.value) })}
        />
        <Select
          label="BDM Assignment"
          options={BDM_OPTIONS}
          value={formData.bdm_assigned}
          onChange={(e) => updateFormData({ bdm_assigned: e.target.value })}
        />
        <Input
          label="Kickoff Date"
          type="date"
          value={formData.kickoff_date}
          onChange={(e) => updateFormData({ kickoff_date: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-dark-200 mb-1.5">Notes</label>
        <textarea
          className="w-full rounded-lg border border-dark-600 bg-dark-800 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent px-4 py-2.5 text-sm resize-none"
          rows={3}
          placeholder="Any additional context or special requirements..."
          value={formData.notes}
          onChange={(e) => updateFormData({ notes: e.target.value })}
        />
      </div>
    </div>
  )
}
