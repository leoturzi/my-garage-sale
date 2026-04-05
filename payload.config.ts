import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'
import { Users } from './collections/Users.ts'
import { Media } from './collections/Media.ts'
import { Categories } from './collections/Categories.ts'
import { Products } from './collections/Products.ts'
import { Hero } from './globals/Hero.ts'
import { Settings } from './globals/Settings.ts'

const requiredEnv = [
  'DATABASE_URI',
  'PAYLOAD_SECRET',
  'S3_BUCKET',
  'S3_ACCESS_KEY_ID',
  'S3_SECRET_ACCESS_KEY',
  'S3_REGION',
  'S3_ENDPOINT',
]

const missing = requiredEnv.filter((key) => !process.env[key])
if (missing.length > 0) {
  throw new Error(`Missing required env vars: ${missing.join(', ')}`)
}

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      providers: ['/components/admin/PasswordToggleProvider#PasswordToggleProvider'],
    },
  },
  editor: lexicalEditor(),
  collections: [Users, Media, Categories, Products],
  globals: [Hero, Settings],
  secret: process.env.PAYLOAD_SECRET!,
  cors: [
    process.env.NEXT_PUBLIC_SITE_URL,
  ].filter(Boolean) as string[],
  csrf: [
    process.env.NEXT_PUBLIC_SITE_URL,
  ].filter(Boolean) as string[],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI!,
    },
  }),
  sharp,
  plugins: [
    s3Storage({
      collections: {
        media: {
          generateFileURL: ({ filename }) => {
            const storageBase = process.env.S3_ENDPOINT!.replace(/\/s3$/, '')
            return `${storageBase}/object/public/${process.env.S3_BUCKET}/${filename}`
          },
        },
      },
      bucket: process.env.S3_BUCKET!,
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
        },
        endpoint: process.env.S3_ENDPOINT!,
        region: process.env.S3_REGION!,
        forcePathStyle: true,
      },
    }),
  ],
})
