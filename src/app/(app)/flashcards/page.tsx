import { getSessionContext } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'
import { getSubjects, LEVEL_LABELS } from '@/lib/curriculum'
import { FlashcardsStudio, type CardItem } from '@/components/flashcards/flashcards-studio'

export default async function FlashcardsPage() {
  const ctx = await getSessionContext()
  if (!ctx) return null

  const { activeLevel } = ctx
  const supabase = await createClient()
  let cards: CardItem[] = []

  if (supabase) {
    const [{ data: customCards }, { data: prog }] = await Promise.all([
      supabase
        .from('custom_flashcards')
        .select('id, title, prompt, answer, memory_hook, subject, module')
        .eq('user_id', ctx.user.id)
        .eq('level', activeLevel)
        .order('created_at', { ascending: false }),
      supabase
        .from('flashcard_progress')
        .select('card_id, known, bookmarked')
        .eq('user_id', ctx.user.id)
        .eq('level', activeLevel),
    ])

    const progressMap = new Map((prog ?? []).map((p) => [p.card_id, p]))
    cards = (customCards ?? []).map((c) => ({
      id: c.id,
      title: c.title,
      prompt: c.prompt,
      answer: c.answer,
      memory_hook: c.memory_hook ?? '',
      subject: c.subject,
      module: c.module,
      known: progressMap.get(c.id)?.known ?? false,
      bookmarked: progressMap.get(c.id)?.bookmarked ?? false,
    }))
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-primary font-medium mb-1">CFA {LEVEL_LABELS[activeLevel]}</p>
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2 tracking-tight">Flashcards</h1>
        <p className="text-muted-foreground text-base md:text-lg">
          Build decks by hand or generate them with AI, then study with spaced flips.
        </p>
      </div>
      <FlashcardsStudio level={activeLevel} cards={cards} subjects={getSubjects(activeLevel)} />
    </div>
  )
}
