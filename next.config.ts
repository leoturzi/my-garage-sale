import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

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
}

export default withPayload(nextConfig)
