import { BrainCircuit, FileCheck2, ShieldAlert, Target } from "lucide-react"

const assessmentRows = [
  { label: "Diagnostic quiz", value: "68%", tone: "text-emerald-400" },
  { label: "Ethics accuracy", value: "72%", tone: "text-cyan-400" },
  { label: "Timed mock", value: "61%", tone: "text-amber-400" },
]

export default function AssessmentsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2 tracking-tight">Assessments</h1>
        <p className="text-muted-foreground text-lg">
          Snapshot your readiness with diagnostics, topic quizzes, and timed mocks.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {assessmentRows.map((row) => (
          <div key={row.label} className="glass-panel rounded-2xl p-5">
            <p className="text-sm text-muted-foreground">{row.label}</p>
            <p className={`mt-2 text-3xl font-heading font-bold ${row.tone}`}>{row.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-panel rounded-2xl p-6">
        <h2 className="flex items-center gap-2 text-lg font-heading font-semibold mb-4">
          <BrainCircuit className="text-primary" size={18} /> Assessment types
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-white/5 bg-white/5 p-4">
            <FileCheck2 className="mb-3 text-primary" size={18} />
            <h3 className="font-medium text-white">Topic quizzes</h3>
            <p className="mt-1 text-sm text-muted-foreground">Fast checks for formulas, definitions, and traps.</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/5 p-4">
            <Target className="mb-3 text-primary" size={18} />
            <h3 className="font-medium text-white">Timed mocks</h3>
            <p className="mt-1 text-sm text-muted-foreground">Build pacing and decision speed under exam timing.</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/5 p-4">
            <ShieldAlert className="mb-3 text-primary" size={18} />
            <h3 className="font-medium text-white">Weakness audits</h3>
            <p className="mt-1 text-sm text-muted-foreground">Surface the areas that need the most revision work.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
