import { GoogleGenAI } from '@google/genai'
import { getPayload } from 'payload'
import config from '@payload-config'
import { headers as nextHeaders } from 'next/headers'

const DEFAULT_PROMPT =
  'Place the product from the second image naturally into the scene from the first image. Match the lighting, shadows, perspective, color grading, and depth of field. The product should look like it was originally photographed in this setting.'

export async function POST(req: Request) {
  const payload = await getPayload({ config })

  const hdrs = await nextHeaders()
  const { user } = await payload.auth({ headers: hdrs })
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return Response.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 })
  }

  const body = await req.json()
  const { modelImage, productImage, modelMimeType, productMimeType, prompt } = body

  if (!modelImage || !productImage) {
    return Response.json({ error: 'Both modelImage and productImage are required' }, { status: 400 })
  }

  // Validate prompt length
  if (prompt && typeof prompt === 'string' && prompt.length > 1000) {
    return Response.json({ error: 'Prompt must be 1000 characters or less' }, { status: 400 })
  }

  // Validate MIME types
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
  if (modelMimeType && !allowedMimeTypes.includes(modelMimeType)) {
    return Response.json({ error: 'Invalid modelMimeType' }, { status: 400 })
  }
  if (productMimeType && !allowedMimeTypes.includes(productMimeType)) {
    return Response.json({ error: 'Invalid productMimeType' }, { status: 400 })
  }

  // Validate base64 payload size (10MB per image)
  const maxBase64Size = 10 * 1024 * 1024 * 1.37 // ~10MB in base64
  if (modelImage.length > maxBase64Size || productImage.length > maxBase64Size) {
    return Response.json({ error: 'Image payload must not exceed 10MB' }, { status: 400 })
  }

  try {
    const ai = new GoogleGenAI({ apiKey })

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt || DEFAULT_PROMPT },
            { inlineData: { mimeType: modelMimeType || 'image/jpeg', data: modelImage } },
            { inlineData: { mimeType: productMimeType || 'image/jpeg', data: productImage } },
          ],
        },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    })

    const parts = response.candidates?.[0]?.content?.parts
    if (!parts) {
      return Response.json({ error: 'No response from Gemini' }, { status: 502 })
    }

    const imagePart = parts.find((p) => p.inlineData)
    if (!imagePart?.inlineData) {
      const textPart = parts.find((p) => p.text)
      return Response.json(
        { error: textPart?.text || 'No image generated' },
        { status: 502 },
      )
    }

    return Response.json({
      image: imagePart.inlineData.data,
      mimeType: imagePart.inlineData.mimeType || 'image/png',
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Gemini API error:', message)
    return Response.json({ error: message }, { status: 502 })
  }
}
