import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { primitiveComponentIds } from "@/lib/primitives"

/**
 * Legacy short URLs (/docs/components/<id>) for primitives. On the deployed site Cloudflare serves
 * public/_redirects 301s first; this route makes the same links resolve in local dev and as a static fallback.
 * The segment is named `implementation` only because it must match the sibling [implementation]/[component] route.
 */
export const dynamicParams = false

export const metadata: Metadata = {
  robots: { index: false, follow: true }
}

export function generateStaticParams() {
  return primitiveComponentIds.map((id) => ({ implementation: id }))
}

export default async function LegacyComponentRedirect({
  params
}: {
  params: Promise<{ implementation: string }>
}) {
  const { implementation: id } = await params
  redirect(`/docs/components/radix/${id}`)
}
