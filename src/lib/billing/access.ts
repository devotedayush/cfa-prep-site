import { stripeConfigured } from '@/lib/stripe/client'
import type { Tables } from '@/lib/types/database'

export interface Access {
  hasAccess: boolean
  isPro: boolean
  trialing: boolean
  trialDaysLeft: number | null
  status: string
  billingEnabled: boolean
}

/**
 * Entitlement check. When Stripe is NOT configured, billing is disabled and
 * everyone has full access (so the app stays usable before keys are added).
 * When configured: access requires an active subscription or an unexpired trial.
 */
export function getAccess(sub: Tables<'subscriptions'> | null): Access {
  if (!stripeConfigured()) {
    return { hasAccess: true, isPro: false, trialing: false, trialDaysLeft: null, status: 'billing_disabled', billingEnabled: false }
  }
  if (!sub) {
    return { hasAccess: false, isPro: false, trialing: false, trialDaysLeft: null, status: 'none', billingEnabled: true }
  }

  const now = Date.now()
  const trialEnds = sub.trial_ends_at ? new Date(sub.trial_ends_at).getTime() : 0
  const trialing = sub.status === 'trialing' && trialEnds > now
  const active = sub.status === 'active'
  const trialDaysLeft = trialing ? Math.max(0, Math.ceil((trialEnds - now) / 86_400_000)) : null

  return {
    hasAccess: active || trialing,
    isPro: active,
    trialing,
    trialDaysLeft,
    status: sub.status,
    billingEnabled: true,
  }
}
