'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useOnboardingStore } from '@/lib/store'
import { triggerWorkspaceProvisioning, initializeOnboardingSteps } from '@/lib/api'

export function WorkspaceStep() {
  const { session, steps, setSteps, setSubmitting, isSubmitting } = useOnboardingStore()
  const [status, setStatus] = useState<'idle' | 'provisioning' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const workspaceStep = steps.find((s) => s.step_key === 'workspace')

  const handleProvision = async () => {
    if (!session) return
    setStatus('provisioning')
    setSubmitting(true)

    try {
      await triggerWorkspaceProvisioning(session.id)

      const updatedSteps = steps.map((s) =>
        s.step_key === 'workspace'
          ? { ...s, status: 'completed' as const, completed_at: new Date().toISOString() }
          : s
      )
      setSteps(updatedSteps)
      setStatus('success')
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Provisioning failed')
      setStatus('error')
    } finally {
      setSubmitting(false)
    }
  }

  if (workspaceStep?.status === 'completed') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-2xl font-display font-bold text-white mb-2">Workspace Provisioned</h2>
          <p className="text-dark-400 text-sm">Client workspace has been created successfully.</p>
        </div>
        <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-emerald-300 font-medium">All workspace components created</p>
              <p className="text-emerald-400/60 text-sm">Drive folders, Sheets tracker, and client portal are ready</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-display font-bold text-white mb-2">Workspace Provisioning</h2>
        <p className="text-dark-400 text-sm">Create the client workspace in Google Drive with all required folders and trackers.</p>
      </div>

      <div className="space-y-3">
        {[
          { icon: '📁', label: 'Google Drive folders (5 subfolders)', desc: 'Contracts, Docs, Assets, Reports, Proposals' },
          { icon: '📊', label: 'Client Tracker Sheet', desc: 'Platform-specific tracking spreadsheet' },
          { icon: '👤', label: 'BDM Assignment', desc: `Assigned to: ${useOnboardingStore.getState().formData.bdm_assigned}` },
          { icon: '🔗', label: 'Client Portal Access', desc: 'Provisioned with credentials' },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-dark-800 border border-dark-700">
            <span className="text-xl">{item.icon}</span>
            <div>
              <p className="text-white text-sm font-medium">{item.label}</p>
              <p className="text-dark-400 text-xs">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {status === 'error' && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-red-400 text-sm">{errorMsg}</p>
        </div>
      )}

      <Button
        variant="primary"
        size="lg"
        loading={isSubmitting || status === 'provisioning'}
        onClick={handleProvision}
        className="w-full"
      >
        {status === 'provisioning' ? 'Provisioning Workspace...' : 'Provision Workspace'}
      </Button>
    </div>
  )
}
