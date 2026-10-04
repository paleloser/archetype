import type { Dictionary } from '@/lib/i18n/dictionary'

const es = {
  metadataTitle: 'Perfil · acme',
  metadataDescription: 'Tus preferencias',
  title: 'Perfil',
  description: 'Tus preferencias de idioma y tema.',
}

const en: typeof es = {
  metadataTitle: 'Profile · acme',
  metadataDescription: 'Your preferences',
  title: 'Profile',
  description: 'Your language and theme preferences.',
}

const dictionary: Dictionary<typeof es> = { es, en }

export default dictionary
