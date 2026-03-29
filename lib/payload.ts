import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { Payload } from 'payload'

let payloadCache: Promise<Payload> | null = null

export const getPayloadClient = (): Promise<Payload> => {
  if (!payloadCache) {
    payloadCache = getPayload({ config: configPromise })
  }
  return payloadCache
}
