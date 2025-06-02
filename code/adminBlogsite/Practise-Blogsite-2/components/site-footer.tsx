export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-gray-800 py-6">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-center text-sm text-white/60">
          &copy; {new Date().getFullYear()} Ments Blog. All rights reserved.
        </p>
        <p className="text-center text-sm text-white/60">Built with Next.js and Supabase</p>
      </div>
    </footer>
  )
}
