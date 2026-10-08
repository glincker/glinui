"use client"

// Client wrappers so signature MDX pages (server components) can render the S4 showcase demos.
import type { ComponentId } from "@/lib/primitives"
import { ExampleBlock } from "@/components/docs/example-block"
import { ComponentHero } from "@/components/docs/component-hero"
import { bgExamples } from "@/components/demos/s4-backgrounds"
import { bgExtraExamples } from "@/components/demos/s4-bg-extra"
import { typeExamples } from "@/components/demos/s4-type"

const all = { ...bgExamples, ...bgExtraExamples, ...typeExamples }

export function S4Hero({ id, title }: { id: string; title: string }) {
  const example = all[id][0]
  return (
    <ComponentHero componentId={id as ComponentId} title={title} stage="lg" code={example.code}>
      {example.render}
    </ComponentHero>
  )
}

export function S4Example({ id, index }: { id: string; index: number }) {
  const example = all[id][index]
  return <ExampleBlock code={example.code}>{example.render}</ExampleBlock>
}
