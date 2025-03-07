import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import { supabase } from '../supabase';
import { Language, LanguageContext, LanguageContextType } from './types';
import { getNestedValue, detectLanguage } from './helpers';
import translations, { languages } from './translations';

// Type for translations from API
type TranslationsMap = {
  [key: string]: string;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component for language context
 */
export function LanguageProvider({ children }: LanguageProviderProps): JSX.Element {
  const [language, setLanguageState] = useState<Language>('en');
  const [isInitialized, setIsInitialized] = useState(false);
  const [apiTranslations, setApiTranslations] = useState<TranslationsMap>({});

  // Initialize language preference once on app start
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        // Check if we have a stored language preference
        const storedLanguage = await AsyncStorage.getItem('language');
        
        if (storedLanguage && languages.some(lang => lang.id === storedLanguage)) {
          // Use the stored language preference
          setLanguageState(storedLanguage);
        } else {
          // Detect the device language and save it
          const deviceLang = detectLanguage(
            Localization.locale || 'en',
            languages.map(lang => lang.id),
            'en'
          );
          setLanguageState(deviceLang);
          await AsyncStorage.setItem('language', deviceLang);
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing language:', error);
        // Fallback to English
        setLanguageState('en');
        setIsInitialized(true);
      }
    };

    initializeLanguage();
  }, []);

  // Fetch translations when language changes or on initial load
  useEffect(() => {
    if (!isInitialized) return;
    
    const fetchTranslations = async () => {
      try {
        const { data, error } = await supabase
          .from('translations')
          .select('key, value')
          .eq('language_id', language);

        if (error) throw error;

        const translationsMap = (data || []).reduce((acc, { key, value }) => {
          acc[key] = value;
          return acc;
        }, {} as TranslationsMap);

        setApiTranslations(translationsMap);
      } catch (err) {
        console.error('Failed to fetch translations:', err);
      }
    };

    fetchTranslations();
  }, [language, isInitialized]);

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem('language', lang);
      setLanguageState(lang);
    } catch (error) {
      console.error('Error setting language:', error);
    }
  };

  const t = (key: string): string => {
    // First try to get from API-fetched translations
    if (apiTranslations[key]) {
      return apiTranslations[key];
    }
    
    // Fallback to English translations
    return getNestedValue(translations.en, key) || key;
  };

  const contextValue = React.useMemo(
    () => ({
      language,
      setLanguage,
      t,
    }),
    [language, apiTranslations]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Hook to use language context
 */
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}