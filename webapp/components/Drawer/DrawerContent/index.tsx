import NavGroup from './NavGroup'
import { ListBox, Separator } from '@heroui/react'
import { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { At, Book, FileText } from '@gravity-ui/icons'
import React from 'react'

import { contactEmail, siteUrl } from '@/lib/constants'
import { useDictionary } from '@/lib/i18n/client'
import drawerContentDictionary from './i18n'

export type MenuItemGroup = {
  children: MenuItem[]
  id: string
  title?: string
  type?: 'group'
}

export type MenuItem = {
  disabled?: boolean
  external?: boolean
  icon?: React.ReactNode
  id: string
  target?: string
  title: string
  description?: string,
  type: 'collapse' | 'item'
  url: string,
  unCacheable?: boolean,
}

// The navigation: one group per area of the product, then the resources group. Each item has an icon, a title and a
// one-line description. Filter groups by the user's role here when the product has several.
function menuItemGroups(texts: (typeof drawerContentDictionary)['es']): MenuItemGroup[] {
  return [
    {
      id: 'main',
      title: texts.mainGroupTitle,
      children: [
        {
          id: 'notes',
          title: texts.notesTitle,
          description: texts.notesDescription,
          type: 'item',
          url: '/',
          icon: <FileText className='size-4 shrink-0 text-muted' />
        },
      ],
    },
    {
      id: 'resources',
      title: texts.resourcesGroupTitle,
      children: [
        {
          id: 'docs',
          title: texts.docsTitle,
          description: texts.docsDescription,
          type: 'item',
          url: `${siteUrl}/docs`,
          target: '_blank',
          icon: <Book className='size-4 shrink-0 text-muted' />
        },
        {
          id: 'contact',
          title: texts.supportTitle,
          description: texts.supportDescription,
          type: 'item',
          url: `mailto:${contactEmail}`,
          target: '_blank',
          icon: <At className='size-4 shrink-0 text-muted' />
        },
      ]
    }
  ]
}

function calculateOpenItem(itemGroups: MenuItemGroup[], pathName: string): string | undefined {
  let item = itemGroups
    .flatMap(group => group.children)
    .filter(item => item.url !== '/')
    .find(item => pathName.includes(item.url))

  if (!item) {
    item = itemGroups
      .flatMap(group => group.children)
      .find(item => pathName === item.url)
  }

  if (item) {
    return item.id
  }
}

export default function DrawerContent() {
  const pathName = usePathname()
  const texts = useDictionary(drawerContentDictionary)
  const itemGroups = useMemo(() => menuItemGroups(texts), [texts])
  const openItem = useMemo(() => calculateOpenItem(itemGroups, pathName), [itemGroups, pathName])

  return (
    <ListBox aria-label={ texts.ariaLabel }>
      {
        itemGroups
          .map((item, i) =>
            <React.Fragment
              key={ item.id } >
              {
                i > 0 &&
                <Separator />
              }
              <NavGroup
                item={ item }
                openItem={ openItem || null } />
            </React.Fragment>
          )
      }
    </ListBox>
  )
}
