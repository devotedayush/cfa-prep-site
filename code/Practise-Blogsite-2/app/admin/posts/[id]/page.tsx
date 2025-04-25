import { notFound } from "next/navigation"
import { createServerSupabaseClient, requireAdmin } from "@/lib/auth"
import { PostForm } from "@/components/post-form"

interface EditPostPageProps {
  params: {
    id: string
  }
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  await requireAdmin()
  const { id } = params

  const supabase = await createServerSupabaseClient()
  const { data: post } = await supabase.from("posts").select("*").eq("id", id).single()

  if (!post) {
    notFound()
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Post</h1>
        <p className="mt-2 text-white/60">Update your blog post</p>
      </div>

      <div className="rounded-lg border border-white/10 bg-white/5 p-6">
        <PostForm post={post} />
      </div>
    </div>
  )
}
