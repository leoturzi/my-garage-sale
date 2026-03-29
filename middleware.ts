import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const allowedIps = process.env.ALLOWED_ADMIN_IPS?.split(',').map((ip) => ip.trim()) ?? []

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'

  if (allowedIps.length > 0 && !allowedIps.includes(ip)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
