import Link from "next/link"
import { formatDate } from "@/lib/utils"
import type { Database } from "@/lib/database.types"

type Post = Database["public"]["Tables"]["posts"]["Row"]

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <div className="group rounded-lg border border-white/10 bg-white/5 p-6 transition-all hover:bg-white/10">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">{post.title}</h2>
          <p className="text-sm text-white/60">{formatDate(post.created_at)}</p>
        </div>
        <p className="mt-4 line-clamp-3 text-white/80">{post.content.replace(/<[^>]*>/g, "").substring(0, 150)}...</p>
        <div className="mt-4 flex items-center text-sky-400">
          <span className="text-sm font-medium">Read more</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}
