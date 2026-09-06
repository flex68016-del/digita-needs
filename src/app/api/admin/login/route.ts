import { NextRequest, NextResponse } from 'next/server'

async function computeSessionToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`${password}:admin-session`)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function POST(request: NextRequest) {
  const { password } = await request.json()
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword) {
    return NextResponse.json({ error: 'ADMIN_PASSWORD non configuré' }, { status: 500 })
  }
  if (password !== adminPassword) {
    return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 })
  }

  const token = await computeSessionToken(adminPassword)
  const response = NextResponse.json({ success: true })
  response.cookies.set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  return response
}
