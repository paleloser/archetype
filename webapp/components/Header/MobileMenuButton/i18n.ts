import type { Dictionary } from '@/lib/i18n/dictionary'

const es = {
  buttonLabel: 'Más opciones',
}

const en: typeof es = {
  buttonLabel: 'More options',
}

const dictionary: Dictionary<typeof es> = { es, en }

export default dictionary
