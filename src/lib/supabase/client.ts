'use client'

import { createBrowserClient } from '@supabase/ssr'
import { getSupabaseConfig } from './config'
import type { Database } from '@/lib/types/database'

/**
 * Browser-side Supabase client (for Client Components).
 * Throws if Supabase isn't configured — call only from authenticated UI
 * once env vars are set.
 */
export function createClient() {
  const config = getSupabaseConfig()
  if (!config) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    )
  }
  return createBrowserClient<Database>(config.url, config.anonKey)
}
