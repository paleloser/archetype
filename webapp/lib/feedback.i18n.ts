import type { Dictionary } from '@/lib/i18n/dictionary'

const es = {
  buttonClose: 'Cerrar',
}

const en: typeof es = {
  buttonClose: 'Close',
}

const dictionary: Dictionary<typeof es> = { es, en }

export default dictionary
