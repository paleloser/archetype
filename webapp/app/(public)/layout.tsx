import Image from 'next/image'

import { getDictionary } from '@/lib/i18n/server'
import layoutDictionary from './i18n'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const texts = await getDictionary(layoutDictionary)

  return (
    <main
      className='flex-grow p-8 sm:px-12 h-full'>
      <Image
        src='/icon.svg'
        alt={ texts.logoAlt }
        height={ 40 }
        width={ 40 }
        priority />
      <div className='max-w-[600px] mx-auto w-full px-4 mt-8 sm:px-6'>
        { children }
      </div>
    </main>
  )
}
