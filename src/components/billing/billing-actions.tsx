'use client'

import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PLANS } from '@/lib/stripe/plans'

export function PlanCards({ canCheckout }: { canCheckout: boolean }) {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function upgrade(planId: string) {
    setError(null)
    setLoading(planId)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ planId }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else setError(data.error ?? 'Could not start checkout.')
    } catch {
      setError('Could not start checkout.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div>
      {error && <p className="text-sm text-rose-300 mb-4 text-center">{error}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              'glass-panel rounded-2xl p-6 border flex flex-col',
              plan.highlight ? 'border-primary/40' : 'border-white/10',
            )}
          >
            {plan.highlight && (
              <span className="self-start rounded-full bg-primary/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary mb-3">
                Best value
              </span>
            )}
            <h3 className="text-lg font-heading font-semibold text-white">{plan.name}</h3>
            <p className="mt-2">
              <span className="text-3xl font-heading font-bold text-white">{plan.priceLabel}</span>
              <span className="text-sm text-white/40"> {plan.cadence}</span>
            </p>
            <ul className="mt-4 space-y-2 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                  <Check size={15} className="text-emerald-400 mt-0.5 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => upgrade(plan.id)}
              disabled={!canCheckout || loading !== null}
              className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black hover:bg-neutral-200 transition-colors disabled:opacity-50"
            >
              {loading === plan.id ? <Loader2 size={16} className="animate-spin" /> : null}
              {canCheckout ? 'Choose plan' : 'Coming soon'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ManageBillingButton() {
  const [loading, setLoading] = useState(false)
  async function manage() {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } finally {
      setLoading(false)
    }
  }
  return (
    <button
      onClick={manage}
      disabled={loading}
      className="rounded-xl border border-white/15 px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-white/5 transition-colors disabled:opacity-50"
    >
      {loading ? 'Opening…' : 'Manage billing'}
    </button>
  )
}
