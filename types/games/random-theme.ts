import { PartialDatabase } from '../common';

export interface RandomThemeTables {
  random_theme_categories: {
    Row: {
      id: string
      created_at: string
      name_en: string
      name_da: string
      name_cs: string
      name_de: string
      name_es: string
      name_et: string
      name_fi: string
      name_fr: string
      name_hu: string
      name_is: string
      name_it: string
      name_nl: string
      name_no: string
      name_pl: string
      name_sv: string
    }
    Insert: {
      id?: string
      created_at?: string
      name_en: string
      name_da: string
      name_cs: string
      name_de: string
      name_es: string
      name_et: string
      name_fi: string
      name_fr: string
      name_hu: string
      name_is: string
      name_it: string
      name_nl: string
      name_no: string
      name_pl: string
      name_sv: string
    }
    Update: {
      id?: string
      created_at?: string
      name_en?: string
      name_da?: string
      name_cs?: string
      name_de?: string
      name_es?: string
      name_et?: string
      name_fi?: string
      name_fr?: string
      name_hu?: string
      name_is?: string
      name_it?: string
      name_nl?: string
      name_no?: string
      name_pl?: string
      name_sv?: string
    }
  }
  random_theme_statements: {
    Row: {
      id: string
      created_at: string
      category_id: string
      text_en: string
      text_da: string
      text_cs: string
      text_de: string
      text_es: string
      text_et: string
      text_fi: string
      text_fr: string
      text_hu: string
      text_is: string
      text_it: string
      text_nl: string
      text_no: string
      text_pl: string
      text_sv: string
    }
    Insert: {
      id?: string
      created_at?: string
      category_id: string
      text_en: string
      text_da: string
      text_cs: string
      text_de: string
      text_es: string
      text_et: string
      text_fi: string
      text_fr: string
      text_hu: string
      text_is: string
      text_it: string
      text_nl: string
      text_no: string
      text_pl: string
      text_sv: string
    }
    Update: {
      id?: string
      created_at?: string
      category_id?: string
      text_en?: string
      text_da?: string
      text_cs?: string
      text_de?: string
      text_es?: string
      text_et?: string
      text_fi?: string
      text_fr?: string
      text_hu?: string
      text_is?: string
      text_it?: string
      text_nl?: string
      text_no?: string
      text_pl?: string
      text_sv?: string
    }
  }
}