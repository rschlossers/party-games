/*
  # Add translations tables

  1. New Tables
    - `languages`
      - `id` (text, primary key) - Language code (e.g., 'en', 'da')
      - `name` (text) - Language name in its native form
      - `created_at` (timestamp)
    
    - `translations`
      - `id` (uuid, primary key)
      - `language_id` (text) - References languages.id
      - `key` (text) - Translation key (e.g., 'settings.title')
      - `value` (text) - Translated text
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
*/

-- Create languages table
CREATE TABLE IF NOT EXISTS languages (
  id text PRIMARY KEY,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create translations table
CREATE TABLE IF NOT EXISTS translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  language_id text REFERENCES languages(id) ON DELETE CASCADE,
  key text NOT NULL,
  value text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(language_id, key)
);

-- Enable RLS
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Allow public read access for languages"
  ON languages
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access for translations"
  ON translations
  FOR SELECT
  TO public
  USING (true);

-- Insert initial languages
INSERT INTO languages (id, name) VALUES
  ('en', 'English'),
  ('da', 'Dansk');

-- Insert initial translations
INSERT INTO translations (language_id, key, value) VALUES
  -- English translations
  ('en', 'settings.title', 'Settings'),
  ('en', 'settings.language', 'Language'),
  ('en', 'settings.theme', 'Theme'),
  ('en', 'wouldYouRather.title', 'Would You Rather'),
  ('en', 'wouldYouRather.or', 'OR'),
  ('en', 'wouldYouRather.next', 'Next Question'),
  ('en', 'neverHaveIEver.title', 'Never Have I Ever'),
  ('en', 'neverHaveIEver.selectCategory', 'Select a category'),
  ('en', 'neverHaveIEver.next', 'Next Statement'),
  ('en', 'neverHaveIEver.noStatements', 'No statements available'),
  ('en', 'neverHaveIEver.startGame', 'Start Game'),

  -- Danish translations
  ('da', 'settings.title', 'Indstillinger'),
  ('da', 'settings.language', 'Sprog'),
  ('da', 'settings.theme', 'Tema'),
  ('da', 'wouldYouRather.title', 'Vil Du Hellere'),
  ('da', 'wouldYouRather.or', 'ELLER'),
  ('da', 'wouldYouRather.next', 'Næste Spørgsmål'),
  ('da', 'neverHaveIEver.title', 'Jeg Har Aldrig'),
  ('da', 'neverHaveIEver.selectCategory', 'Vælg en kategori'),
  ('da', 'neverHaveIEver.next', 'Næste Udsagn'),
  ('da', 'neverHaveIEver.noStatements', 'Ingen udsagn tilgængelige'),
  ('da', 'neverHaveIEver.startGame', 'Start Spil');