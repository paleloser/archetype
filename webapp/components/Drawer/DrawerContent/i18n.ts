import type { Dictionary } from '@/lib/i18n/dictionary'

const es = {
  ariaLabel: 'Navegación principal',
  mainGroupTitle: 'Espacio de trabajo',
  notesTitle: 'Notas',
  notesDescription: 'Lo que has apuntado',
  resourcesGroupTitle: 'Recursos',
  docsTitle: 'Documentación',
  docsDescription: 'Guía de la plataforma',
  supportTitle: 'Soporte',
  supportDescription: 'Contacto y asistencia',
}

const en: typeof es = {
  ariaLabel: 'Main navigation',
  mainGroupTitle: 'Workspace',
  notesTitle: 'Notes',
  notesDescription: 'What you wrote down',
  resourcesGroupTitle: 'Resources',
  docsTitle: 'Documentation',
  docsDescription: 'Platform guide',
  supportTitle: 'Support',
  supportDescription: 'Contact and assistance',
}

const dictionary: Dictionary<typeof es> = { es, en }

export default dictionary
