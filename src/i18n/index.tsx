import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type PropsWithChildren,
} from 'react';
import { Platform } from 'react-native';

import {
  DEFAULT_LANGUAGE,
  isLanguage,
  translate,
  type Language,
  type TranslationKey,
  type TranslationParams,
} from './translations';

const STORAGE_KEY = 'found.language';
type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, params?: TranslationParams) => string;
  joinList: (items: string[]) => string;
};
const I18nContext = createContext<I18nContextValue | null>(null);

function createLanguageStore() {
  let language: Language = DEFAULT_LANGUAGE;
  const listeners = new Set<() => void>();
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (isLanguage(saved)) language = saved;
    } catch {
      // Storage may be disabled. Switching still works for this session.
    }
  }

  return {
    getSnapshot: () => language,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    setLanguage: (next: Language) => {
      language = next;
      listeners.forEach((listener) => listener());
      if (Platform.OS !== 'web') return;
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // A storage failure should not prevent changing the language.
      }
    },
  };
}

const getServerSnapshot = () => DEFAULT_LANGUAGE;

export function I18nProvider({ children }: PropsWithChildren) {
  const [store] = useState(createLanguageStore);
  // Use English during static rendering and hydration, then read the saved choice.
  const language = useSyncExternalStore(store.subscribe, store.getSnapshot, getServerSnapshot);
  const { setLanguage } = store;

  useEffect(() => {
    if (Platform.OS === 'web') document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<I18nContextValue>(() => {
    const t = (key: TranslationKey, params?: TranslationParams) => translate(language, key, params);
    return {
      language,
      setLanguage,
      t,
      joinList: (items) =>
        items.length < 2
          ? (items[0] ?? '')
          : t('common.list', {
              items: items.slice(0, -1).join(', '),
              last: items[items.length - 1],
            }),
    };
  }, [language, setLanguage]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
}
