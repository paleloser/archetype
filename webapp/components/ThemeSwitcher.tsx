'use client'

import { Description, Label, ListBox, Select } from '@heroui/react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon, Tv } from '@gravity-ui/icons'

import { useDictionary } from '@/lib/i18n/client'
import themeSwitcherDictionary from './ThemeSwitcher.i18n'

export function ThemeSwitcher({ className }: { className?: string }) {
  const [ mounted, setMounted ] = useState(false)
  const { resolvedTheme, setTheme, theme } = useTheme()

  const texts = useDictionary(themeSwitcherDictionary)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Select
      className={ `w-full sm:w-[200px] ${className ?? ''}` }
      placeholder={ texts.placeholder }
      defaultValue={ theme }
      onChange={ (theme) => setTheme(theme as string) }>
      <Label>{ texts.theme }</Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox aria-label={ texts.ariaLabel }>
          <ListBox.Item id='light' textValue={ texts.light }>
            <Sun className='inline-block mr-2' />
            { texts.light }
            <ListBox.ItemIndicator />
          </ListBox.Item>
          <ListBox.Item id='dark' textValue={ texts.dark }>
            <Moon className='inline-block mr-2' />
            { texts.dark }
            <ListBox.ItemIndicator />
          </ListBox.Item>
          <ListBox.Item id='system' textValue={ texts.system }>
            <Tv className='inline-block mr-2' />
            { texts.system }
            <ListBox.ItemIndicator />
          </ListBox.Item>
        </ListBox>
      </Select.Popover>
      <Description>{ texts.helperText }</Description>
    </Select>
  )
}
