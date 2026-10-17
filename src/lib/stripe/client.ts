import Stripe from 'stripe'

export function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY)
}

let cached: Stripe | null = null

/** Server-side Stripe instance, or null when STRIPE_SECRET_KEY is unset. */
export function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) return null
  if (!cached) cached = new Stripe(process.env.STRIPE_SECRET_KEY)
  return cached
}
