import type { Dictionary } from '@/lib/i18n/dictionary'

const es = {
  ariaLabel: 'Ruta de navegación',
  loading: 'Cargando',
  home: 'Inicio',
  profile: 'Configuración',
}

const en: typeof es = {
  ariaLabel: 'Breadcrumbs',
  loading: 'Loading',
  home: 'Home',
  profile: 'Settings',
}

const dictionary: Dictionary<typeof es> = { es, en }

export default dictionary
