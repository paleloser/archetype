'use client'

import { Alert, Link } from '@heroui/react'

export type StatusMessageProps = {
  status: 'danger' | 'success' | 'warning' | 'accent' | 'default' | undefined
  title: string
  description: string
  action?: StatusMessageAction
}

export type StatusMessageAction = {
  href: string
  label: string
  external?: boolean
}

export default function StatusMessage({ status, title, description, action }: StatusMessageProps) {
  return (
    <div className='flex flex-col gap-4'>
      <Alert status={ status }>
        <Alert.Content>
          <Alert.Title>{ title }</Alert.Title>
          <Alert.Description>
            { description }
          </Alert.Description>
        </Alert.Content>
      </Alert>
      {
        action &&
        <Link 
          href={ action.href } 
          target={ action.external ? '_blank' : undefined } 
          rel={ action.external ? 'noopener noreferrer' : undefined }
          className='mt-2'>
          { action.label }
          <Link.Icon />
        </Link>
      }
    </div>
  )
}
