/*
  # Create Everyone Who Stands Game Tables

  1. New Tables
    - `everyone_who_stands_categories`
      - `id` (uuid, primary key)
      - `created_at` (timestamptz)
      - `name_en` (text)
      - `name_da` (text)
      - And other language columns

    - `everyone_who_stands_statements`
      - `id` (uuid, primary key)
      - `created_at` (timestamptz)
      - `category_id` (uuid, foreign key)
      - `text_en` (text)
      - `text_da` (text)
      - And other language columns

  2. Security
    - Enable RLS on both tables
    - Add public read access policies
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS everyone_who_stands_categories (
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
CREATE TABLE IF NOT EXISTS everyone_who_stands_statements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  category_id uuid REFERENCES everyone_who_stands_categories(id) ON DELETE CASCADE,
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
ALTER TABLE everyone_who_stands_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE everyone_who_stands_statements ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for public read access
CREATE POLICY "Allow public read access for categories"
  ON everyone_who_stands_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access for statements"
  ON everyone_who_stands_statements
  FOR SELECT
  TO public
  USING (true);

-- Insert initial categories
INSERT INTO everyone_who_stands_categories (name_en, name_da, name_cs, name_de, name_es, name_et, name_fi, name_fr, name_hu, name_is, name_it, name_nl, name_no, name_pl, name_sv) VALUES
  ('Childhood', 'Barndom', 'Dětství', 'Kindheit', 'Infancia', 'Lapsepõlv', 'Lapsuus', 'Enfance', 'Gyermekkor', 'Barnæska', 'Infanzia', 'Kindertijd', 'Barndom', 'Dzieciństwo', 'Barndom'),
  ('School', 'Skole', 'Škola', 'Schule', 'Escuela', 'Kool', 'Koulu', 'École', 'Iskola', 'Skóli', 'Scuola', 'School', 'Skole', 'Szkoła', 'Skola'),
  ('Work', 'Arbejde', 'Práce', 'Arbeit', 'Trabajo', 'Töö', 'Työ', 'Travail', 'Munka', 'Vinna', 'Lavoro', 'Werk', 'Arbeid', 'Praca', 'Arbete'),
  ('Relationships', 'Forhold', 'Vztahy', 'Beziehungen', 'Relaciones', 'Suhted', 'Suhteet', 'Relations', 'Kapcsolatok', 'Sambönd', 'Relazioni', 'Relaties', 'Relasjoner', 'Relacje', 'Relationer');

-- Insert initial statements
INSERT INTO everyone_who_stands_statements (category_id, text_en, text_da, text_cs, text_de, text_es, text_et, text_fi, text_fr, text_hu, text_is, text_it, text_nl, text_no, text_pl, text_sv)
SELECT 
  c.id,
  'Has ever broken a bone',
  'Har nogensinde brækket et ben',
  'Někdy si zlomil kost',
  'Hat sich jemals einen Knochen gebrochen',
  'Alguna vez se ha roto un hueso',
  'On kunagi luud murdnud',
  'On joskus murtanut luun',
  'A déjà cassé un os',
  'Valaha is tört csontot',
  'Hefur einhvern tímann brotið bein',
  'Ha mai rotto un osso',
  'Heeft ooit een bot gebroken',
  'Har noen gang brukket et bein',
  'Kiedykolwiek złamał kość',
  'Har någonsin brutit ett ben'
FROM everyone_who_stands_categories c
WHERE c.name_en = 'Childhood';