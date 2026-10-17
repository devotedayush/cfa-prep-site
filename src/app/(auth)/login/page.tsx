'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { AlertCircle, LogIn } from 'lucide-react'
import { signIn } from '@/lib/auth/actions'

const inputClass =
  'w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition'

export default function LoginPage() {
  const [state, action, pending] = useActionState(signIn, undefined)

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold mb-1">Welcome back</h1>
      <p className="text-sm text-muted-foreground mb-6">Sign in to continue your prep.</p>

      {state?.error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
          <AlertCircle size={16} /> {state.error}
        </div>
      )}

      <form action={action} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-white/60 mb-1.5">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required className={inputClass} placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="password" className="block text-xs font-medium text-white/60 mb-1.5">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required className={inputClass} placeholder="••••••••" />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <LogIn size={18} /> {pending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="text-sm text-center text-white/50 mt-6">
        New here?{' '}
        <Link href="/signup" className="text-primary hover:underline font-medium">Create an account</Link>
      </p>
    </div>
  )
}
