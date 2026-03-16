import type { GlobalConfig } from 'payload'

export const Hero: GlobalConfig = {
  slug: 'hero',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'subtitle',
      type: 'text',
    },
    {
      name: 'cta_label',
      type: 'text',
    },
    {
      name: 'cta_link',
      type: 'text',
    },
    {
      name: 'background_image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
