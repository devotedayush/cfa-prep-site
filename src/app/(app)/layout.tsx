import { redirect } from 'next/navigation'
import { getSessionContext } from '@/lib/auth/session'
import { getAccess } from '@/lib/billing/access'
import { Sidebar } from '@/components/app-shell/sidebar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getSessionContext()

  // Not signed in (or Supabase unconfigured) — middleware also guards this.
  if (!ctx) redirect('/login')

  // Signed in but hasn't finished setup.
  if (ctx.profile && !ctx.profile.onboarding_completed) redirect('/onboarding')

  // Trial expired / no subscription (only enforced when billing is configured).
  if (!getAccess(ctx.subscription).hasAccess) redirect('/billing')

  return (
    <div className="flex relative">
      <Sidebar
        activeLevel={ctx.activeLevel}
        displayName={ctx.profile?.username ?? ''}
        email={ctx.user.email ?? ''}
        isAdmin={ctx.profile?.is_admin ?? false}
      />
      <main className="flex-1 md:ml-64 p-4 sm:p-6 md:p-8 pt-20 md:pt-10 min-h-screen pb-24">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
