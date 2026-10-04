import { loader } from 'fumadocs-core/source'
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema'
import { defineDocs } from 'fumadocs-mdx/macro'
import { z } from 'zod'

import { i18n } from './i18n'

// User documentation: content/docs/<locale>/**, ordered by meta.json files.
const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema,
  },
  meta: {
    schema: metaSchema,
  },
})

export const docsSource = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  i18n,
})

// Standalone pages rendered with the marketing layout: the landing page (index.mdx), about, legal...
const pages = defineDocs({
  dir: 'content/pages',
  docs: {
    schema: pageSchema,
  },
  meta: {
    schema: metaSchema,
  },
})

export const pagesSource = loader({
  baseUrl: '/',
  source: pages.toFumadocsSource(),
  i18n,
})

// Release notes. The frontmatter is the agent-readable half of an entry: `changes` lists every user-facing change,
// including the ones the prose leaves out. See .claude/skills/release-notes.
export const blogChangeSchema = z.object({
  type: z.enum([ 'new', 'improved', 'fixed', 'misc' ]),
  summary: z.string(),
  apps: z.array(z.string()).default([]),
  featured: z.boolean().optional(),
  illustrate: z.boolean().optional(),
})

const blog = defineDocs({
  dir: 'content/blog',
  docs: {
    schema: pageSchema.extend({
      date: z.coerce.date(),
      since: z.string().optional(),
      until: z.string().optional(),
      image: z.string().optional(),
      changes: z.array(blogChangeSchema).default([]),
    }),
  },
  meta: {
    schema: metaSchema,
  },
})

export const blogSource = loader({
  baseUrl: '/blog',
  source: blog.toFumadocsSource(),
  i18n,
})
