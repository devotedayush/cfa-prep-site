import Link from "next/link"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gray-800/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-emerald-300 to-sky-400"></div>
          <span className="text-xl font-bold">Ments Blog</span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/" className="text-white/60 hover:text-white transition-colors">
            Blog
          </Link>
          <Link href="/admin" passHref>
            <Button variant="outline" className="border-white/20 bg-white/5 hover:bg-white/10">
              Admin
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
