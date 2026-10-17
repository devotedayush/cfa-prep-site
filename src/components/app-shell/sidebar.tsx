'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, BookText, BrainCircuit, Target, PenTool,
  CheckSquare, Settings, LogOut, ShieldCheck, Copy, Calculator, Library, CreditCard,
  Menu, X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { signOut, setActiveLevel } from '@/lib/auth/actions'
import { LEVEL_LABELS, LEVELS, type Level } from '@/lib/curriculum'

const NAV = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Syllabus', href: '/syllabus', icon: BookText },
  { name: 'Assessments', href: '/assessments', icon: BrainCircuit },
  { name: 'Flashcards', href: '/flashcards', icon: Copy },
  { name: 'Calculator', href: '/calculator', icon: Calculator },
  { name: 'Revisions', href: '/revisions', icon: CheckSquare },
  { name: 'Library', href: '/library', icon: Library },
  { name: 'Mocks', href: '/mocks', icon: Target },
  { name: 'Notes', href: '/notes', icon: PenTool },
]

interface SidebarProps {
  activeLevel: Level
  displayName: string
  email: string
  isAdmin: boolean
}

function Logo() {
  return (
    <Link href="/dashboard" className="font-heading font-semibold tracking-tight text-xl flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-cyan-400 flex items-center justify-center shadow-lg shadow-primary/20">
        <span className="text-white font-bold text-sm">CFA</span>
      </div>
      Prep <span className="text-white/50">Pro</span>
    </Link>
  )
}

/** Shared inner content rendered in both the desktop aside and the mobile drawer. */
function SidebarBody({
  activeLevel,
  displayName,
  email,
  isAdmin,
  pathname,
  onNavigate,
}: SidebarProps & { pathname: string; onNavigate?: () => void }) {
  return (
    <>
      <div className="px-6 mb-6">
        <Logo />
      </div>

      {/* Level switcher */}
      <form action={setActiveLevel} className="px-4 mb-6">
        <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1.5 px-1">Studying</p>
        <div className="grid grid-cols-3 gap-1 rounded-xl bg-black/30 p-1 border border-white/5">
          {LEVELS.map((lvl) => (
            <button
              key={lvl}
              type="submit"
              name="level"
              value={lvl}
              aria-pressed={lvl === activeLevel}
              aria-label={`Switch to ${LEVEL_LABELS[lvl]}`}
              className={cn(
                'rounded-lg py-1.5 text-xs font-semibold transition-colors',
                lvl === activeLevel ? 'bg-primary text-white shadow' : 'text-white/50 hover:text-white hover:bg-white/5',
              )}
            >
              {LEVEL_LABELS[lvl].replace('Level ', 'L')}
            </button>
          ))}
        </div>
      </form>

      <nav className="flex-1 px-4 flex flex-col gap-1 overflow-y-auto">
        {NAV.map((link) => {
          const Icon = link.icon
          const active = pathname === link.href || pathname.startsWith(link.href + '/')
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors font-medium',
                active ? 'bg-white/10 text-white' : 'text-foreground/70 hover:text-foreground hover:bg-white/5',
              )}
            >
              <Icon size={18} className={active ? 'text-primary' : 'text-primary/70'} />
              {link.name}
            </Link>
          )
        })}

        {isAdmin && (
          <Link
            href="/admin"
            onClick={onNavigate}
            aria-current={pathname.startsWith('/admin') ? 'page' : undefined}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors font-medium',
              pathname.startsWith('/admin') ? 'bg-white/10 text-white' : 'text-foreground/70 hover:text-foreground hover:bg-white/5',
            )}
          >
            <ShieldCheck size={18} className="text-amber-400/80" /> Admin
          </Link>
        )}
      </nav>

      <div className="px-4 mt-auto space-y-1">
        <Link
          href="/billing"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground/60 hover:text-foreground hover:bg-white/5 transition-colors font-medium"
        >
          <CreditCard size={18} /> Billing
        </Link>
        <Link
          href="/settings"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground/60 hover:text-foreground hover:bg-white/5 transition-colors font-medium"
        >
          <Settings size={18} /> Settings
        </Link>
        <div className="flex items-center gap-3 px-3 pt-3 mt-2 border-t border-white/5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary/40 to-cyan-400/40 flex items-center justify-center text-xs font-bold text-white shrink-0">
            {(displayName || email || '?').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-white truncate">{displayName || 'Student'}</p>
            <p className="text-[10px] text-white/55 truncate">{email}</p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              aria-label="Sign out"
              title="Sign out"
              className="p-1.5 rounded-lg text-white/55 hover:text-white hover:bg-white/5 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export function Sidebar(props: SidebarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [open])

  return (
    <>
      {/* Mobile top bar (below md) */}
      <header className="md:hidden fixed top-0 inset-x-0 h-16 z-30 flex items-center justify-between px-4 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <Logo />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={open}
          className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* Desktop sidebar (md and up) */}
      <aside className="hidden md:flex w-64 h-screen fixed left-0 top-0 border-r border-white/5 bg-background/50 backdrop-blur-xl flex-col pt-8 pb-4 z-20">
        <SidebarBody {...props} pathname={pathname} />
      </aside>

      {/* Mobile slide-over drawer */}
      <div
        className={cn('md:hidden fixed inset-0 z-40', open ? 'pointer-events-auto' : 'pointer-events-none')}
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <div
          onClick={() => setOpen(false)}
          className={cn(
            'absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200',
            open ? 'opacity-100' : 'opacity-0',
          )}
        />
        {/* Panel */}
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className={cn(
            'absolute left-0 top-0 h-full w-72 max-w-[85vw] border-r border-white/5 bg-background/95 backdrop-blur-xl flex flex-col pt-6 pb-4 shadow-2xl transition-transform duration-200',
            open ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="flex justify-end px-4 mb-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close navigation menu"
              className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <SidebarBody {...props} pathname={pathname} onNavigate={() => setOpen(false)} />
        </aside>
      </div>
    </>
  )
}
