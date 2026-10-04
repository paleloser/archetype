import type { Dictionary } from '@/lib/i18n/dictionary'

const es = {
  metadataTitle: 'acme',
  metadataDescription: 'Tus notas',
  title: 'Tus notas',
  description: 'Un recurso de ejemplo que recorre todas las capas del arquetipo. Sustitúyelo por el tuyo.',
  empty: 'Todavía no hay notas.',
  errors: {
    unauthorized: 'Acceso no autorizado. Por favor, inicia sesión de nuevo.',
    forbidden: 'Acceso denegado. No tienes permisos para ver estos datos.',
    unknown: 'No se han podido obtener las notas.',
  },
}

const en: typeof es = {
  metadataTitle: 'acme',
  metadataDescription: 'Your notes',
  title: 'Your notes',
  description: 'A sample resource going through every layer of the archetype. Replace it with yours.',
  empty: 'No notes yet.',
  errors: {
    unauthorized: 'Unauthorized access. Please log in again.',
    forbidden: 'Forbidden access. You do not have permission to view this data.',
    unknown: 'The notes could not be fetched.',
  },
}

const dictionary: Dictionary<typeof es> = { es, en }

export default dictionary
