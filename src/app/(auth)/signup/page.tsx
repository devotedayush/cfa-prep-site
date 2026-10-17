'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { AlertCircle, UserPlus } from 'lucide-react'
import { signUp } from '@/lib/auth/actions'

const inputClass =
  'w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition'

export default function SignupPage() {
  const [state, action, pending] = useActionState(signUp, undefined)

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold mb-1">Create your account</h1>
      <p className="text-sm text-muted-foreground mb-6">Start your 7-day free trial — no card required.</p>

      {state?.error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
          <AlertCircle size={16} /> {state.error}
        </div>
      )}

      <form action={action} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-xs font-medium text-white/60 mb-1.5">Display name</label>
          <input id="username" name="username" type="text" autoComplete="nickname" className={inputClass} placeholder="Shreyaa" />
        </div>
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-white/60 mb-1.5">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required className={inputClass} placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="password" className="block text-xs font-medium text-white/60 mb-1.5">Password</label>
          <input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} className={inputClass} placeholder="At least 8 characters" />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <UserPlus size={18} /> {pending ? 'Creating…' : 'Create account'}
        </button>
      </form>

      <p className="text-sm text-center text-white/50 mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
      </p>
    </div>
  )
}
