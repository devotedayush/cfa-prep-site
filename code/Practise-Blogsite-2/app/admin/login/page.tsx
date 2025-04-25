import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/auth"
import { LoginForm } from "./login-form"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default async function LoginPage() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect("/admin")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">Admin Login</h1>
            <p className="mt-2 text-white/60">Sign in to manage your blog</p>
          </div>
          <LoginForm />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
