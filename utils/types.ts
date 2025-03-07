export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
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
      never_have_i_ever_