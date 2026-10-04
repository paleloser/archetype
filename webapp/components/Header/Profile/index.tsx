'use client'

import { useUser } from '@auth0/nextjs-auth0'
import { Avatar, Dropdown, Label } from '@heroui/react'
import { PersonPencil, ArrowRightFromSquare } from '@gravity-ui/icons'

import { useDictionary } from '@/lib/i18n/client'
import profileDictionary from './i18n'

type MenuOption = {
  id: string
  url: string,
  title: string,
  icon: React.ReactElement<any>,
  variant?: 'danger' | 'default'
}

const avatars = [
  '/images/black.jpg',
  '/images/blue.jpg',
  '/images/green.jpg',
  '/images/orange.jpg',
  '/images/purple.jpg',
  '/images/red.jpg',
  '/images/white.jpg',
]

const AUTH0_DEFAULT_AVATARS = 'cdn.auth0.com/avatars/'

// Auth0 gives users without a picture a Gravatar URL that falls back to an image with their initials. Asking Gravatar for a
// 404 instead makes the avatar show our own fallback, while users with a real Gravatar still get it.
function profilePicture(picture?: string): string | undefined {
  if (!picture || picture.includes(AUTH0_DEFAULT_AVATARS)) {
    return undefined
  }
  try {
    const url = new URL(picture)
    if (url.hostname.endsWith('gravatar.com') && url.searchParams.get('d')?.includes(AUTH0_DEFAULT_AVATARS)) {
      url.searchParams.set('d', '404')
      return url.toString()
    }
  } catch {
    // Not a URL we can reason about: let the avatar try it as is
  }
  return picture
}

function ProfileAvatar({ name, picture, size }: { name?: string, picture?: string, size?: 'sm' }) {
  return (
    <Avatar size={ size }>
      <Avatar.Image
        alt={ name }
        src={ profilePicture(picture) } />
      <Avatar.Fallback
        aria-label={ name }
        className='bg-cover bg-center'
        delayMs={ 600 }
        role='img'
        style={ { backgroundImage: `url(${avatars[(name?.charCodeAt(0) || 0) % avatars.length]})` } } />
    </Avatar>
  )
}

function menuOptions(texts: (typeof profileDictionary)['es']): MenuOption[] {
  return [
    {
      id: 'profile',
      title: texts.profile,
      url: '/profile',
      icon: <PersonPencil className='size-3.5' />
    },
    {
      id: 'log-out',
      title: texts.logOut,
      url: '/auth/logout',
      icon: <ArrowRightFromSquare className='size-3.5' />,
      variant: 'danger'
    },
  ]
}

export default function Profile() {
  const { user } = useUser()

  const options = menuOptions(useDictionary(profileDictionary))

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <ProfileAvatar
          name={ user?.name }
          picture={ user?.picture } />
      </Dropdown.Trigger>
      <Dropdown.Popover
        className='min-w-[256px]'>
        <div className='px-3 pt-3 pb-1'>
          <div className='flex items-center gap-2'>
            <ProfileAvatar
              name={ user?.name }
              picture={ user?.picture }
              size='sm' />
            <div className='flex flex-col gap-0 truncate'>
              <p className='text-sm leading-5 font-medium'>{ user?.name }</p>
              <p className='text-xs leading-none text-muted'>{ user?.email }</p>
            </div>
          </div>
        </div>
        <Dropdown.Menu>
          {
            options.map(option =>
              <Dropdown.Item
                key={ option.id }
                href={ option.url }
                textValue={ option.title }
                variant={ option.variant ?? 'default' }>
                <div className='flex w-full items-center justify-between gap-2'>
                  <Label>{ option.title }</Label>
                  { option.icon }
                </div>
              </Dropdown.Item>)
          }
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  )
}
