import { Language } from './i18n';

/**
 * Sorts an array of objects alphabetically by the localized name field
 * Works with category objects that have fields like name_en, name_da, etc.
 * 
 * @param items Array of objects with localized name fields
 * @param language Current language code (e.g., 'en', 'da')
 * @returns Sorted array
 */
export function sortByLocalizedName<T extends Record<string, any>>(
  items: T[],
  language: Language
): T[] {
  if (!items || items.length === 0) return items;
  
  const nameField = `name_${language}` as keyof T;
  
  // Check if the field exists in the first item
  if (items[0] && typeof items[0][nameField] === 'string') {
    return [...items].sort((a, b) => {
      const nameA = String(a[nameField] || '').toLowerCase();
      const nameB = String(b[nameField] || '').toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }
  
  // Fallback to English or first item key that looks like a name field
  const fallbackFields = ['name_en', 'name', 'title', 'text'];
  for (const field of fallbackFields) {
    if (items[0] && typeof items[0][field] === 'string') {
      const fallbackField = field as keyof T;
      return [...items].sort((a, b) => {
        const nameA = String(a[fallbackField] || '').toLowerCase();
        const nameB = String(b[fallbackField] || '').toLowerCase();
        return nameA.localeCompare(nameB);
      });
    }
  }
  
  // If no suitable field is found, return the original array
  return items;
}