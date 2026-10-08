"use client"

import { useCallback, useEffect, useState } from "react"

import { galleryCategoryOrder, galleryTagOptions } from "./gallery-types"
import type { GalleryCategory, GalleryTag } from "./gallery-types"

export type GalleryUrlState = {
  category: GalleryCategory | "All"
  tags: GalleryTag[]
  family: string | null
}

const INITIAL: GalleryUrlState = { category: "All", tags: [], family: null }
const tagIds: readonly string[] = galleryTagOptions.map((option) => option.id)

export function parseGalleryUrl(search: string): GalleryUrlState {
  const params = new URLSearchParams(search)
  const category = params.get("category")
  const tags = (params.get("tag") ?? "")
    .split(",")
    .filter((tag): tag is GalleryTag => tagIds.includes(tag))
  const family = params.get("family")
  return {
    category: galleryCategoryOrder.find((id) => id === category) ?? "All",
    tags: Array.from(new Set(tags)),
    family: family && /^[a-z0-9-]+$/.test(family) ? family : null
  }
}

export function serializeGalleryUrl(state: GalleryUrlState): string {
  const params = new URLSearchParams()
  if (state.category !== "All") params.set("category", state.category)
  if (state.tags.length > 0) params.set("tag", state.tags.join(","))
  if (state.family) params.set("family", state.family)
  const text = params.toString()
  return text ? `?${text}` : ""
}

/**
 * Category, tag and family filters mirrored to `?category=&tag=&family=`.
 * Reads window.location in an effect so it is safe under static export (no Suspense needed).
 */
export function useGalleryUrlState(): [GalleryUrlState, (next: GalleryUrlState) => void] {
  const [state, setState] = useState<GalleryUrlState>(INITIAL)

  useEffect(() => {
    setState(parseGalleryUrl(window.location.search))
    const onPop = () => setState(parseGalleryUrl(window.location.search))
    window.addEventListener("popstate", onPop)
    return () => window.removeEventListener("popstate", onPop)
  }, [])

  const update = useCallback((next: GalleryUrlState) => {
    setState(next)
    const url = `${window.location.pathname}${serializeGalleryUrl(next)}${window.location.hash}`
    window.history.replaceState(window.history.state, "", url)
  }, [])

  return [state, update]
}
