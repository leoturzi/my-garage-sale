'use client'

import React from 'react'
import type { UIFieldClientComponent } from 'payload'
import { AIImageGenerator } from './AIImageGenerator'

export const AIImageGeneratorField: UIFieldClientComponent = ({ field }) => {
  const custom = field?.admin?.custom as
    | { targetFieldPath?: string; hasMany?: boolean }
    | undefined

  return (
    <AIImageGenerator
      targetFieldPath={custom?.targetFieldPath ?? 'images'}
      hasMany={custom?.hasMany ?? false}
    />
  )
}
