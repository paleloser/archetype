'use client'

import { CircleCheck, CircleExclamation, HandOk } from '@gravity-ui/icons'
import { toast } from '@heroui/react'
import { useMemo } from 'react'
import type { ReactNode } from 'react'

import feedbackDictionary from './feedback.i18n'
import { useDictionary } from '@/lib/i18n/client'

export type Feedback = {
  /** Tells the user a successful action (often a form submit). */
  success: (title: string, description?: string, indicator?: ReactNode) => void
  /** Tells the user an action failed, and why. */
  danger: (title: string, description?: string, indicator?: ReactNode) => void
  /** Tells the user an action went through. */
  info: (title: string, description?: string, indicator?: ReactNode) => void
}

/**
 * Toasts are the single way the app reports the outcome of an action — no `error`
 * states rendered next to the button that triggered them, no success messages left
 * behind in a corner of the screen. Raise one, then let the caller decide what to do
 * with the rest of its state: reset it, refresh the page, or redirect.
 *
 * ```tsx
 * const feedback = useFeedback()
 *
 * client()
 *   .doSomething()
 *   .then(() => feedback.success(texts.toastSavedTitle, texts.toastSavedDescription))
 *   .catch(() => feedback.danger(texts.toastFailedTitle, texts.toastFailedDescription))
 *   .finally(() => setState('ready'))
 * ```
 */
export function useFeedback(): Feedback {
  const texts = useDictionary(feedbackDictionary)

  // Memoised so it can be depended on from an effect without re-running it on
  // every render.
  return useMemo(() => {
    function raise(variant: 'success' | 'danger' | 'accent', fallbackIndicator: ReactNode, title: string, description?: string, indicator?: ReactNode) {
      const id = toast(title, {
        actionProps: {
          children: texts.buttonClose,
          onPress: () => toast.close(id),
          variant: 'tertiary',
        },
        description,
        indicator: indicator ?? fallbackIndicator,
        variant,
      })
    }

    return {
      success: (title: string, description?: string, indicator?: ReactNode) => raise('success', <CircleCheck />, title, description, indicator),
      danger: (title: string, description?: string, indicator?: ReactNode) => raise('danger', <CircleExclamation />, title, description, indicator),
      info: (title: string, description?: string, indicator?: ReactNode) => raise('accent', <HandOk />, title, description, indicator),
    }
  }, [ texts ])
}
