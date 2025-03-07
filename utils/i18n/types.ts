import { createContext } from 'react';

export type Language = string;

export interface TranslationMap {
  [key: string]: string | TranslationMap;
}

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string) => string;
}

export const defaultContext: LanguageContextType = {
  language: 'en',
  setLanguage: async () => {},
  t: (key: string) => key,
};

export const LanguageContext = createContext<LanguageContextType>(defaultContext);