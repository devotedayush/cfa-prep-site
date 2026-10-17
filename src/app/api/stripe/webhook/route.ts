import type Stripe from 'stripe'
import { getStripe } from '@/lib/stripe/client'
import { getAdminClient } from '@/lib/supabase/admin'
import { ALL_LEVELS, planByPriceId } from '@/lib/stripe/plans'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function periodEnd(sub: Stripe.Subscription): string | null {
  const cpe = (sub as unknown as { current_period_end?: number }).current_period_end
  return cpe ? new Date(cpe * 1000).toISOString() : null
}

export async function POST(req: Request) {
  const stripe = getStripe()
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripe || !secret) return new Response('Billing not configured', { status: 400 })

  const admin = getAdminClient()
  if (!admin) return new Response('Service role not configured', { status: 500 })

  const signature = req.headers.get('stripe-signature') ?? ''
  const body = await req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret)
  } catch {
    return new Response('Invalid signature', { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.client_reference_id ?? session.metadata?.user_id
    const subId = typeof session.subscription === 'string' ? session.subscription : null
    const customerId = typeof session.customer === 'string' ? session.customer : null
    if (userId && subId) {
      const subscription = await stripe.subscriptions.retrieve(subId)
      const priceId = subscription.items.data[0]?.price.id
      await admin
        .from('subscriptions')
        .update({
          stripe_customer_id: customerId,
          stripe_subscription_id: subId,
          status: subscription.status,
          plan: planByPriceId(priceId)?.id ?? 'all_access',
          levels_access: subscription.status === 'active' || subscription.status === 'trialing' ? ALL_LEVELS : [],
          current_period_end: periodEnd(subscription),
        })
        .eq('user_id', userId)
    }
  } else if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    const customerId = typeof subscription.customer === 'string' ? subscription.customer : null
    const status = event.type === 'customer.subscription.deleted' ? 'canceled' : subscription.status
    const hasAccess = status === 'active' || status === 'trialing'
    if (customerId) {
      await admin
        .from('subscriptions')
        .update({
          status,
          levels_access: hasAccess ? ALL_LEVELS : [],
          current_period_end: periodEnd(subscription),
        })
        .eq('stripe_customer_id', customerId)
    }
  }

  return new Response('ok')
}
