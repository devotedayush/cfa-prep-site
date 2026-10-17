import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe/client'
import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { PLANS } from '@/lib/stripe/plans'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const stripe = getStripe()
  if (!stripe) return NextResponse.json({ error: 'Billing is not configured.' }, { status: 400 })

  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Not configured.' }, { status: 400 })
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { planId } = await req.json().catch(() => ({ planId: undefined }))
  const plan = PLANS.find((p) => p.id === planId)
  if (!plan?.priceId) return NextResponse.json({ error: 'That plan is unavailable.' }, { status: 400 })

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .maybeSingle()

  let customerId = sub?.stripe_customer_id ?? undefined
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      metadata: { user_id: user.id },
    })
    customerId = customer.id
    const admin = getAdminClient()
    if (admin) {
      await admin.from('subscriptions').update({ stripe_customer_id: customerId }).eq('user_id', user.id)
    }
  }

  const origin = req.headers.get('origin') ?? new URL(req.url).origin
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    client_reference_id: user.id,
    line_items: [{ price: plan.priceId, quantity: 1 }],
    success_url: `${origin}/billing?status=success`,
    cancel_url: `${origin}/billing?status=cancelled`,
    metadata: { user_id: user.id },
    subscription_data: { metadata: { user_id: user.id } },
  })

  return NextResponse.json({ url: session.url })
}
