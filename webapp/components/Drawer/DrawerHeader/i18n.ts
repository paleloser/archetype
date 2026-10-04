import type { Dictionary } from '@/lib/i18n/dictionary'

const es = {
  logoAlt: 'logotipo de acme',
}

const en: typeof es = {
  logoAlt: 'acme logo',
}

const dictionary: Dictionary<typeof es> = { es, en }

export default dictionary
