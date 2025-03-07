import { PartialDatabase } from '../common';

export interface NeverHaveIEverTables {
  never_have_i_ever_categories: {
    Row: {
      id: string
      created_at: string
      name_en: string
      name_da: string
    }
    Insert: {
      id?: string
      created_at?: string
      name_en: string
      name_da: string
    }
    Update: {
      id?: string
      created_at?: string
      name_en?: string
      name_da?: string
    }
  }
  never_have_i_ever_statements: {
    Row: {
      id: string
      created_at: string
      category_id: string
      text_en: string
      text_da: string
    }
    Insert: {
      id?: string
      created_at?: string
      category_id: string
      text_en: string
      text_da: string
    }
    Update: {
      id?: string
      created_at?: string
      category_id?: string
      text_en?: string
      text_da?: string
    }
  }
}