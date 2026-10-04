'use client'

import { ArrowRightFromSquare, House, Person } from '@gravity-ui/icons'
import { Link } from '@heroui/react'
import Image from 'next/image'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'

import { useDictionary } from '@/lib/i18n/client'
import headerDictionary from './i18n'

export default function Header() {
  const texts = useDictionary(headerDictionary)
  const pathname = usePathname()

  const items = [
    { href: '/', label: texts.home, icon: <House /> },
    { href: '/profile', label: texts.profile, icon: <Person /> },
  ]

  return (
    <header className='border-b border-default-200'>
      <nav className='max-w-[1536px] mx-auto px-4 sm:px-6 h-16 flex items-center gap-6'>
        <NextLink href='/' className='flex items-center gap-2 font-semibold'>
          <Image src='/icon.svg' alt={ texts.logoAlt } width={ 28 } height={ 28 } />
          acme
        </NextLink>
        <ul className='flex items-center gap-4 flex-1'>
          {
            items.map(item =>
              <li key={ item.href }>
                <NextLink
                  href={ item.href }
                  aria-current={ pathname === item.href ? 'page' : undefined }
                  className={ `flex items-center gap-1 text-sm ${pathname === item.href ? 'text-accent' : 'text-muted'}` }>
                  { item.icon }
                  { item.label }
                </NextLink>
              </li>
            )
          }
        </ul>
        { /* Auth routes are handled by the Auth0 SDK, not by Next.js: a plain anchor, never a client-side navigation. */ }
        <Link href='/auth/logout' className='text-sm'>
          <ArrowRightFromSquare />
          { texts.logout }
        </Link>
      </nav>
    </header>
  )
}
