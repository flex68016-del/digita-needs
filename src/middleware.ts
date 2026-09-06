import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

async function computeSessionToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`${password}:admin-session`)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api/admin')) {
    return NextResponse.next()
  }

  if (pathname === '/admin/login' || pathname === '/api/admin/login') {
    return NextResponse.next()
  }

  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword) {
    return new NextResponse(
      "Configuration manquante : ADMIN_PASSWORD n'est pas défini sur ce déploiement.",
      { status: 500 }
    )
  }

  const sessionCookie = request.cookies.get('admin_session')?.value
  const expectedToken = await computeSessionToken(adminPassword)

  if (sessionCookie !== expectedToken) {
    const loginUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
