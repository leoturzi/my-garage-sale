import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const SUPABASE_HOST = 'https://seswpytxueftfgvipzcb.supabase.co'

const sharedHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

const publicCSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' ${SUPABASE_HOST} data:`,
  "font-src 'self'",
  `connect-src 'self' ${SUPABASE_HOST}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

const adminCSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' ${SUPABASE_HOST} data: blob:`,
  "font-src 'self'",
  `connect-src 'self' ${SUPABASE_HOST}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'seswpytxueftfgvipzcb.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/admin/:path*',
        headers: [...sharedHeaders, { key: 'Content-Security-Policy', value: adminCSP }],
      },
      {
        source: '/((?!admin).*)',
        headers: [...sharedHeaders, { key: 'Content-Security-Policy', value: publicCSP }],
      },
    ]
  },
}

export default withPayload(nextConfig)
