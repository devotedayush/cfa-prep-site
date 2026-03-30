import { Shield, SlidersHorizontal, Sparkles, UserCog } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2 tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-lg">
          Manage study preferences, alerts, and account connections.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass-panel rounded-2xl p-6">
          <h2 className="flex items-center gap-2 text-lg font-heading font-semibold mb-4">
            <UserCog className="text-primary" size={18} /> Study profile
          </h2>
          <p className="text-sm text-muted-foreground">
            Set daily targets, preferred study windows, and quiz intensity.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-6">
          <h2 className="flex items-center gap-2 text-lg font-heading font-semibold mb-4">
            <Shield className="text-primary" size={18} /> Account security
          </h2>
          <p className="text-sm text-muted-foreground">
            Keep third-party access, token storage, and session policies under control.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-6">
          <h2 className="flex items-center gap-2 text-lg font-heading font-semibold mb-4">
            <SlidersHorizontal className="text-primary" size={18} /> Reminders
          </h2>
          <p className="text-sm text-muted-foreground">
            Configure revision nudges, mock test alerts, and deadline prompts.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-6">
          <h2 className="flex items-center gap-2 text-lg font-heading font-semibold mb-4">
            <Sparkles className="text-primary" size={18} /> Product mode
          </h2>
          <p className="text-sm text-muted-foreground">
            Keep the interface focused on CFA prep without extra clutter.
          </p>
        </div>
      </div>
    </div>
  )
}
