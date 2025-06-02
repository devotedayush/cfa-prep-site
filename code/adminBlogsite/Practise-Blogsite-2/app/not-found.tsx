import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container flex flex-col items-center text-center">
          <h1 className="text-6xl font-bold">404</h1>
          <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>
          <p className="mt-4 max-w-md text-white/60">The page you are looking for doesn't exist or has been moved.</p>
          <Link href="/" className="mt-8">
            <Button className="bg-gradient-to-r from-emerald-300 to-sky-400 text-gray-800 hover:from-emerald-400 hover:to-sky-500">
              Return Home
            </Button>
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
