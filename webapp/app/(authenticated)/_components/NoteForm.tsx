'use client'

import { notesClient } from '@/clients/backend'
import { FloppyDisk } from '@gravity-ui/icons'
import { Button, Fieldset, Form, Input, Label, Spinner, TextArea, TextField } from '@heroui/react'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

import { useFeedback } from '@/lib/feedback'
import { useDictionary } from '@/lib/i18n/client'
import noteFormDictionary from './NoteForm.i18n'

export function NoteForm() {
  const texts = useDictionary(noteFormDictionary)
  const feedback = useFeedback()
  const router = useRouter()

  const [ state, setState ] = useState<'ready' | 'loading'>('ready')

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('loading')

    const form = e.currentTarget
    const formData = new FormData(form)

    notesClient()
      .createNote({
        title: formData.get('title')?.toString() ?? '',
        content: formData.get('content')?.toString() || undefined,
      })
      .then(() => {
        feedback.success(texts.toastSavedTitle, texts.toastSavedDescription)
        form.reset()
        // The list is rendered by a server component, so it picks the new note up on refresh.
        router.refresh()
      })
      .catch(() => feedback.danger(texts.toastSaveFailedTitle, texts.toastSaveFailedDescription))
      .finally(() => setState('ready'))
  }

  return (
    <Form onSubmit={ onSubmit }>
      <Fieldset className='w-full'>
        <Fieldset.Legend>{ texts.title }</Fieldset.Legend>
        <Fieldset.Group>
          <TextField variant='secondary' isRequired>
            <Label>{ texts.inputLabelTitle }</Label>
            <Input name='title' maxLength={ 200 } />
          </TextField>
          <TextField variant='secondary'>
            <Label>{ texts.inputLabelContent }</Label>
            <TextArea name='content' rows={ 4 } />
          </TextField>
        </Fieldset.Group>
        <Fieldset.Actions>
          <Button
            type='submit'
            variant={ state === 'loading' ? 'ghost' : 'primary' }
            isPending={ state === 'loading' }>
            {
              state === 'loading'
                ? <Spinner color='current' size='sm' />
                : <FloppyDisk />
            }
            { state === 'loading' ? texts.buttonSaving : texts.buttonSave }
          </Button>
        </Fieldset.Actions>
      </Fieldset>
    </Form>
  )
}
