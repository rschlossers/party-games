import { PartialDatabase } from '../common';

export interface BestStoryWinsTables {
  best_story_wins_categories: {
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
  best_story_wins_statements: {
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