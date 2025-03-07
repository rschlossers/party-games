import { supabase } from './supabase';
import { sortByLocalizedName } from './sortHelpers';
import { Language } from './i18n';

/**
 * Fetches categories from a Supabase table and sorts them alphabetically
 * 
 * @param tableName The Supabase table name
 * @param language Current language code
 * @returns Sorted array of categories
 */
export async function fetchSortedCategories<T extends Record<string, any>>(
  tableName: string,
  language: Language
): Promise<{ data: T[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*');
      
    if (error) throw error;
    
    // Sort the categories alphabetically by name in the current language
    const sortedData = data ? sortByLocalizedName(data, language) : null;
    
    return { data: sortedData as T[], error: null };
  } catch (error) {
    console.error(`Error fetching from ${tableName}:`, error);
    return { data: null, error: error as Error };
  }
}