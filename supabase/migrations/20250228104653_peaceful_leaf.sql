/*
  # Create You Lie You Drink Game Tables
  
  1. New Tables
    - `you_lie_you_drink_categories`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `name_*` (text) for all 15 languages
    - `you_lie_you_drink_statements`
      - `id` (uuid, primary key) 
      - `created_at` (timestamp)
      - `category_id` (uuid, foreign key)
      - `text_*` (text) for all 15 languages

  2. Security
    - Enable RLS on both tables
    - Add public read access policies
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS you_lie_you_drink_categories (
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
CREATE TABLE IF NOT EXISTS you_lie_you_drink_statements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  category_id uuid REFERENCES you_lie_you_drink_categories(id) ON DELETE CASCADE,
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
ALTER TABLE you_lie_you_drink_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE you_lie_you_drink_statements ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for public read access
CREATE POLICY "Allow public read access for categories"
  ON you_lie_you_drink_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access for statements"
  ON you_lie_you_drink_statements
  FOR SELECT
  TO public
  USING (true);

-- Insert initial categories
INSERT INTO you_lie_you_drink_categories (name_en, name_da, name_cs, name_de, name_es, name_et, name_fi, name_fr, name_hu, name_is, name_it, name_nl, name_no, name_pl, name_sv) VALUES
  ('Personal Questions', 'Personlige spørgsmål', 'Osobní otázky', 'Persönliche Fragen', 'Preguntas personales', 'Isiklikud küsimused', 'Henkilökohtaiset kysymykset', 'Questions personnelles', 'Személyes kérdések', 'Persónulegar spurningar', 'Domande personali', 'Persoonlijke vragen', 'Personlige spørsmål', 'Pytania osobiste', 'Personliga frågor');

-- Insert initial statements
INSERT INTO you_lie_you_drink_statements (category_id, text_en, text_da, text_cs, text_de, text_es, text_et, text_fi, text_fr, text_hu, text_is, text_it, text_nl, text_no, text_pl, text_sv)
SELECT 
  c.id,
  'Have you ever pretended to know a famous person?',
  'Har du nogensinde ladet som om, at du kendte en berømt person?',
  'Předstírali jste někdy, že znáte slavnou osobu?',
  'Hast du jemals so getan, als würdest du eine berühmte Person kennen?',
  '¿Alguna vez has fingido conocer a una persona famosa?',
  'Kas oled kunagi teeselnud, et tunned kuulsat inimest?',
  'Oletko koskaan teeskennellyt tuntevasi kuuluisan henkilön?',
  'Avez-vous déjà prétendu connaître une personne célèbre?',
  'Tetettél már úgy, mintha ismernél egy híres embert?',
  'Hefur þú einhvern tímann þóst þekkja fræga manneskju?',
  'Hai mai finto di conoscere una persona famosa?',
  'Heb je ooit gedaan alsof je een beroemd persoon kende?',
  'Har du noen gang latet som om du kjente en kjent person?',
  'Czy kiedykolwiek udawałeś, że znasz sławną osobę?',
  'Har du någonsin låtsats känna en känd person?'
FROM you_lie_you_drink_categories c
WHERE c.name_en = 'Personal Questions';