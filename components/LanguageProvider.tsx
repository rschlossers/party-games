import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language, LanguageContext, languages, getNestedValue } from '../utils/i18n';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    AsyncStorage.getItem('language').then((stored) => {
      if (stored && stored in languages) {
        setLanguageState(stored as Language);
      }
    });
  }, []);

  const setLanguage = async (lang: Language) => {
    await AsyncStorage.setItem('language', lang);
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return getNestedValue(languages[language].translations, key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}