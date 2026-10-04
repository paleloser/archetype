import type { Dictionary } from '@/lib/i18n/dictionary'

const es = {
  updated: 'Actualizada el',
  buttonDelete: 'Borrar',
  toastDeletedTitle: 'Nota borrada',
  toastDeleteFailedTitle: 'No se ha podido borrar la nota',
  toastDeleteFailedDescription: 'Inténtalo de nuevo en unos minutos.',
}

const en: typeof es = {
  updated: 'Updated on',
  buttonDelete: 'Delete',
  toastDeletedTitle: 'Note deleted',
  toastDeleteFailedTitle: 'The note could not be deleted',
  toastDeleteFailedDescription: 'Try again in a few minutes.',
}

const dictionary: Dictionary<typeof es> = { es, en }

export default dictionary
