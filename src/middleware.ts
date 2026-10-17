import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getSupabaseConfig } from '@/lib/supabase/config'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const config = getSupabaseConfig()
  if (!config) return response // unconfigured: don't lock the app out

  const supabase = createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        )
      },
    },
  })

  // IMPORTANT: getUser() refreshes the session cookie; do not remove.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isAuthRoute = pathname === '/login' || pathname === '/signup'
  const isPublic =
    isAuthRoute ||
    pathname === '/' ||
    pathname === '/onboarding' ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/api')

  if (!user && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    // Run on everything except Next internals and static asset files.
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
