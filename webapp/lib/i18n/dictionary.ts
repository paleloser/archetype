import { Locale } from './config'

/**
 * A set of translations for every supported locale. Dictionaries are colocated
 * with the page or component they belong to — `<name>.i18n.ts` next to
 * `<name>.tsx`, or plain `i18n.ts` for folder-style components built
 * around an `index.tsx` — and typed so the non-default locales must cover
 * exactly the same keys:
 *
 * ```ts
 * const es = { title: 'Tus bicicletas' }
 * const en: typeof es = { title: 'Your bikes' }
 *
 * const dictionary: Dictionary<typeof es> = { es, en }
 *
 * export default dictionary
 * ```
 *
 * Read them with `getDictionary` in server components and `useDictionary` in
 * client ones.
 */
export type Dictionary<T> = Record<Locale, T>
