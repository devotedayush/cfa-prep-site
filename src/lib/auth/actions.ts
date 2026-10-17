'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { ACTIVE_LEVEL_COOKIE } from '@/lib/level'
import { isLevel } from '@/lib/curriculum'

export type AuthResult = { error: string } | undefined

function readCreds(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')
  return { email, password }
}

export async function signIn(_prev: AuthResult, formData: FormData): Promise<AuthResult> {
  const supabase = await createClient()
  if (!supabase) return { error: 'Authentication is not configured.' }

  const { email, password } = readCreds(formData)
  if (!email || !password) return { error: 'Email and password are required.' }

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }

  redirect('/dashboard')
}

export async function signUp(_prev: AuthResult, formData: FormData): Promise<AuthResult> {
  const supabase = await createClient()
  if (!supabase) return { error: 'Authentication is not configured.' }

  const { email, password } = readCreds(formData)
  const username = String(formData.get('username') ?? '').trim()
  if (!email || !password) return { error: 'Email and password are required.' }
  if (password.length < 8) return { error: 'Password must be at least 8 characters.' }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  })
  if (error) return { error: error.message }

  // If email confirmation is off, a session exists immediately → onboarding.
  redirect('/onboarding')
}

export async function signOut(): Promise<void> {
  const supabase = await createClient()
  if (supabase) await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function setActiveLevel(formData: FormData): Promise<void> {
  const level = String(formData.get('level') ?? '')
  if (!isLevel(level)) return
  const store = await cookies()
  store.set(ACTIVE_LEVEL_COOKIE, level, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })
  revalidatePath('/', 'layout')
}
