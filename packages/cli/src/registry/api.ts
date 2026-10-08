import { REGISTRY_URL } from "./constants.js"
import { z } from "zod"
import type { ItemProvenance } from "../utils/notices.js"

export type RegistryItem = {
  name: string
  type: string
  description?: string
  dependencies?: string[]
  devDependencies?: string[]
  registryDependencies?: string[]
  /** Version ranges for entries in dependencies (additive, optional). */
  dependencyVersions?: Record<string, string>
  /** Present for components adapted from other open source projects. */
  provenance?: ItemProvenance
  files: Array<{
    path: string
    content: string
    type?: string
  }>
}

export type RegistryIndex = Array<{
  name: string
  type: string
  description?: string
  dependencies?: string[]
  registryDependencies?: string[]
}>

const registryFileSchema = z.object({
  path: z.string(),
  content: z.string(),
  type: z.string().optional()
})

const provenanceSchema = z
  .object({
    sourceId: z.string(),
    sourceName: z.string(),
    upstreamUrl: z.string(),
    license: z.string(),
    spdx: z.string(),
    copyright: z.string(),
    commit: z.string(),
    adaptedFrom: z.string().optional(),
    licenseText: z.string().optional(),
    noticeUrl: z.string().optional()
  })
  .passthrough()

const registryItemSchema = z.object({
  name: z.string(),
  type: z.string(),
  description: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  dependencyVersions: z.record(z.string()).optional(),
  provenance: provenanceSchema.optional(),
  files: z.array(registryFileSchema)
})

const registryIndexItemSchema = z.object({
  name: z.string(),
  type: z.string(),
  description: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional()
})

const registryIndexSchema = z.array(registryIndexItemSchema)

const DEFAULT_TIMEOUT_MS = 8000
const DEFAULT_RETRIES = 2
const DEFAULT_RETRY_DELAY_MS = 250

let lastRegistryErrorMessage: string | null = null

function readIntEnv(name: string, fallback: number) {
  const value = process.env[name]
  if (!value) return fallback
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback
}

const REQUEST_TIMEOUT_MS = readIntEnv("GLINUI_FETCH_TIMEOUT_MS", DEFAULT_TIMEOUT_MS)
const REQUEST_RETRIES = readIntEnv("GLINUI_FETCH_RETRIES", DEFAULT_RETRIES)
const REQUEST_RETRY_DELAY_MS = readIntEnv("GLINUI_FETCH_RETRY_DELAY_MS", DEFAULT_RETRY_DELAY_MS)

function delay(ms: number) {
  if (ms <= 0) {
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function parseNetworkErrorMessage(error: unknown) {
  if (error instanceof Error) {
    if (error.name === "AbortError") {
      return `registry request timed out after ${REQUEST_TIMEOUT_MS}ms`
    }

    const message = error.message.trim()
    if (message.length > 0) {
      return message
    }
  }

  return "network request failed"
}

function setRegistryError(message: string) {
  lastRegistryErrorMessage = message
}

function clearRegistryError() {
  lastRegistryErrorMessage = null
}

async function fetchRegistryJson(url: string) {
  let lastError: string | null = null

  for (let attempt = 0; attempt <= REQUEST_RETRIES; attempt += 1) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      controller.abort()
    }, REQUEST_TIMEOUT_MS)

    try {
      const response = await fetch(url, { signal: controller.signal })

      if (!response.ok) {
        const statusMessage = `registry request failed (${response.status} ${response.statusText})`
        const retryable = response.status >= 500 && attempt < REQUEST_RETRIES

        if (!retryable) {
          return {
            payload: null,
            error: statusMessage
          }
        }

        lastError = statusMessage
        await delay(REQUEST_RETRY_DELAY_MS * (attempt + 1))
        continue
      }

      const payload = await response.json()
      return {
        payload,
        error: null
      }
    } catch (error) {
      lastError = parseNetworkErrorMessage(error)
      if (attempt < REQUEST_RETRIES) {
        await delay(REQUEST_RETRY_DELAY_MS * (attempt + 1))
        continue
      }
    } finally {
      clearTimeout(timeoutId)
    }
  }

  return {
    payload: null,
    error: lastError ?? "unknown fetch error"
  }
}

function validatePayload<T>(schema: z.ZodSchema<T>, payload: unknown) {
  const parsed = schema.safeParse(payload)
  if (!parsed.success) {
    return {
      data: null,
      error: parsed.error.issues[0]?.message ?? "invalid payload schema"
    }
  }

  return {
    data: parsed.data,
    error: null
  }
}

export function getLastRegistryErrorMessage() {
  return lastRegistryErrorMessage
}

export async function fetchRegistryIndex(): Promise<RegistryIndex | null> {
  clearRegistryError()

  const url = `${REGISTRY_URL}/index.json`
  const result = await fetchRegistryJson(url)
  if (result.error || !result.payload) {
    setRegistryError(result.error ?? "failed to load registry index")
    return null
  }

  const validated = validatePayload(registryIndexSchema, result.payload)
  if (validated.error || !validated.data) {
    setRegistryError(`invalid registry index payload: ${validated.error ?? "unknown schema error"}`)
    return null
  }

  return validated.data
}

export async function fetchRegistryItem(name: string): Promise<RegistryItem | null> {
  clearRegistryError()

  const url = `${REGISTRY_URL}/items/${name}.json`
  const result = await fetchRegistryJson(url)
  if (result.error || !result.payload) {
    setRegistryError(result.error ?? `failed to load registry item \"${name}\"`)
    return null
  }

  const validated = validatePayload(registryItemSchema, result.payload)
  if (validated.error || !validated.data) {
    setRegistryError(`invalid registry item payload for \"${name}\": ${validated.error ?? "unknown schema error"}`)
    return null
  }

  return validated.data
}
