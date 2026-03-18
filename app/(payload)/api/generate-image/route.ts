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
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
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
