'use client'

import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useOnboardingStore } from '@/lib/store'
import { MARKET_LABELS } from '@/types'

export function ClientInfoStep() {
  const { formData, updateFormData } = useOnboardingStore()

  const marketOptions = Object.entries(MARKET_LABELS).map(([value, label]) => ({
    value,
    label,
  }))

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-display font-bold text-white mb-2">Client Information</h2>
        <p className="text-dark-400 text-sm">Enter the primary contact details for this client.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          label="Client Name *"
          placeholder="e.g. Rahul Menon"
          value={formData.client_name}
          onChange={(e) => updateFormData({ client_name: e.target.value })}
        />
        <Input
          label="Company Name"
          placeholder="e.g. Menon Properties"
          value={formData.company_name}
          onChange={(e) => updateFormData({ company_name: e.target.value })}
        />
        <Input
          label="Email"
          type="email"
          placeholder="client@example.com"
          value={formData.email}
          onChange={(e) => updateFormData({ email: e.target.value })}
        />
        <Input
          label="Phone"
          type="tel"
          placeholder="+971 50 123 4567"
          value={formData.phone}
          onChange={(e) => updateFormData({ phone: e.target.value })}
        />
        <Input
          label="Industry"
          placeholder="e.g. Real Estate, Healthcare"
          value={formData.industry}
          onChange={(e) => updateFormData({ industry: e.target.value })}
        />
        <Select
          label="Target Market"
          options={marketOptions}
          value={formData.market}
          onChange={(e) => updateFormData({ market: e.target.value as ClientFormData['market'] })}
        />
      </div>
    </div>
  )
}
