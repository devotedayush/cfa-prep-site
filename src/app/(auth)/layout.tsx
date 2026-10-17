import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10" />
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-primary to-cyan-400 flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-white font-bold text-sm">CFA</span>
          </div>
          <span className="font-heading font-semibold tracking-tight text-xl">
            Prep <span className="text-white/50">Pro</span>
          </span>
        </Link>
        <div className="glass-panel rounded-2xl p-8 border border-white/10">{children}</div>
        <p className="text-center text-xs text-white/30 mt-6">
          Not affiliated with or endorsed by CFA Institute. CFA® is a trademark of CFA Institute.
        </p>
      </div>
    </div>
  )
}
