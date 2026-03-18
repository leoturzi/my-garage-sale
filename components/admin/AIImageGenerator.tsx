'use client'

import React, { useCallback, useRef, useState } from 'react'
import { Drawer, DrawerToggler, useField, toast, Button } from '@payloadcms/ui'
import { useDrawerSlug } from '@payloadcms/ui'

type Status = 'idle' | 'generating' | 'saving'

interface ImageFile {
  file: File
  preview: string
  base64: string
  mimeType: string
}

interface Props {
  targetFieldPath?: string
  hasMany?: boolean
}

function fileToBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.split(',')[1]
      resolve({ base64, mimeType: file.type })
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function DropZone({
  label,
  image,
  onFile,
  onRemove,
}: {
  label: string
  image: ImageFile | null
  onFile: (file: File) => void
  onRemove: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file?.type.startsWith('image/')) onFile(file)
    },
    [onFile],
  )

  return (
    <div className="ai-image-generator__dropzone-wrapper">
      <label className="ai-image-generator__dropzone-label">{label}</label>
      {image ? (
        <div className="ai-image-generator__preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.preview} alt={label} />
          <button
            type="button"
            className="ai-image-generator__remove-btn"
            onClick={onRemove}
          >
            Remove
          </button>
        </div>
      ) : (
        <div
          className={`ai-image-generator__dropzone ${dragOver ? 'ai-image-generator__dropzone--active' : ''}`}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <p>Drop image here or click to browse</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) onFile(file)
            }}
          />
        </div>
      )}
    </div>
  )
}

export function AIImageGenerator({ targetFieldPath, hasMany }: Props) {
  const drawerSlug = useDrawerSlug('ai-image-generator')
  const { setValue, value } = useField<string | string[]>({ path: targetFieldPath ?? '_ai_noop' })

  const [modelImage, setModelImage] = useState<ImageFile | null>(null)
  const [productImage, setProductImage] = useState<ImageFile | null>(null)
  const [generatedImage, setGeneratedImage] = useState<{
    base64: string
    mimeType: string
    preview: string
  } | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [altText, setAltText] = useState('')

  const handleFile = useCallback(
    async (file: File, setter: React.Dispatch<React.SetStateAction<ImageFile | null>>) => {
      const { base64, mimeType } = await fileToBase64(file)
      setter({
        file,
        preview: URL.createObjectURL(file),
        base64,
        mimeType,
      })
    },
    [],
  )

  const generate = useCallback(async () => {
    if (!modelImage || !productImage) return
    setStatus('generating')
    setGeneratedImage(null)

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          modelImage: modelImage.base64,
          productImage: productImage.base64,
          modelMimeType: modelImage.mimeType,
          productMimeType: productImage.mimeType,
        }),
      })

      const data = await res.json()
      if (!res.ok || data.error) {
        toast.error(data.error || 'Generation failed')
        return
      }

      setGeneratedImage({
        base64: data.image,
        mimeType: data.mimeType,
        preview: `data:${data.mimeType};base64,${data.image}`,
      })
    } catch (err) {
      toast.error('Network error')
      console.error(err)
    } finally {
      setStatus('idle')
    }
  }, [modelImage, productImage])

  const accept = useCallback(async () => {
    if (!generatedImage) return
    setStatus('saving')

    try {
      const byteChars = atob(generatedImage.base64)
      const byteArray = new Uint8Array(byteChars.length)
      for (let i = 0; i < byteChars.length; i++) {
        byteArray[i] = byteChars.charCodeAt(i)
      }
      const blob = new Blob([byteArray], { type: generatedImage.mimeType })
      const ext = generatedImage.mimeType === 'image/png' ? 'png' : 'jpg'
      const file = new File([blob], `ai-generated-${Date.now()}.${ext}`, {
        type: generatedImage.mimeType,
      })

      const formData = new FormData()
      formData.append('file', file)
      formData.append('_payload', JSON.stringify({ alt: altText.trim() }))

      const res = await fetch('/api/media', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      const doc = await res.json()
      if (!res.ok || !doc.doc?.id) {
        toast.error('Failed to save image')
        return
      }

      const mediaId = doc.doc.id
      if (targetFieldPath) {
        if (hasMany) {
          const current = Array.isArray(value) ? value : value ? [value] : []
          setValue([...current, mediaId])
        } else {
          setValue(mediaId)
        }
      }

      toast.success('Image saved!')
      setModelImage(null)
      setProductImage(null)
      setGeneratedImage(null)
      setAltText('')
    } catch (err) {
      toast.error('Failed to save image')
      console.error(err)
    } finally {
      setStatus('idle')
    }
  }, [generatedImage, hasMany, value, setValue, altText])

  return (
    <div className="ai-image-generator">
      <DrawerToggler slug={drawerSlug} className="btn btn--style-secondary btn--size-small">
        Generate with AI
      </DrawerToggler>

      <Drawer slug={drawerSlug} title="AI Image Generator" gutter={true}>
        <div className="ai-image-generator__content">
          <div className="ai-image-generator__grid">
            <DropZone
              label="Model Image (reference scene)"
              image={modelImage}
              onFile={(f) => handleFile(f, setModelImage)}
              onRemove={() => setModelImage(null)}
            />
            <DropZone
              label="Product Photo"
              image={productImage}
              onFile={(f) => handleFile(f, setProductImage)}
              onRemove={() => setProductImage(null)}
            />
          </div>

          <div className="ai-image-generator__actions">
            <Button
              onClick={generate}
              disabled={!modelImage || !productImage || status === 'generating'}
            >
              {status === 'generating' ? 'Generating...' : 'Generate'}
            </Button>
          </div>

          {generatedImage && (
            <div className="ai-image-generator__result">
              <label className="ai-image-generator__dropzone-label">Result</label>
              <div className="ai-image-generator__result-image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={generatedImage.preview} alt="AI generated result" />
              </div>
              <div className="ai-image-generator__alt-field">
                <label className="ai-image-generator__dropzone-label" htmlFor="ai-alt-text">Alt text</label>
                <input
                  id="ai-alt-text"
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Describe the image..."
                  className="ai-image-generator__alt-input"
                />
              </div>
              <div className="ai-image-generator__result-actions">
                <Button
                  onClick={accept}
                  disabled={status === 'saving' || !altText.trim()}
                >
                  {status === 'saving' ? 'Saving...' : 'Accept'}
                </Button>
                <Button
                  buttonStyle="secondary"
                  onClick={generate}
                  disabled={status === 'generating'}
                >
                  Regenerate
                </Button>
              </div>
            </div>
          )}
        </div>
      </Drawer>
    </div>
  )
}
