import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { Database } from "./database.types"

export async function createServerSupabaseClient() {
  const cookieStore = cookies(); // cookies() is now async

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          return (await cookieStore).get(name)?.value;
        },
        // WARNING: Do not use set/remove cookies outside of Route Handlers or Server Actions!
        // If you need to set or remove cookies in other contexts, use the /api/auth-cookies API route instead.
        // async set(name: string, value: string, options: any) {
        //   (await cookieStore).set({ name, value, ...options });
        // },
        // async remove(name: string, options: any) {
        //   (await cookieStore).delete({ name, ...options });
        // },
      },
    }
  );
}
export async function requireAdmin() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/admin/login")
  }

  return session
}
