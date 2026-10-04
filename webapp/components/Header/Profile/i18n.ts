import type { Dictionary } from '@/lib/i18n/dictionary'

const es = {
  profile: 'Tu perfil',
  logOut: 'Cerrar sesión',
}

const en: typeof es = {
  profile: 'Your profile',
  logOut: 'Log out',
}

const dictionary: Dictionary<typeof es> = { es, en }

export default dictionary
