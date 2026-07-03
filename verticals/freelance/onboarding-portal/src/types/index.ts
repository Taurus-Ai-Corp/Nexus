export interface PlatformConfig {
  id: string
  platform: 'neovibe' | 'q-grid' | 'bizflow' | 'mater-maria'
  brand_name: string
  domain: string | null
  default_bdm: string | null
  tracker_sheet_id: string | null
  root_folder_id: string | null
  onboarding_steps: OnboardingStepDef[]
  is_active: boolean
}

export interface OnboardingStepDef {
  key: string
  name: string
  order: number
}

export interface OnboardingSession {
  id: string
  client_id: string | null
  platform: string
  engagement_type: 'project' | 'retainer' | 'hybrid'
  phase: 'prospect' | 'onboarding' | 'active' | 'upsell'
  bdm_assigned: string | null
  industry: string | null
  kickoff_date: string | null
  status: 'draft' | 'in_progress' | 'completed' | 'cancelled'
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface OnboardingStep {
  id: string
  session_id: string
  step_key: string
  step_name: string
  status: 'pending' | 'in_progress' | 'completed' | 'skipped' | 'blocked'
  order_index: number
  started_at: string | null
  completed_at: string | null
  blocked_reason: string | null
  metadata: Record<string, unknown>
}

export interface OnboardingDocument {
  id: string
  session_id: string
  doc_type: 'contract' | 'invoice' | 'nda' | 'proposal' | 'brief' | 'other'
  file_name: string
  drive_file_id: string | null
  drive_folder_id: string | null
  file_url: string | null
  status: 'pending' | 'generated' | 'sent' | 'signed' | 'rejected'
  generated_at: string | null
  sent_at: string | null
  signed_at: string | null
  metadata: Record<string, unknown>
}

export interface ClientFormData {
  client_name: string
  email: string
  phone: string
  company_name: string
  industry: string
  market: 'dubai' | 'india' | 'mena' | 'canada' | 'global'
  platform: 'neovibe' | 'q-grid' | 'bizflow' | 'mater-maria'
  engagement_type: 'project' | 'retainer' | 'hybrid'
  monthly_budget: number
  bdm_assigned: string
  kickoff_date: string
  notes: string
}

export const PLATFORM_LABELS: Record<string, string> = {
  neovibe: 'NeoVibe by Taurus AI',
  'q-grid': 'Q-Grid',
  bizflow: 'BizFlow',
  'mater-maria': 'Mater Maria',
}

export const ENGAGEMENT_LABELS: Record<string, string> = {
  project: 'Project-based',
  retainer: 'Monthly Retainer',
  hybrid: 'Hybrid',
}

export const MARKET_LABELS: Record<string, string> = {
  dubai: 'Dubai / UAE',
  india: 'India (Kerala focus)',
  mena: 'MENA Region',
  canada: 'Canada (NRI)',
  global: 'Global',
}

export const BDM_OPTIONS = [
  { value: 'Praveen Varkey', label: 'Praveen Varkey (NeoVibe Kerala)' },
  { value: 'E.Fdz', label: 'E.Fdz (CEO)' },
  { value: 'Unassigned', label: 'Unassigned' },
]

export const STEP_ICONS: Record<string, string> = {
  client_info: '👤',
  platform_select: '🎯',
  engagement: '📋',
  team_assign: '👥',
  workspace: '📁',
  documents: '📄',
  crm_sync: '🔄',
  kickoff: '🚀',
}
