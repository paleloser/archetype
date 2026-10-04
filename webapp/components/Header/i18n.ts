import type { Dictionary } from '@/lib/i18n/dictionary'

const es = {
  logoAlt: 'logotipo de acme',
  home: 'Inicio',
  profile: 'Perfil',
  logout: 'Cerrar sesión',
}

const en: typeof es = {
  logoAlt: 'acme logo',
  home: 'Home',
  profile: 'Profile',
  logout: 'Log out',
}

const dictionary: Dictionary<typeof es> = { es, en }

export default dictionary
