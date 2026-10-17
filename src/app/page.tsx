import Link from 'next/link'
import {
  ArrowRight, Target, BrainCircuit, RefreshCcw, Copy, BarChart3,
  CheckCircle2, Sparkles,
} from 'lucide-react'
import { getCurrentUser } from '@/lib/supabase/server'

const FEATURES = [
  { icon: Target, title: 'Readiness, not just coverage', body: 'An exam-weight-weighted readiness score that reflects how prepared you actually are — not just how much you’ve ticked off.' },
  { icon: BrainCircuit, title: 'AI quizzes that grade you', body: 'Original practice questions for any subtopic, instantly. Scores feed your mastery and reshape what you study next.' },
  { icon: RefreshCcw, title: 'Adaptive spaced revision', body: 'Weak topics resurface sooner, strong ones later. Your revision queue rebuilds itself every day.' },
  { icon: Copy, title: 'Flashcards & calculator drills', body: 'Generate flashcard decks with AI and sharpen BA II Plus speed with verified, checked drills.' },
  { icon: BarChart3, title: 'Mocks & analytics', body: 'Log full-length mocks and watch your score trend, weak sections, and momentum over time.' },
  { icon: Sparkles, title: 'All three levels', body: 'Level I, II and III in one place. Switch levels anytime — everything rescopes instantly.' },
]

const STEPS = [
  { n: '1', title: 'Set your exam date', body: 'We compute your countdown, pacing and daily load — no fixed schedules.' },
  { n: '2', title: 'Study & log progress', body: 'Work the syllabus, take AI quizzes, and rate your confidence in seconds.' },
  { n: '3', title: 'Follow the plan', body: 'Each day we surface your next best action and what’s at risk. Recovery mode kicks in if you fall behind.' },
]

export default async function LandingPage() {
  const user = await getCurrentUser()

  return (
    <div className="relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute top-1/3 right-0 w-[30rem] h-[30rem] bg-cyan-500/10 rounded-full blur-3xl -z-10" />

      {/* Nav */}
      <header className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-cyan-400 flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-white font-bold text-sm">CFA</span>
          </div>
          <span className="font-heading font-semibold tracking-tight text-lg">Prep <span className="text-white/50">Pro</span></span>
        </div>
        <nav className="flex items-center gap-3 text-sm">
          {user ? (
            <Link href="/dashboard" className="rounded-xl bg-white px-4 py-2 font-semibold text-black hover:bg-neutral-200 transition-colors">
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-white/70 hover:text-white transition-colors px-3 py-2">Sign in</Link>
              <Link href="/signup" className="rounded-xl bg-white px-4 py-2 font-semibold text-black hover:bg-neutral-200 transition-colors">
                Start free
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs text-primary mb-6">
          <Sparkles size={13} /> Adaptive, AI-powered CFA prep · Levels I–III
        </div>
        <h1 className="text-5xl md:text-6xl font-heading font-bold tracking-tight leading-[1.05] mb-6">
          Know exactly what to study <span className="text-gradient">next</span>.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          A personal study cockpit that adapts to your exam date — turning the whole CFA syllabus into a clear daily plan,
          AI assessments, and spaced revision that actually sticks.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href={user ? '/dashboard' : '/signup'} className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-black hover:bg-neutral-200 transition-colors">
            {user ? 'Open the app' : 'Start your free trial'} <ArrowRight size={18} />
          </Link>
          <a href="#features" className="rounded-xl border border-white/15 px-6 py-3 font-medium text-white/80 hover:bg-white/5 transition-colors">
            See features
          </a>
        </div>
        <p className="text-xs text-white/40 mt-4">7-day free trial · no card required</p>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = f.icon
            return (
              <div key={f.title} className="glass-panel rounded-2xl p-6">
                <div className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.body}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-heading font-bold text-center mb-10">How it works</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-cyan-400 text-white font-heading font-bold text-lg flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
                {s.n}
              </div>
              <h3 className="font-heading font-semibold text-white mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <div className="glass-panel rounded-3xl p-10 border border-primary/20 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary/15 rounded-full blur-3xl" />
          <h2 className="text-3xl font-heading font-bold mb-3 relative z-10">Pass with a plan, not panic.</h2>
          <p className="text-muted-foreground mb-6 relative z-10">
            Start free today. Upgrade anytime for all three levels.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
            <Link href={user ? '/dashboard' : '/signup'} className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-black hover:bg-neutral-200 transition-colors">
              {user ? 'Open the app' : 'Get started free'} <ArrowRight size={18} />
            </Link>
            {!user && (
              <Link href="/login" className="rounded-xl border border-white/15 px-6 py-3 font-medium text-white/80 hover:bg-white/5 transition-colors">
                I have an account
              </Link>
            )}
          </div>
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-6 text-xs text-white/50 relative z-10">
            {['All 3 CFA levels', 'AI quizzes & flashcards', 'Adaptive revision', 'Mock tracking'].map((t) => (
              <li key={t} className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-400" /> {t}</li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-6 py-10 border-t border-white/5 text-center">
        <p className="text-xs text-white/30">
          © CFA Prep Pro. Not affiliated with or endorsed by CFA Institute. CFA® is a trademark owned by CFA Institute.
        </p>
      </footer>
    </div>
  )
}
