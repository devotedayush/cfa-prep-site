import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { getSessionContext } from '@/lib/auth/session'
import { getAccess } from '@/lib/billing/access'
import { PLANS } from '@/lib/stripe/plans'
import { PlanCards, ManageBillingButton } from '@/components/billing/billing-actions'
import { signOut } from '@/lib/auth/actions'

export default async function BillingPage() {
  const ctx = await getSessionContext()
  if (!ctx) redirect('/login')

  const access = getAccess(ctx.subscription)
  const canCheckout = access.billingEnabled && PLANS.some((p) => Boolean(p.priceId))
  const hasCustomer = Boolean(ctx.subscription?.stripe_customer_id)

  let headline: string
  let sub: string
  if (!access.billingEnabled) {
    headline = 'You have full access'
    sub = 'Billing is not enabled yet, so everything is unlocked.'
  } else if (access.isPro) {
    headline = "You're subscribed 🎉"
    sub = 'Thanks for supporting your prep. Manage your plan anytime.'
  } else if (access.trialing) {
    headline = `Free trial — ${access.trialDaysLeft} day${access.trialDaysLeft === 1 ? '' : 's'} left`
    sub = 'Upgrade any time to keep access after your trial ends.'
  } else {
    headline = 'Your free trial has ended'
    sub = 'Subscribe to keep studying across all three CFA levels.'
  }

  return (
    <div className="min-h-screen px-4 py-12 relative overflow-hidden">
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-cyan-400 flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-bold text-sm">CFA</span>
            </div>
            <span className="font-heading font-semibold tracking-tight">Prep <span className="text-white/50">Pro</span></span>
          </Link>
          {access.hasAccess ? (
            <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors">
              <ArrowLeft size={15} /> Back to app
            </Link>
          ) : (
            <form action={signOut}>
              <button className="text-sm text-white/60 hover:text-white transition-colors">Sign out</button>
            </form>
          )}
        </div>

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs text-primary mb-4">
            <Sparkles size={13} /> All three CFA levels · AI-powered
          </div>
          <h1 className="text-4xl font-heading font-bold tracking-tight mb-2">{headline}</h1>
          <p className="text-muted-foreground text-lg">{sub}</p>
        </div>

        {!access.isPro && <PlanCards canCheckout={canCheckout} />}

        {(access.isPro || hasCustomer) && (
          <div className="mt-8 flex justify-center">
            <ManageBillingButton />
          </div>
        )}

        {!canCheckout && access.billingEnabled && (
          <p className="text-center text-xs text-amber-300/70 mt-6">
            Checkout isn&apos;t live yet — set the Stripe price IDs to enable it.
          </p>
        )}

        <p className="text-center text-xs text-white/30 mt-10">
          Not affiliated with or endorsed by CFA Institute. CFA® is a trademark of CFA Institute.
        </p>
      </div>
    </div>
  )
}
