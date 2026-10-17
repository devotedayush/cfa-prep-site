import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getSupabaseConfig } from './config'
import type { Database } from '@/lib/types/database'

/**
 * Server-side Supabase client for Server Components, Route Handlers and
 * Server Actions. Next.js 15 `cookies()` is async, so this is too.
 * Returns `null` when Supabase isn't configured.
 */
export async function createClient() {
  const config = getSupabaseConfig()
  if (!config) return null

  const cookieStore = await cookies()

  return createServerClient<Database>(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          )
        } catch {
          // Called from a Server Component where cookies are read-only.
          // The middleware refreshes the session, so this is safe to ignore.
        }
      },
    },
  })
}

/** Convenience: current authenticated user (or null). */
export async function getCurrentUser() {
  const supabase = await createClient()
  if (!supabase) return null
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}
