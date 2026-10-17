/**
 * Resolves Supabase connection config from the environment.
 * Returns `null` when not configured so the app can run in a degraded /
 * preview mode (e.g. before credentials are set) instead of crashing.
 */
export type SupabaseConfig = {
  url: string
  anonKey: string
}

export function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY

  if (!url || !anonKey) return null
  return { url, anonKey }
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseConfig() !== null
}
