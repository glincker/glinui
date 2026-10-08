import type { BrandName } from "@/components/brand/brands"

/**
 * AI tools GLINUI can hand a prompt to.
 *
 * `prefill` targets accept the (short) prompt in the URL. `copy-then-open` targets have no
 * documented prefill parameter, so we copy the full prompt and open the tool.
 * Deep links are only ever built from the short prompt, which holds the public markdown URL
 * and the component name. Never put secrets or user data in these URLs.
 *
 * `verified` means the format is documented by the vendor. Unverified prefill links are
 * community-documented and may change, so they also copy the prompt as a safety net.
 * Checked 2026-10-07.
 */

export type AiTargetMode = "prefill" | "copy-then-open"

export type AiTarget = {
  id: string
  label: string
  /** thesvg slug from brands.ts, or null for the generic target. */
  brandSlug: BrandName | null
  mode: AiTargetMode
  /** Landing URL used by copy-then-open (and as a fallback). Null means copy only. */
  openUrl: string | null
  /** Build the prefilled deep link, or null when this target has none. */
  buildUrl: (shortPrompt: string) => string | null
  /** Longest encoded URL we will open before falling back to copy-then-open. */
  maxUrlLength: number
  /** Also copy the full prompt when opening a prefill link (unverified links). */
  alsoCopy: boolean
  verified: boolean
  /** Vendor documentation (or the best public reference) for the link format. */
  docsUrl: string
  /** Optional copyable CLI command for tools that run in a terminal. */
  cliSnippet?: (shortPrompt: string) => string
}

const DEFAULT_MAX_URL = 2000

function withQuery(base: string, key: string, value: string): string {
  return `${base}?${key}=${encodeURIComponent(value)}`
}

function shellQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`
}

export const AI_TARGETS: readonly AiTarget[] = [
  {
    id: "chatgpt",
    label: "ChatGPT",
    brandSlug: "openai",
    mode: "prefill",
    openUrl: "https://chatgpt.com/",
    // Source: OpenAI community thread "URL query param to open chat with initial message"
    // https://community.openai.com/t/url-query-param-to-open-chat-with-initial-message/64167
    buildUrl: (p) => withQuery("https://chatgpt.com/", "q", p),
    maxUrlLength: DEFAULT_MAX_URL,
    alsoCopy: true,
    verified: false,
    docsUrl: "https://community.openai.com/t/url-query-param-to-open-chat-with-initial-message/64167"
  },
  {
    id: "claude",
    label: "Claude",
    brandSlug: "claude",
    mode: "prefill",
    openUrl: "https://claude.ai/new",
    // Source: community-documented. A regression report (claude-code issue 8827, Oct 2025) says
    // the parameter stopped working for a while, so we also copy the prompt as a safety net.
    // https://github.com/anthropics/claude-code/issues/8827
    buildUrl: (p) => withQuery("https://claude.ai/new", "q", p),
    maxUrlLength: DEFAULT_MAX_URL,
    alsoCopy: true,
    verified: false,
    docsUrl: "https://github.com/anthropics/claude-code/issues/8827"
  },
  {
    id: "gemini",
    label: "Gemini",
    brandSlug: "gemini",
    mode: "copy-then-open",
    openUrl: "https://gemini.google.com/app",
    // No documented prefill parameter. Source: Google AI developer forum thread
    // https://discuss.ai.google.dev/t/can-the-gemini-api-enable-a-website-to-open-the-gemini-site-with-a-text-prompt-pre-filled-by-that-website/73828
    buildUrl: () => null,
    maxUrlLength: DEFAULT_MAX_URL,
    alsoCopy: true,
    verified: true,
    docsUrl: "https://gemini.google.com/app"
  },
  {
    id: "grok",
    label: "Grok",
    brandSlug: "grok",
    mode: "prefill",
    openUrl: "https://grok.com/",
    // Source: community-documented (u2l.ai prompt link generator). No vendor docs.
    buildUrl: (p) => withQuery("https://grok.com/", "q", p),
    maxUrlLength: DEFAULT_MAX_URL,
    alsoCopy: true,
    verified: false,
    docsUrl: "https://u2l.ai/tools/grok-prompt-link-generator"
  },
  {
    id: "perplexity",
    label: "Perplexity",
    brandSlug: "perplexity",
    mode: "prefill",
    openUrl: "https://www.perplexity.ai/",
    // Source: community-documented (u2l.ai prompt link generator). No vendor docs.
    buildUrl: (p) => withQuery("https://www.perplexity.ai/search", "q", p),
    maxUrlLength: DEFAULT_MAX_URL,
    alsoCopy: true,
    verified: false,
    docsUrl: "https://u2l.ai/tools/perplexity-prompt-link-generator"
  },
  {
    id: "v0",
    label: "v0",
    brandSlug: "v0",
    mode: "prefill",
    openUrl: "https://v0.app/chat",
    // Source: Vercel community, staff confirm ?q= (auto-submits on load)
    // https://community.vercel.com/t/query-parameters-in-v0-preventing-auto-submit/24457
    buildUrl: (p) => withQuery("https://v0.app/chat", "q", p),
    maxUrlLength: DEFAULT_MAX_URL,
    alsoCopy: true,
    verified: false,
    docsUrl: "https://community.vercel.com/t/query-parameters-in-v0-preventing-auto-submit/24457"
  },
  {
    id: "cursor",
    label: "Cursor",
    brandSlug: "cursor",
    mode: "prefill",
    openUrl: "https://cursor.com/",
    // Source: official Cursor docs, prompt deeplinks. Web: https://cursor.com/link/prompt?text=
    // App: cursor://anysphere.cursor-deeplink/prompt?text= . Max 10,000 characters encoded.
    // https://cursor.com/docs/integrations/deeplinks
    buildUrl: (p) => withQuery("https://cursor.com/link/prompt", "text", p),
    maxUrlLength: 10000,
    alsoCopy: false,
    verified: true,
    docsUrl: "https://cursor.com/docs/integrations/deeplinks"
  },
  {
    id: "copilot",
    label: "GitHub Copilot",
    brandSlug: "github-copilot",
    mode: "prefill",
    openUrl: "https://github.com/copilot",
    // Source: GitHub Docs, "Asking GitHub Copilot questions in GitHub" (?prompt= example)
    // https://docs.github.com/en/copilot/how-tos/copilot-on-github/chat-with-copilot/chat-in-github
    buildUrl: (p) => withQuery("https://github.com/copilot", "prompt", p),
    maxUrlLength: DEFAULT_MAX_URL,
    alsoCopy: false,
    verified: true,
    docsUrl: "https://docs.github.com/en/copilot/how-tos/copilot-on-github/chat-with-copilot/chat-in-github"
  },
  {
    id: "codex",
    label: "OpenAI Codex",
    brandSlug: "codex",
    mode: "copy-then-open",
    openUrl: "https://chatgpt.com/codex",
    // No documented URL prefill. CLI accepts an initial prompt: codex "prompt".
    // https://developers.openai.com/codex/cli
    buildUrl: () => null,
    maxUrlLength: DEFAULT_MAX_URL,
    alsoCopy: true,
    verified: true,
    docsUrl: "https://developers.openai.com/codex/cli",
    cliSnippet: (p) => `codex ${shellQuote(p)}`
  },
  {
    id: "windsurf",
    label: "Windsurf",
    brandSlug: "windsurf",
    mode: "copy-then-open",
    openUrl: "https://windsurf.com/",
    // No documented prompt deeplink. Copy, then paste into Cascade.
    buildUrl: () => null,
    maxUrlLength: DEFAULT_MAX_URL,
    alsoCopy: true,
    verified: true,
    docsUrl: "https://docs.windsurf.com/"
  },
  {
    id: "any",
    label: "Any AI (copy)",
    brandSlug: null,
    mode: "copy-then-open",
    openUrl: null,
    buildUrl: () => null,
    maxUrlLength: DEFAULT_MAX_URL,
    alsoCopy: true,
    verified: true,
    docsUrl: "https://glinui.com/docs/ai"
  }
]

export function getAiTarget(id: string): AiTarget | undefined {
  return AI_TARGETS.find((target) => target.id === id)
}

export type AiAction =
  | { kind: "prefill"; url: string; copy: boolean }
  | { kind: "copy-then-open"; url: string | null; copy: true }

/**
 * Decide what a click on a target does. Prefill targets fall back to copy-then-open when the
 * encoded URL would exceed the target's limit.
 */
export function resolveAiAction(target: AiTarget, shortPrompt: string): AiAction {
  if (target.mode === "prefill") {
    const url = target.buildUrl(shortPrompt)
    if (url && url.length <= target.maxUrlLength) {
      return { kind: "prefill", url, copy: target.alsoCopy }
    }
  }
  return { kind: "copy-then-open", url: target.openUrl, copy: true }
}

/** Short badge text for menus and the docs grid. */
export function aiTargetHint(target: AiTarget): string {
  if (target.openUrl === null) return "copies prompt"
  return target.mode === "prefill" ? "prefilled" : "copies prompt"
}
