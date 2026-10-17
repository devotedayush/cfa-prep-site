import { cookies } from 'next/headers'
import { isLevel, type Level } from '@/lib/curriculum'

export const ACTIVE_LEVEL_COOKIE = 'cfa_active_level'

/** The level the user is currently viewing (cookie-backed, defaults to '1'). */
export async function getActiveLevel(): Promise<Level> {
  const store = await cookies()
  const value = store.get(ACTIVE_LEVEL_COOKIE)?.value
  return isLevel(value) ? value : '1'
}
