import Link from "next/link"
import { createServerSupabaseClient, requireAdmin } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, FileText, Eye } from "lucide-react"

export default async function AdminDashboard() {
  await requireAdmin()
  const supabase = await createServerSupabaseClient()

  const { data: publishedCount } = await supabase
    .from("posts")
    .select("id", { count: "exact", head: true })
    .eq("published", true)

  const { data: draftCount } = await supabase
    .from("posts")
    .select("id", { count: "exact", head: true })
    .eq("published", false)

  const { data: recentPosts } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-white/60">Manage your blog content</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-white/10 bg-gradient-to-br from-emerald-500/20 to-sky-600/20">
          <CardHeader>
            <CardTitle>Published Posts</CardTitle>
            <CardDescription className="text-white/60">Live on your blog</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{publishedCount?.count || 0}</div>
            <Link href="/admin/posts" className="mt-4 inline-block">
              <Button variant="outline" className="border-white/20 bg-white/5">
                <Eye className="mr-2 h-4 w-4" />
                View All
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-gradient-to-br from-blue-500/20 to-indigo-500/20">
          <CardHeader>
            <CardTitle>Draft Posts</CardTitle>
            <CardDescription className="text-white/60">Not yet published</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{draftCount?.count || 0}</div>
            <Link href="/admin/posts?filter=drafts" className="mt-4 inline-block">
              <Button variant="outline" className="border-white/20 bg-white/5">
                <FileText className="mr-2 h-4 w-4" />
                View Drafts
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-gradient-to-br from-purple-500/20 to-violet-600/20">
          <CardHeader>
            <CardTitle>Create New Post</CardTitle>
            <CardDescription className="text-white/60">Add new content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-white/80">Start writing a new blog post</div>
            <Link href="/admin/posts/new" className="mt-4 inline-block">
              <Button className="bg-gradient-to-r from-emerald-300 to-sky-400 text-gray-800 hover:from-emerald-400 hover:to-sky-500">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Post
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10">
        <h2 className="mb-6 text-2xl font-bold">Recent Posts</h2>
        <div className="rounded-lg border border-white/10 bg-white/5">
          {recentPosts && recentPosts.length > 0 ? (
            <div className="divide-y divide-white/10">
              {recentPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-medium">{post.title}</h3>
                    <p className="text-sm text-white/60">
                      {new Date(post.created_at).toLocaleDateString()}
                      {post.published ? " • Published" : " • Draft"}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Link href={`/admin/posts/${post.id}`}>
                      <Button variant="outline" size="sm" className="border-white/20 bg-white/5">
                        Edit
                      </Button>
                    </Link>
                    {post.published && (
                      <Link href={`/blog/${post.slug}`} target="_blank">
                        <Button variant="outline" size="sm" className="border-white/20 bg-white/5">
                          View
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-white/60">
              <p>No posts yet. Create your first post!</p>
              <Link href="/admin/posts/new" className="mt-4 inline-block">
                <Button className="bg-gradient-to-r from-emerald-300 to-sky-400 text-gray-800 hover:from-emerald-400 hover:to-sky-500">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Post
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
