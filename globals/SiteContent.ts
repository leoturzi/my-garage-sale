import type { GlobalConfig } from 'payload'
import { isAdmin } from '@/lib/access'

export const SiteContent: GlobalConfig = {
  slug: 'site-content',
  label: 'Personalización del Sitio',
  access: {
    read: () => true,
    update: isAdmin,
  },
  fields: [
    {
      name: 'marquee',
      type: 'group',
      label: 'Marquesina',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Mostrar marquesina',
          defaultValue: true,
        },
        {
          name: 'messages',
          type: 'array',
          label: 'Mensajes',
          maxRows: 3,
          admin: {
            description: 'Hasta 3 mensajes que se desplazan en la barra superior.',
          },
          fields: [
            {
              name: 'text',
              type: 'text',
              label: 'Mensaje',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'faq',
      type: 'group',
      label: 'Preguntas Frecuentes',
      fields: [
        {
          name: 'sections',
          type: 'array',
          label: 'Secciones',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Título de sección',
              required: true,
            },
            {
              name: 'show_on_product_page',
              type: 'checkbox',
              label: 'Mostrar en página de producto',
              defaultValue: false,
            },
            {
              name: 'questions',
              type: 'array',
              label: 'Preguntas',
              fields: [
                {
                  name: 'question',
                  type: 'text',
                  label: 'Pregunta',
                  required: true,
                },
                {
                  name: 'answer',
                  type: 'textarea',
                  label: 'Respuesta',
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
