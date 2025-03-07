export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Export the database interface structure that will be composed of parts
export interface PartialDatabase {
  Tables: {
    [key: string]: {
      Row: any;
      Insert: any;
      Update: any;
    }
  }
}