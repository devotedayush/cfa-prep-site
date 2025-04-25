import { createServerSupabaseClient } from "@/lib/auth"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PostCard } from "@/components/post-card"

export default async function Home() {
  const supabase = await createServerSupabaseClient()

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  <span className="bg-gradient-to-r from-emerald-300 to-sky-400 bg-clip-text text-transparent">
                    Welcome to Admin Blog
                  </span>
                </h1>
                <p className="max-w-[700px] text-white/60 md:text-xl">
                  A simple blog with admin-only content management.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-gray-800 to-gray-900">
          <div className="container px-4 md:px-6">
            <h2 className="mb-12 text-center text-3xl font-bold">Latest Posts</h2>
            {posts && posts.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="flex justify-center">
                <p className="text-white/60">No posts available yet.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
