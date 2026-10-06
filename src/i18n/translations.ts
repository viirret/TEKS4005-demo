import definitions from './translations.json';

export type Language = keyof typeof definitions;
export type TranslationKey = keyof typeof definitions.en;
export type TranslationParams = Record<string, string | number>;

// Every language must define the complete English catalog.
const catalogs: Record<Language, Record<TranslationKey, string>> = definitions;
export const languages = Object.keys(catalogs) as Language[];
export const DEFAULT_LANGUAGE: Language = 'en';

export function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && Object.hasOwn(catalogs, value);
}

export function translate(
  language: Language,
  key: TranslationKey,
  params: TranslationParams = {},
): string {
  const template = catalogs[language]?.[key] ?? catalogs[DEFAULT_LANGUAGE][key];
  return template.replace(/\{(\w+)\}/g, (placeholder, name: string) =>
    Object.hasOwn(params, name) ? String(params[name]) : placeholder,
  );
}
