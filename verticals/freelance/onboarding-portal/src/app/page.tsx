'use client'

import { useState } from 'react'
import { ClientInfoStep } from '@/components/wizard/ClientInfoStep'
import { PlatformSelectStep } from '@/components/wizard/PlatformSelectStep'
import { EngagementStep } from '@/components/wizard/EngagementStep'
import { WorkspaceStep } from '@/components/wizard/WorkspaceStep'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Button } from '@/components/ui/Button'
import { useOnboardingStore } from '@/lib/store'
import { trackEvent } from '@/lib/posthog'

const STEPS = [
  { id: 1, name: 'Client Info' },
  { id: 2, name: 'Platform' },
  { id: 3, name: 'Engagement' },
  { id: 4, name: 'Workspace' },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const { formData, resetForm } = useOnboardingStore()

  const nextStep = () => {
    trackEvent('wizard_step_completed', { step: currentStep, formData: sanitizeFormData(formData) })
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length))
  }

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

  const isLastStep = currentStep === STEPS.length

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            Client Onboarding
          </h1>
          <p className="text-dark-400 text-lg">
            Set up a new client workspace in minutes
          </p>
        </div>

        <ProgressBar
          currentStep={currentStep}
          totalSteps={STEPS.length}
          steps={STEPS.map((s) => s.name)}
        />

        <div className="mt-12 bg-dark-900/50 backdrop-blur-sm rounded-2xl border border-dark-700 p-8">
          {currentStep === 1 && <ClientInfoStep />}
          {currentStep === 2 && <PlatformSelectStep />}
          {currentStep === 3 && <EngagementStep />}
          {currentStep === 4 && <WorkspaceStep />}

          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Back
            </Button>
            <Button onClick={nextStep}>
              {isLastStep ? 'Complete Onboarding' : 'Continue'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Sanitize form data for analytics (remove sensitive fields)
function sanitizeFormData(data: Record<string, unknown>) {
  const sanitized = { ...data }
  delete sanitized.email
  delete sanitized.phone
  return sanitized
}