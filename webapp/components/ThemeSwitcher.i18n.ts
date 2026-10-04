import type { Dictionary } from '@/lib/i18n/dictionary'

const es = {
  ariaLabel: 'Selector de tema',
  theme: 'Tema',
  placeholder: 'Selecciona',
  light: 'Claro',
  dark: 'Oscuro',
  system: 'Sistema',
  helperText: 'Se guarda en este navegador.',
}

const en: typeof es = {
  ariaLabel: 'Theme selector',
  theme: 'Theme',
  placeholder: 'Select',
  light: 'Light',
  dark: 'Dark',
  system: 'System',
  helperText: 'Stored in this browser.',
}

const dictionary: Dictionary<typeof es> = { es, en }

export default dictionary
