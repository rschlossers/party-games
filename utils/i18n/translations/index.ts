import { enTranslations } from './en';
import { Language } from '../types';

// Default language list for fallback
export const languages = [
  { id: 'en', name: 'English' },
  { id: 'da', name: 'Dansk' },
  { id: 'cs', name: 'Czech' },
  { id: 'de', name: 'German' },
  { id: 'es', name: 'Spanish' },
  { id: 'et', name: 'Estonian' },
  { id: 'fi', name: 'Finnish' },
  { id: 'fr', name: 'French' },
  { id: 'hu', name: 'Hungarian' },
  { id: 'is', name: 'Icelandic' },
  { id: 'it', name: 'Italian' },
  { id: 'nl', name: 'Dutch' },
  { id: 'no', name: 'Norwegian' },
  { id: 'pl', name: 'Polish' },
  { id: 'sv', name: 'Swedish' }
];

// Export all translations in a single object
const translations: Record<string, Record<string, any>> = {
  en: enTranslations,
  da: {}, // Empty objects for other languages - translations come from database
  cs: {},
  de: {},
  es: {},
  et: {},
  fi: {},
  fr: {},
  hu: {},
  is: {},
  it: {},
  nl: {},
  no: {},
  pl: {},
  sv: {}
};

export default translations;