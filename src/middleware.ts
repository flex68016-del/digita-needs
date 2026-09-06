import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { computeSessionToken } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Enforce HTTPS in production
  if (process.env.NODE_ENV === 'production' && request.headers.get('x-forwarded-proto') !== 'https') {
    const httpsUrl = new URL('https://' + request.headers.get('host') + request.url)
    return NextResponse.redirect(httpsUrl, { status: 301 })
  }

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
