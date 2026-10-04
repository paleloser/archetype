'use client'

import DrawerContent from './DrawerContent'
import DrawerHeader from './DrawerHeader'
import { useDrawer } from './DrawerController'
import { Drawer as HeroDrawer } from '@heroui/react'
import { useDictionary } from '@/lib/i18n/client'
import drawerDictionary from './i18n'

export default function Drawer() {
  const { open, setOpen } = useDrawer()
  const texts = useDictionary(drawerDictionary)
  
  return (
    <>
      <nav className='min-w-[240px] hidden sm:flex flex-col p-4 space-y-8 border-r-1 border-gray-200 dark:border-neutral-800'>
        <DrawerHeader />
        <DrawerContent />
      </nav>
      <HeroDrawer.Backdrop 
        isOpen={ open } 
        onOpenChange={ setOpen } 
        className='min-w-[240px] flex sm:hidden'>
        <HeroDrawer.Content 
          placement='left'>
          <HeroDrawer.Dialog
            aria-label={ texts.ariaLabel }>
            <HeroDrawer.Header>
              <DrawerHeader />
            </HeroDrawer.Header>
            <HeroDrawer.Body>
              <DrawerContent />
            </HeroDrawer.Body>
          </HeroDrawer.Dialog>
        </HeroDrawer.Content>
      </HeroDrawer.Backdrop>
    </>
  )
}
