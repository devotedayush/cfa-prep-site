import { CalendarCheck2, CheckCircle2, Clock3, RefreshCcw, Sparkles } from "lucide-react"

const revisionBlocks = [
  { title: "Ethics drill", detail: "20 scenario questions with instant rationale review", status: "Due today" },
  { title: "Fixed Income formulas", detail: "Duration, convexity, and yield curve recap", status: "Overdue" },
  { title: "FSA ratios", detail: "Liquidity, solvency, and profitability set", status: "Queued" },
]

export default function RevisionsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2 tracking-tight">Revisions</h1>
        <p className="text-muted-foreground text-lg">
          High-yield review blocks mapped to the CFA Level I weighting mix.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {revisionBlocks.map((block) => (
          <div key={block.title} className="glass-panel rounded-2xl p-5 border border-white/5">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="font-semibold text-white">{block.title}</h2>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-wider text-white/60">
                {block.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{block.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass-panel rounded-2xl p-6">
          <h2 className="flex items-center gap-2 text-lg font-heading font-semibold mb-4">
            <CalendarCheck2 className="text-primary" size={18} /> Revision cadence
          </h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400" /> Morning recall on formulas and definitions</p>
            <p className="flex items-center gap-2"><Clock3 size={16} className="text-amber-400" /> Evening timed drills on weak domains</p>
            <p className="flex items-center gap-2"><RefreshCcw size={16} className="text-cyan-400" /> Weekly mixed review to prevent topic drift</p>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6">
          <h2 className="flex items-center gap-2 text-lg font-heading font-semibold mb-4">
            <Sparkles className="text-primary" size={18} /> Next action
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Focus on the four highest-weight areas first: Ethics, FSA, Equity, and Fixed Income.
          </p>
          <button className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition-colors hover:bg-neutral-200">
            Start revision set
          </button>
        </div>
      </div>
    </div>
  )
}
