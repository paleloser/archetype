import type { Dictionary } from '@/lib/i18n/dictionary'

const es = {
  metadataTitle: 'Error · acme',
  metadataDescription: 'Algo no ha ido bien',
  statuses: {
    '401': { description: 'Tu sesión ha caducado. Inicia sesión de nuevo para continuar.' },
    '403': { description: 'No tienes permisos para ver esta página.' },
    '500': { description: 'Ha ocurrido un error inesperado.' },
  },
}

const en: typeof es = {
  metadataTitle: 'Error · acme',
  metadataDescription: 'Something went wrong',
  statuses: {
    '401': { description: 'Your session has expired. Log in again to continue.' },
    '403': { description: 'You are not allowed to see this page.' },
    '500': { description: 'An unexpected error occurred.' },
  },
}

const dictionary: Dictionary<typeof es> = { es, en }

export default dictionary
