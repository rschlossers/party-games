import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/index';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Original Supabase client
const originalClient = createClient<Database>(supabaseUrl, supabaseKey);

// Helper function to sort data alphabetically by name field in the current language
function sortByLocalizedName<T extends Record<string, any>>(
  items: T[] | null,
  language: string = 'en'
): T[] | null {
  if (!items || items.length === 0) return items;
  
  const nameField = `name_${language}`;
  
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
      return [...items].sort((a, b) => {
        const nameA = String(a[field] || '').toLowerCase();
        const nameB = String(b[field] || '').toLowerCase();
        return nameA.localeCompare(nameB);
      });
    }
  }
  
  // If no suitable field is found, return the original array
  return items;
}

// Determine if a table name is likely a categories table
function isCategoriesTable(tableName: string): boolean {
  return tableName.includes('categories') || 
         tableName.endsWith('_categories') || 
         tableName.includes('category');
}

// Enhanced Supabase client with automatic sorting for categories
export const supabase = {
  ...originalClient,
  from: (table: string) => {
    const query = originalClient.from(table);
    const originalSelect = query.select;
    
    // Override the select method to automatically sort category data
    query.select = function(...args: any[]) {
      const selectQuery = originalSelect.apply(this, args);
      const originalThen = selectQuery.then;
      
      // Only apply automatic sorting for tables that are likely categories
      if (isCategoriesTable(table)) {
        selectQuery.then = function(onfulfilled?: ((value: any) => any) | null) {
          return originalThen.call(this, (result) => {
            // Only sort if there was no error and we have data
            if (!result.error && result.data) {
              try {
                // Get the current language from localStorage if available (for web)
                let language = 'en';
                try {
                  if (typeof localStorage !== 'undefined') {
                    const storedLang = localStorage.getItem('language');
                    if (storedLang === 'en' || storedLang === 'da') {
                      language = storedLang;
                    }
                  }
                } catch (e) {
                  // Ignore localStorage errors
                }
                
                // Sort the data
                result.data = sortByLocalizedName(result.data, language);
              } catch (e) {
                // If sorting fails, just return the original data
                console.warn('Auto-sorting failed:', e);
              }
            }
            
            // Pass the result to the original callback
            return onfulfilled ? onfulfilled(result) : result;
          });
        };
      }
      
      return selectQuery;
    };
    
    return query;
  }
};