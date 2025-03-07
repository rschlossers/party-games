/*
  # Video Challenges Tables

  1. New Tables
    - `video_challenges_categories`
      - `id` (uuid, primary key)
      - `created_at` (timestamptz)
      - `name_[lang]` (text) for 15 languages
    - `video_challenges_statements`
      - `id` (uuid, primary key)
      - `created_at` (timestamptz)
      - `category_id` (uuid, foreign key)
      - `text_[lang]` (text) for 15 languages

  2. Security
    - Enable RLS on both tables
    - Add public read access policies
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS video_challenges_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name_en text NOT NULL,
  name_da text NOT NULL,
  name_cs text NOT NULL,
  name_de text NOT NULL,
  name_es text NOT NULL,
  name_et text NOT NULL,
  name_fi text NOT NULL,
  name_fr text NOT NULL,
  name_hu text NOT NULL,
  name_is text NOT NULL,
  name_it text NOT NULL,
  name_nl text NOT NULL,
  name_no text NOT NULL,
  name_pl text NOT NULL,
  name_sv text NOT NULL
);

-- Create statements table
CREATE TABLE IF NOT EXISTS video_challenges_statements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  category_id uuid REFERENCES video_challenges_categories(id) ON DELETE CASCADE,
  text_en text NOT NULL,
  text_da text NOT NULL,
  text_cs text NOT NULL,
  text_de text NOT NULL,
  text_es text NOT NULL,
  text_et text NOT NULL,
  text_fi text NOT NULL,
  text_fr text NOT NULL,
  text_hu text NOT NULL,
  text_is text NOT NULL,
  text_it text NOT NULL,
  text_nl text NOT NULL,
  text_no text NOT NULL,
  text_pl text NOT NULL,
  text_sv text NOT NULL
);

-- Enable RLS
ALTER TABLE video_challenges_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_challenges_statements ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for public read access
CREATE POLICY "Allow public read access for categories"
  ON video_challenges_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access for statements"
  ON video_challenges_statements
  FOR SELECT
  TO public
  USING (true);

-- Insert initial categories
INSERT INTO video_challenges_categories (name_en, name_da, name_cs, name_de, name_es, name_et, name_fi, name_fr, name_hu, name_is, name_it, name_nl, name_no, name_pl, name_sv) VALUES
  ('Dance Moves', 'Dansetrin', 'Taneční pohyby', 'Tanzbewegungen', 'Pasos de baile', 'Tantsuliigutused', 'Tanssiliikkeet', 'Pas de danse', 'Tánclépések', 'Dansspor', 'Passi di danza', 'Dansbewegingen', 'Dansebevegelser', 'Kroki taneczne', 'Dansrörelser');

-- Insert initial statements
INSERT INTO video_challenges_statements (category_id, text_en, text_da, text_cs, text_de, text_es, text_et, text_fi, text_fr, text_hu, text_is, text_it, text_nl, text_no, text_pl, text_sv)
SELECT 
  c.id,
  'Create a 30-second TikTok-style dance routine',
  'Lav en 30-sekunders TikTok-lignende danserutine',
  'Vytvořte 30sekundovou taneční rutinu ve stylu TikTok',
  'Erstelle eine 30-sekündige TikTok-ähnliche Tanzroutine',
  'Crea una rutina de baile estilo TikTok de 30 segundos',
  'Loo 30-sekundiline TikTok-stiilis tantsurütm',
  'Luo 30 sekunnin TikTok-tyylinen tanssikoreografia',
  'Créez une routine de danse de 30 secondes style TikTok',
  'Készíts egy 30 másodperces TikTok-stílusú táncrutint',
  'Búðu til 30 sekúndna TikTok-stíl dansrútínu',
  'Crea una routine di danza stile TikTok di 30 secondi',
  'Maak een 30 seconden durende TikTok-stijl dansroutine',
  'Lag en 30-sekunders TikTok-lignende danserutine',
  'Stwórz 30-sekundową rutynę taneczną w stylu TikTok',
  'Skapa en 30-sekunders TikTok-liknande dansrutin'
FROM video_challenges_categories c
WHERE c.name_en = 'Dance Moves';