import type { Metadata } from "next"

import HomePage from "@/components/home/home-page"
import { FAQ } from "@/components/home/landing-facts"
import {
  DEFAULT_OG_IMAGE_PATH,
  DEFAULT_KEYWORDS,
  ORGANIZATION_HANDLE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  createAbsoluteUrl
} from "@/lib/seo"

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: [
    ...DEFAULT_KEYWORDS,
    "shadcn ui alternative",
    "shadcn alternative",
    "glass ui components",
    "react glassmorphism components"
  ],
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "x-default": "/"
    }
  },
  openGraph: {
    type: "website",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    url: "/",
    images: [
      {
        url: DEFAULT_OG_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: "GLINUI, a design hub of React components, animations, colors, tokens and AI prompts"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE_PATH],
    creator: ORGANIZATION_HANDLE,
    site: ORGANIZATION_HANDLE
  }
}

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a }
  }))
}

const homepageBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: createAbsoluteUrl("/")
    }
  ]
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageBreadcrumb) }}
      />
      <HomePage />
    </>
  )
}
