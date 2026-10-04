import type { Dictionary } from '@/lib/i18n/dictionary'

const es = {
  language: 'Idioma',
  placeholder: 'Selecciona',
  helperText: 'Se guarda en este navegador.',
}

const en: typeof es = {
  language: 'Language',
  placeholder: 'Select',
  helperText: 'Stored in this browser.',
}

const dictionary: Dictionary<typeof es> = { es, en }

export default dictionary
