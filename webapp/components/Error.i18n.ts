import type { Dictionary } from '@/lib/i18n/dictionary'

const es = {
  title: 'Ocurrió un error inesperado',
  tooltip: 'Por favor, recarga la página o cierra sesión e inicia sesión nuevamente.',
  buttonReloadPage: 'Recargar',
  buttonLogOut: 'Cerrar sesión',
}

const en: typeof es = {
  title: 'Something went wrong',
  tooltip: 'Please reload the page, or log out and log back in.',
  buttonReloadPage: 'Reload',
  buttonLogOut: 'Log out',
}

const dictionary: Dictionary<typeof es> = { es, en }

export default dictionary
