'use client'

import { useState } from 'react'

interface AccordionItem {
  title: string
  content: React.ReactNode
  defaultOpen?: boolean
}

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<Set<number>>(() => {
    const initial = new Set<number>()
    items.forEach((item, i) => {
      if (item.defaultOpen) initial.add(i)
    })
    return initial
  })

  function toggle(index: number) {
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  return (
    <div className="divide-y divide-gray-200 border-y border-gray-200">
      {items.map((item, i) => {
        const isOpen = open.has(i)
        return (
          <div key={i}>
            <button
              onClick={() => toggle(i)}
              className="flex items-center justify-between w-full py-4 text-left"
            >
              <span className="text-sm font-semibold uppercase tracking-wider">
                {item.title}
              </span>
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-300"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <div className="pb-4 text-sm text-muted leading-relaxed">
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
