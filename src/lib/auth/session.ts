import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { getActiveLevel } from '@/lib/level'
import type { Level } from '@/lib/curriculum'
import type { Tables } from '@/lib/types/database'

export interface SessionContext {
  user: User
  profile: Tables<'profiles'> | null
  levels: Tables<'user_levels'>[]
  subscription: Tables<'subscriptions'> | null
  activeLevel: Level
}

/**
 * Loads the authenticated user plus their profile, enrolled levels and
 * subscription in one pass. Returns null if Supabase is unconfigured or there
 * is no signed-in user.
 */
export async function getSessionContext(): Promise<SessionContext | null> {
  const supabase = await createClient()
  if (!supabase) return null

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const [profileRes, levelsRes, subRes, activeLevel] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    supabase.from('user_levels').select('*').eq('user_id', user.id).order('level'),
    supabase.from('subscriptions').select('*').eq('user_id', user.id).maybeSingle(),
    getActiveLevel(),
  ])

  return {
    user,
    profile: profileRes.data ?? null,
    levels: levelsRes.data ?? [],
    subscription: subRes.data ?? null,
    activeLevel,
  }
}
