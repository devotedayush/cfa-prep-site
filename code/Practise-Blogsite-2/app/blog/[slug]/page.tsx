import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/auth"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { formatDate } from "@/lib/utils"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params
  const supabase = await createServerSupabaseClient()

  const { data: post } = await supabase.from("posts").select("*").eq("slug", slug).eq("published", true).single()

  if (!post) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <article className="container max-w-3xl px-4 py-12 md:py-20">
          <div className="mb-8 space-y-4">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{post.title}</h1>
            <p className="text-white/60">{formatDate(post.created_at)}</p>
          </div>
          <div className="prose prose-invert" dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      </main>
      <SiteFooter />
    </div>
  )
}
