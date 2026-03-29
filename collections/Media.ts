import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/lib/access'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    focalPoint: true,
  },
  hooks: {
    beforeChange: [
      ({ req }) => {
        const file = req.file
        if (file && file.size > 10 * 1024 * 1024) {
          throw new Error('File size must not exceed 10 MB')
        }
      },
    ],
  },
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'ai_image_generator',
      type: 'ui',
      admin: {
        components: {
          Field: '/components/admin/AIImageGeneratorField#AIImageGeneratorField',
        },
      },
    },
  ],
}
