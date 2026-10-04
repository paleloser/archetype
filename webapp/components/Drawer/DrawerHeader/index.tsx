import Image from 'next/image'
import Link from 'next/link'

import { useDictionary } from '@/lib/i18n/client'
import drawerHeaderDictionary from './i18n'

export default function DrawerHeader() {
  const texts = useDictionary(drawerHeaderDictionary)

  return (
    <div className='flex justify-center items-center py-4'>
      <Link href='/'>
        <Image
          src='/icon.svg'
          alt={ texts.logoAlt }
          width={ 39 }
          height={ 39 }
          priority />
      </Link>
    </div>
  )
}
