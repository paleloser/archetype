'use client'

import { Button, Link, Separator, Typography } from '@heroui/react'

import { useDictionary } from '@/lib/i18n/client'
import errorDictionary from './Error.i18n'

export default function Error({ error }: { error: string }) {
  const dictionary = useDictionary(errorDictionary)

  return (
    <div>
      <Typography type='h1'>{ dictionary.title }</Typography>
      <Typography type='body-sm' color='muted'>{ error }</Typography>
      <Separator className='mt-2' />
      <Typography type='body-sm' className='mt-4'>{ dictionary.tooltip }</Typography>
      <div className='flex flex-row space-x-2 items-center justify-end'>
        <Link
          href='/auth/logout'
          className='underline'>
          { dictionary.buttonLogOut }
        </Link>
        <Button
          onClick={ () => window.location.reload() }
          size='sm'>
          { dictionary.buttonReloadPage }
        </Button>
      </div>
    </div>
  )
}
