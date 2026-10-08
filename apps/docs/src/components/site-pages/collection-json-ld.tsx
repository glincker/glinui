import { createAbsoluteUrl } from "@/lib/seo"

export type CollectionItem = { name: string; path: string }

/** CollectionPage, ItemList and BreadcrumbList JSON-LD for hub pages. */
export function CollectionJsonLd({ name, description, path, items }: { name: string; description: string; path: string; items: CollectionItem[] }) {
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name,
      description,
      url: createAbsoluteUrl(path),
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: items.length,
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          url: createAbsoluteUrl(item.path)
        }))
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Glin UI", item: createAbsoluteUrl("/") },
        { "@type": "ListItem", position: 2, name, item: createAbsoluteUrl(path) }
      ]
    }
  ]
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
