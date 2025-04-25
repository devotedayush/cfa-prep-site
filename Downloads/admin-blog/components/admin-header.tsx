"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

export function AdminHeader() {
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push("/admin/login")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gray-800/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-emerald-300 to-sky-400"></div>
            <span className="text-xl font-bold">Admin Dashboard</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/admin" className="text-white/60 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/admin/posts" className="text-white/60 hover:text-white transition-colors">
              Posts
            </Link>
            <Link href="/admin/posts/new" className="text-white/60 hover:text-white transition-colors">
              New Post
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-white/60 hover:text-white transition-colors">
            View Blog
          </Link>
          <Button variant="outline" className="border-white/20 bg-white/5 hover:bg-white/10" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  )
}
