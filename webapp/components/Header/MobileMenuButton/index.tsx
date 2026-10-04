'use client'

import { useDrawer } from '@/components/Drawer/DrawerController'
import { Button } from '@heroui/react'
import { Bars } from '@gravity-ui/icons'

import { useDictionary } from '@/lib/i18n/client'
import mobileMenuButtonDictionary from './i18n'

export default function MobileMenuButton() {
  const { open, setOpen } = useDrawer()

  const texts = useDictionary(mobileMenuButtonDictionary)

  return (
    <Button
      isIconOnly
      aria-label={ texts.buttonLabel }
      variant='ghost'
      onClick={ () => setOpen(!open) }
      size='sm'
      className='sm:hidden'>
      <Bars />
    </Button>
  )
}
