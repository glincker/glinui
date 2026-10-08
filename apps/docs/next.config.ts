import type { NextConfig } from "next"
import createMDX from "@next/mdx"
import { rehypeAutolinkHeadings, rehypeSlugifyHeadings } from "./mdx-plugins"

const nextConfig: NextConfig = {
  output: "export",
  // Allows `NEXT_DIST_DIR=.next-build next build` beside a running dev server without clobbering its cache.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  reactStrictMode: true,
  trailingSlash: false,
  transpilePackages: ["@glinui/ui", "@glinui/registry", "@glinui/tokens", "@glinui/motion"],
  experimental: {
    // Rewrite barrel imports to direct module imports so a route only compiles the components and icons it uses.
    optimizePackageImports: ["@glinui/ui", "@glinui/motion", "@phosphor-icons/react"]
  }
}

const withMDX = createMDX({
  options: {
    rehypePlugins: [rehypeSlugifyHeadings, rehypeAutolinkHeadings]
  }
})

export default withMDX(nextConfig)
