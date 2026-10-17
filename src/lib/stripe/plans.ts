export interface Plan {
  id: string
  name: string
  priceLabel: string
  cadence: string
  interval: 'month' | 'year'
  priceId: string | undefined
  highlight?: boolean
  features: string[]
}

// Display prices are illustrative; the source of truth is the Stripe Price.
// Wire the real Price IDs via env (NEXT_PUBLIC_STRIPE_PRICE_MONTHLY / _ANNUAL).
export const PLANS: Plan[] = [
  {
    id: 'all_access_monthly',
    name: 'All Access',
    priceLabel: '$29',
    cadence: 'per month',
    interval: 'month',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY,
    features: [
      'All three CFA levels',
      'Unlimited AI quizzes & flashcards',
      'Adaptive revision & readiness',
      'Mocks, calculator drills & revision library',
    ],
  },
  {
    id: 'all_access_annual',
    name: 'All Access — Annual',
    priceLabel: '$249',
    cadence: 'per year',
    interval: 'year',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ANNUAL,
    highlight: true,
    features: ['Everything in monthly', 'Two months free', 'Lock in through exam day'],
  },
]

export const ALL_LEVELS = ['1', '2', '3']

export function planByPriceId(priceId: string | null | undefined): Plan | undefined {
  if (!priceId) return undefined
  return PLANS.find((p) => p.priceId === priceId)
}
