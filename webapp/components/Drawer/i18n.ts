import type { Dictionary } from '@/lib/i18n/dictionary'

const es = {
  ariaLabel: 'Cajón de navegación principal',
}

const en: typeof es = {
  ariaLabel: 'Main navigation drawer',
}

const dictionary: Dictionary<typeof es> = { es, en }

export default dictionary
