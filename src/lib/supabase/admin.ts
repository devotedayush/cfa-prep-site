import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database'

/**
 * Service-role Supabase client — bypasses RLS. Server-only, used by trusted
 * server code such as the Stripe webhook. Returns null if the service-role
 * key is not configured.
 */
export function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
