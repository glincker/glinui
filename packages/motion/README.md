# @glinui/motion

Animation presets for Glin UI. CSS keyframe definitions, scroll-linked animations, stagger utilities, and gesture helpers.

## Install

```bash
npm install @glinui/motion
```

## Usage

```tsx
import { fadeIn, slideUp, glassHover } from "@glinui/motion"

// Use with inline styles or animation libraries
const animation = fadeIn({ duration: 300, delay: 100 })
```

## Animation engines

The `css` engine (Web Animations API plus IntersectionObserver) and the static engine used when motion is off are built in. They have zero dependencies. The `motion` and `gsap` engines are opt-in, so a default install never pulls in or bundles either library.

```bash
pnpm add motion   # optional, for the motion engine
pnpm add gsap     # optional, for the gsap engine
```

```ts
// once, at your app entry
import "@glinui/motion/register/motion"
import "@glinui/motion/register/gsap"
```

Manual registration is also available:

```ts
import { registerEngine } from "@glinui/motion"
import { gsapEngine } from "@glinui/motion/engines/gsap"

registerEngine("gsap", gsapEngine)
```

If an engine is selected but was never registered, `resolveEngine` falls back to `css` and logs a one-time warning in development telling you which import to add. GSAP is a separate dependency under GreenSock's own license. It is not bundled or redistributed by Glin UI.

## Modules

- **Presets**, `fadeIn`, `slideUp`, `scaleIn`, `glassHover`, `spotlightPulse`
- **Stagger**, Utilities for staggered entrance animations
- **Scroll-linked**, Scroll-driven animation helpers
- **Gestures**, Hover, press, and drag interaction presets
- **View Transitions**, View Transition API utilities

## Documentation

[glinui.com/docs/motion](https://glinui.com/docs/motion)

## License

MIT
