import { BadgeCheck, Clock3, GraduationCap, TrendingUp } from "lucide-react"

const mockStats = [
  { label: "Completed mocks", value: "3" },
  { label: "Average score", value: "66%" },
  { label: "Best section", value: "Ethics" },
]

export default function MocksPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2 tracking-tight">Mocks</h1>
        <p className="text-muted-foreground text-lg">
          Track full-length practice exams and the trends that matter most.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {mockStats.map((stat) => (
          <div key={stat.label} className="glass-panel rounded-2xl p-5">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-2 text-3xl font-heading font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-panel rounded-2xl p-6">
        <h2 className="flex items-center gap-2 text-lg font-heading font-semibold mb-4">
          <GraduationCap className="text-primary" size={18} /> Mock plan
        </h2>
        <div className="space-y-4 text-sm text-muted-foreground">
          <p className="flex items-center gap-2"><Clock3 size={16} className="text-amber-400" /> One timed mock each week</p>
          <p className="flex items-center gap-2"><BadgeCheck size={16} className="text-emerald-400" /> Review every missed question the same day</p>
          <p className="flex items-center gap-2"><TrendingUp size={16} className="text-cyan-400" /> Compare section-by-section progress after each attempt</p>
        </div>
      </div>
    </div>
  )
}
