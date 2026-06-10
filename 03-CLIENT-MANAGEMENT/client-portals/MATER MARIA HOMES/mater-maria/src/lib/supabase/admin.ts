import { createClient } from '@supabase/supabase-js'

const url = process.env['SUPABASE_URL'] || process.env['NEXT_PUBLIC_SUPABASE_URL']
const key = process.env['SUPABASE_ANON_KEY'] || process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']

export function getSupabaseAdmin() {
  if (!url || !key) {
    throw new Error('Supabase environment variables are not configured')
  }
  return createClient(url, key, {
    auth: { persistSession: false },
  })
}
