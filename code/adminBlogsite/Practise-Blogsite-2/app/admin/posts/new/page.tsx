import { requireAdmin } from "@/lib/auth"
import { PostForm } from "@/components/post-form"

export default async function NewPostPage() {
  await requireAdmin()

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Post</h1>
        <p className="mt-2 text-white/60">Add a new blog post</p>
      </div>

      <div className="rounded-lg border border-white/10 bg-white/5 p-6">
        <PostForm />
      </div>
    </div>
  )
}
