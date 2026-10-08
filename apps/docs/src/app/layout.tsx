import "./globals.css"
import "@glinui/tokens/preferences.css"

import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import type { ReactNode } from "react"

import { DOCS_OPTIONS_KEY, DocsGlinProvider } from "@/components/customize/docs-glin-provider"
import { DocsShell } from "@/components/layout/docs-shell"
import { DocsDirectionProvider } from "@/lib/docs-direction"
import {
  DEFAULT_KEYWORDS,
  DEFAULT_OG_IMAGE_PATH,
  ORGANIZATION_GITHUB_URL,
  ORGANIZATION_HANDLE,
  ORGANIZATION_NAME,
  SITE_DESCRIPTION,
  SITE_LOCALE,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  createAbsoluteUrl,
  isLocalSiteUrl
} from "@/lib/seo"
import { getGlobalStructuredData } from "@/lib/structured-data"
import { getGlinConfigScript } from "@glinui/ui"
import { ThemeProvider } from "next-themes"

const inter = localFont({
  src: "./fonts/inter-var.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
  adjustFontFallback: "Arial"
})

const jetbrainsMono = localFont({
  src: "./fonts/jetbrains-mono-var.woff2",
  variable: "--font-jetbrains",
  weight: "100 800",
  display: "swap",
  preload: false,
  adjustFontFallback: false
})

const metadataBaseUrl = SITE_URL
const isLocal = isLocalSiteUrl(metadataBaseUrl)

export const metadata: Metadata = {
  metadataBase: new URL(metadataBaseUrl),
  applicationName: SITE_NAME,
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`
  },
  description: SITE_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  category: "technology",
  creator: ORGANIZATION_NAME,
  publisher: ORGANIZATION_NAME,
  authors: [{ name: ORGANIZATION_NAME, url: metadataBaseUrl }],
  referrer: "origin-when-cross-origin",
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "x-default": "/"
    }
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icon.png", type: "image/png", sizes: "192x192" }],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
    shortcut: ["/icon.png"]
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION,
    // Rendered only when the env var is set.
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined
  },
  openGraph: {
    type: "website",
    url: metadataBaseUrl,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: SITE_LOCALE,
    images: [
      {
        url: DEFAULT_OG_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: "Glin UI - Free, open-source design hub for the modern web"
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
  },
  robots: isLocal
    ? {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
          index: false,
          follow: false
        }
      }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1
        }
      },
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "black-translucent"
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0c12" }
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5
}

const rootStructuredData = getGlobalStructuredData()
const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: SITE_TITLE,
  description: SITE_DESCRIPTION,
  url: createAbsoluteUrl("/"),
  about: {
    "@type": "Organization",
    name: ORGANIZATION_NAME,
    sameAs: [ORGANIZATION_GITHUB_URL]
  }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Blocking theme script, runs before first paint to prevent light→dark flash */}
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("glinui-docs-theme")||"system";var d=t==="system"?window.matchMedia("(prefers-color-scheme:dark)").matches:t==="dark";if(d){document.documentElement.classList.add("dark");document.documentElement.style.colorScheme="dark"}else{document.documentElement.style.colorScheme="light"}}catch(e){}})()`
          }}
        />
        {/* Pre-paint Customize options (accent, radius, motion, ...) from localStorage */}
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: getGlinConfigScript(DOCS_OPTIONS_KEY) }}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rootStructuredData) }}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
        />
      </head>
      <body className="min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <DocsDirectionProvider>
            <DocsGlinProvider>
              <DocsShell>{children}</DocsShell>
            </DocsGlinProvider>
          </DocsDirectionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
