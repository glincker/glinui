import type { Metadata } from "next"

import HomePage from "@/components/home/home-page"
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
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Glin UI?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Glin UI is a design hub for the modern web: accessible React components, free animations, OKLCH colors, design tokens and AI-ready prompts. It ships 100+ components with multiple surface variants (default, glass, liquid, matte, glow) and full dark mode support."
      }
    },
    {
      "@type": "Question",
      name: "How does Glin UI compare to shadcn/ui?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "shadcn/ui provides unstyled Radix primitives you style yourself. Glin UI builds on the same Radix foundation but ships a complete glass design system with 7 surface variants per component, 5 elevation levels, SVG refraction physics, and production-ready token infrastructure."
      }
    },
    {
      "@type": "Question",
      name: "Is Glin UI accessible?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Every component is built on Radix UI primitives with WCAG AA contrast ratios, full keyboard navigation, screen reader support, and prefers-reduced-motion fallbacks."
      }
    },
    {
      "@type": "Question",
      name: "Can I use Glin UI with my existing Tailwind project?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. Glin UI uses Tailwind CSS v4 with CSS custom properties. Install the packages, import the token stylesheet, and start using components alongside your existing Tailwind classes."
      }
    },
    {
      "@type": "Question",
      name: "Does Glin UI support dark mode?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Every component, token, and surface variant ships with full dark mode support out of the box. The glass variant adapts luminance, blur intensity, and shadow depth between light and dark themes automatically."
      }
    }
  ]
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
