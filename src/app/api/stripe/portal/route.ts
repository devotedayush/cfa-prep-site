import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe/client'
import { createClient } from '@/lib/supabase/server'

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

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!sub?.stripe_customer_id) {
    return NextResponse.json({ error: 'No billing account yet.' }, { status: 400 })
  }

  const origin = req.headers.get('origin') ?? new URL(req.url).origin
  const session = await stripe.billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    return_url: `${origin}/billing`,
  })

  return NextResponse.json({ url: session.url })
}
