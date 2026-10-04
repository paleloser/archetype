'use client'

import { useEffect } from 'react'
import { BreadcrumbEntity, useBreadcrumbs } from './BreadcrumbsProvider'

/**
 * Tells the breadcrumbs the human friendly name of an entity in the current
 * path. Pages render it with data they already fetched, so the breadcrumbs
 * never call the API by themselves. Renders nothing.
 *
 * ```tsx
 * <BreadcrumbLabel entity='note' id={ note.id } label={ note.title } />
 * ```
 */
export default function BreadcrumbLabel({ entity, id, label }: { entity: BreadcrumbEntity, id?: string, label?: string }) {
  const { setLabel } = useBreadcrumbs()

  useEffect(() => {
    if (id && label) {
      setLabel(entity, id, label)
    }
  }, [ entity, id, label, setLabel ])

  return null
}
