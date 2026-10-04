'use client'

import { Description, Label, ListBox, Select } from '@heroui/react'
import { useRouter } from 'next/navigation'

import { storeLocale, useDictionary, useLocale } from '@/lib/i18n/client'
import { Locale, localeLabels, locales } from '@/lib/i18n/config'
import languageSwitcherDictionary from './LanguageSwitcher.i18n'

export function LanguageSwitcher({ className }: { className?: string }) {
  const texts = useDictionary(languageSwitcherDictionary)
  const locale = useLocale()
  const router = useRouter()

  function onChange(selected: Locale) {
    storeLocale(selected)
    // Server components resolve the locale per request, so they only pick the new
    // preference up once the current route is re-rendered.
    router.refresh()
  }

  return (
    <Select
      className={ `w-full sm:w-[200px] ${className ?? ''}` }
      placeholder={ texts.placeholder }
      value={ locale }
      onChange={ (selected) => onChange(selected as Locale) }>
      <Label>{ texts.language }</Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {
            locales.map(supported =>
              <ListBox.Item
                key={ supported }
                id={ supported }
                textValue={ localeLabels[supported] }>
                { localeLabels[supported] }
                <ListBox.ItemIndicator />
              </ListBox.Item>
            )
          }
        </ListBox>
      </Select.Popover>
      <Description>{ texts.helperText }</Description>
    </Select>
  )
}
