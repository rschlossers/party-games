/**
 * Gets a nested value from an object using dot notation
 * 
 * @param obj Object containing translations
 * @param path Dot notation path (e.g., 'dashboard.title')
 * @returns The value at the path or the path itself if not found
 */
export function getNestedValue(obj: any, path: string): string {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === undefined || current === null) {
      return path;
    }
    current = current[key];
  }
  
  return typeof current === 'string' ? current : path;
}

/**
 * Detects the device language and returns a supported language code
 * 
 * @param locale The device locale
 * @param supportedLanguages Array of supported language codes
 * @param defaultLanguage Default language to use if no match is found
 * @returns A supported language code
 */
export function detectLanguage(
  locale: string, 
  supportedLanguages: string[] = ['en', 'da'], 
  defaultLanguage = 'en'
): string {
  try {
    // Extract the language code (first part before any dash or underscore)
    const languageCode = locale.split(/[-_]/)[0].toLowerCase();
    
    // Check if the language code is supported
    if (supportedLanguages.includes(languageCode)) {
      return languageCode;
    }
    
    return defaultLanguage;
  } catch (error) {
    console.warn('Error detecting device language:', error);
    return defaultLanguage;
  }
}