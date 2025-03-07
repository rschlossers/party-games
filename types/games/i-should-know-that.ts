import { PartialDatabase } from '../common';

export interface IShouldKnowThatTables {
  i_should_know_that_categories: {
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
  i_should_know_that_statements: {
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