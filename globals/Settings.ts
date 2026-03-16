import type { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  access: {
    read: () => true,
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
  ],
}
