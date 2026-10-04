import type { Dictionary } from '@/lib/i18n/dictionary'

const es = {
  title: 'Nueva nota',
  inputLabelTitle: 'Título',
  inputLabelContent: 'Contenido',
  buttonSave: 'Guardar',
  buttonSaving: 'Guardando...',
  toastSavedTitle: 'Nota guardada',
  toastSavedDescription: 'Ya aparece en tu lista.',
  toastSaveFailedTitle: 'No se ha podido guardar la nota',
  toastSaveFailedDescription: 'Inténtalo de nuevo en unos minutos.',
}

const en: typeof es = {
  title: 'New note',
  inputLabelTitle: 'Title',
  inputLabelContent: 'Content',
  buttonSave: 'Save',
  buttonSaving: 'Saving...',
  toastSavedTitle: 'Note saved',
  toastSavedDescription: 'It is now on your list.',
  toastSaveFailedTitle: 'The note could not be saved',
  toastSaveFailedDescription: 'Try again in a few minutes.',
}

const dictionary: Dictionary<typeof es> = { es, en }

export default dictionary
