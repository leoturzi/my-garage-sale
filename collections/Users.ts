import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/lib/access'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access: {
    admin: ({ req }) => req.user?.role === 'admin',
    read: isAdmin,
    create: isAdmin,
    update: ({ req, id }) => req.user?.id === id || req.user?.role === 'admin',
    delete: isAdmin,
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: {
        create: ({ req }) => req.user?.role === 'admin',
        update: ({ req }) => req.user?.role === 'admin',
      },
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
