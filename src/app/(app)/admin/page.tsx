import { redirect } from 'next/navigation'
import { ShieldCheck } from 'lucide-react'
import { getSessionContext } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'
import { QuestionSetUploader, type SetRow } from '@/components/admin/question-set-uploader'

export default async function AdminPage() {
  const ctx = await getSessionContext()
  if (!ctx) return null
  if (!ctx.profile?.is_admin) redirect('/')

  const supabase = await createClient()
  let sets: SetRow[] = []
  if (supabase) {
    const { data } = await supabase
      .from('assessment_sets')
      .select('id, title, level, scope, published, assessment_questions(count)')
      .order('created_at', { ascending: false })
    sets = (data ?? []).map((s) => {
      const counts = s.assessment_questions as unknown as { count: number }[] | null
      return {
        id: s.id,
        title: s.title,
        level: s.level,
        scope: s.scope,
        published: s.published,
        questionCount: counts?.[0]?.count ?? 0,
      }
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-amber-400 font-medium mb-1 flex items-center gap-1.5">
          <ShieldCheck size={15} /> Admin
        </p>
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2 tracking-tight">Question Bank</h1>
        <p className="text-muted-foreground text-base md:text-lg">
          Import question sets from pasted text — the AI structures them into graded MCQs.
        </p>
      </div>
      <QuestionSetUploader sets={sets} />
    </div>
  )
}
