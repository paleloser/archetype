'use client'

import { Breadcrumbs as HeroBreadcrumbs, RouterProvider, Skeleton } from '@heroui/react'
import { usePathname, useRouter } from 'next/navigation'
import { useMemo } from 'react'

import { useDictionary } from '@/lib/i18n/client'
import { BreadcrumbEntity, labelKey, useBreadcrumbs } from './BreadcrumbsProvider'
import breadcrumbsDictionary from './i18n'

export { default as BreadcrumbsProvider } from './BreadcrumbsProvider'
export { default as BreadcrumbLabel } from './BreadcrumbLabel'

type Texts = (typeof breadcrumbsDictionary)['es']

type Crumb = {
  path: string
  /** Static, translated label. */
  label?: string
  /** Entity whose name is provided by the page through `BreadcrumbLabel`. */
  entity?: { kind: BreadcrumbEntity, id: string }
}

/**
 * Maps the current path to its trail: one crumb per segment with a page of its own. Static segments are labelled from
 * the dictionary; dynamic ones (ids) take the name the page registers with `BreadcrumbLabel`. Segments without a page
 * of their own are skipped. Extend it as routes are added.
 */
function buildTrail(pathname: string, texts: Texts): Crumb[] {
  const segments = pathname.split('/').filter(Boolean)
  const trail: Crumb[] = [ { path: '/', label: texts.home } ]

  const [ first, second ] = segments

  if (first === 'profile') {
    trail.push({ path: '/profile', label: texts.profile })
  } else if (first === 'notes' && second) {
    trail.push({ path: `/notes/${second}`, entity: { kind: 'note', id: second } })
  }

  return trail
}

export default function Breadcrumbs({ className }: { className?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const texts = useDictionary(breadcrumbsDictionary)
  const { labels, queries } = useBreadcrumbs()

  const trail = useMemo(
    () => buildTrail(pathname, texts),
    [ pathname, texts ]
  )

  // The home page is the root of every trail, a lone crumb pointing to itself adds nothing
  if (trail.length < 2) {
    return null
  }

  const hrefFor = (path: string) => queries[path] ? `${path}?${queries[path]}` : path

  return (
    <RouterProvider 
      navigate={ (href) => router.push(href) }>
      <HeroBreadcrumbs 
        aria-label={ texts.ariaLabel } 
        className={ `mt-4 flex-wrap gap-y-1 ${className || ''}` }>
        {
          trail.map((crumb, i) => {
            const label = crumb.entity ? labels[labelKey(crumb.entity.kind, crumb.entity.id)] : crumb.label
            const isLast = i === trail.length - 1

            return (
              <HeroBreadcrumbs.Item
                key={ crumb.path }
                href={ isLast ? undefined : hrefFor(crumb.path) }>
                {
                  label
                    ? <span className='inline-block max-w-48 truncate align-bottom' title={ label }>{ label }</span>
                    : <Skeleton className='h-4 w-20 rounded-md' aria-label={ texts.loading } />
                }
              </HeroBreadcrumbs.Item>
            )
          })
        }
      </HeroBreadcrumbs>
    </RouterProvider>
  )
}
