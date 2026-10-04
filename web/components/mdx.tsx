import defaultMdxComponents from 'fumadocs-ui/mdx'
import type { MDXComponents } from 'mdx/types'

// Components every MDX page gets without importing them: Fumadocs' defaults (Card, Cards, Callout, code blocks...).
// Anything else (HeroUI, ThemedImage, Steps) is imported explicitly by the page that uses it.
export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    ...components,
  } satisfies MDXComponents
}

export const useMDXComponents = getMDXComponents

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>
}
