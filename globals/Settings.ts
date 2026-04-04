import type { GlobalConfig } from 'payload'
import { isAdmin } from '@/lib/access'

export const Settings: GlobalConfig = {
  slug: 'settings',
  access: {
    read: () => true,
    update: isAdmin,
  },
  fields: [
    {
      name: 'whatsapp_number',
      type: 'text',
      admin: {
        description: 'International format without spaces or dashes (e.g. 393401234567)',
      },
    },
    {
      name: 'store_name',
      type: 'text',
    },
    {
      name: 'logo_desktop',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Logo displayed on desktop viewports. Recommended: PNG with transparency, ~600px wide.',
      },
    },
    {
      name: 'logo_mobile',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Logo displayed on mobile viewports. Recommended: PNG with transparency, ~300px wide.',
      },
    },
  ],
}
