import { BookOpenText, ClipboardList, Lightbulb, PenTool } from "lucide-react"

const noteSections = [
  "Formula sheet",
  "Ethics edge cases",
  "FSA ratio interpretations",
]

export default function NotesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2 tracking-tight">Notes</h1>
        <p className="text-muted-foreground text-lg">
          Keep compact, exam-friendly summaries for quick review sessions.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {noteSections.map((section) => (
          <div key={section} className="glass-panel rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <BookOpenText className="text-primary" size={18} />
              <h2 className="font-medium text-white">{section}</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Add concise explanations, mnemonics, and any traps you want to revisit later.
            </p>
          </div>
        ))}
      </div>

      <div className="glass-panel rounded-2xl p-6">
        <h2 className="flex items-center gap-2 text-lg font-heading font-semibold mb-4">
          <PenTool className="text-primary" size={18} /> Suggested note structure
        </h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p className="flex items-center gap-2"><ClipboardList size={16} className="text-cyan-400" /> Definition first, then the formula or rule</p>
          <p className="flex items-center gap-2"><Lightbulb size={16} className="text-amber-400" /> Add one memory hook per topic</p>
          <p>Keep entries short enough to scan in under a minute before a quiz block.</p>
        </div>
      </div>
    </div>
  )
}
