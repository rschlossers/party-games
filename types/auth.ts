import { PartialDatabase } from './common';

export interface AuthTables {
  languages: {
    Row: {
      id: string
      name: string
      created_at: string
    }
    Insert: {
      id: string
      name: string
      created_at?: string
    }
    Update: {
      id?: string
      name?: string
      created_at?: string
    }
  }
  translations: {
    Row: {
      id: string
      language_id: string
      key: string
      value: string
      created_at: string
    }
    Insert: {
      id?: string
      language_id: string
      key: string
      value: string
      created_at?: string
    }
    Update: {
      id?: string
      language_id?: string
      key?: string
      value?: string
      created_at?: string
    }
  }
}