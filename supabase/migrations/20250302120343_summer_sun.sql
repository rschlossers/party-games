/*
  # Date Ideas Game Tables

  1. New Tables
    - `date_ideas_categories`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `name_en`, `name_da`, etc. (15 language columns)
    - `date_ideas_statements`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `category_id` (foreign key)
      - `text_en`, `text_da`, etc. (15 language columns)
  2. Security
    - Enable RLS on both tables
    - Add public read access policies
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS date_ideas_categories (
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
CREATE TABLE IF NOT EXISTS date_ideas_statements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  category_id uuid REFERENCES date_ideas_categories(id) ON DELETE CASCADE,
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
ALTER TABLE date_ideas_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE date_ideas_statements ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for public read access
CREATE POLICY "Allow public read access for categories"
  ON date_ideas_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access for statements"
  ON date_ideas_statements
  FOR SELECT
  TO public
  USING (true);

-- Insert initial categories
INSERT INTO date_ideas_categories (name_en, name_da, name_cs, name_de, name_es, name_et, name_fi, name_fr, name_hu, name_is, name_it, name_nl, name_no, name_pl, name_sv) VALUES
  ('Alphabet Letters', 'Alfabetets bogstaver', 'Písmena abecedy', 'Buchstaben des Alphabets', 'Letras del alfabeto', 'Tähestiku tähed', 'Aakkosten kirjaimet', 'Lettres de l''alphabet', 'Az ábécé betűi', 'Bókstafir í stafrófinu', 'Lettere dell''alfabeto', 'Letters van het alfabet', 'Alfabetets bokstaver', 'Litery alfabetu', 'Alfabetets bokstäver');

-- Insert initial statements
INSERT INTO date_ideas_statements (category_id, text_en, text_da, text_cs, text_de, text_es, text_et, text_fi, text_fr, text_hu, text_is, text_it, text_nl, text_no, text_pl, text_sv)
SELECT 
  c.id,
  'A: Aquarium visit - Spend a day observing marine life together',
  'A: Akvarium besøg - Tilbring en dag med at observere havdyr sammen',
  'A: Návštěva akvária - Strávte společně den pozorováním mořského života',
  'A: Aquariumbesuch - Verbringen Sie gemeinsam einen Tag mit der Beobachtung von Meereslebewesen',
  'A: Visita al acuario - Pasen un día observando la vida marina juntos',
  'A: Akvaariumi külastus - Veetke päev koos mereelu vaadeldes',
  'A: Akvaariokäynti - Viettäkää päivä tarkkailemassa merielämää yhdessä',
  'A: Visite d''aquarium - Passez une journée à observer la vie marine ensemble',
  'A: Akvárium látogatás - Töltsön egy napot a tengeri élet megfigyelésével',
  'A: Heimsókn í fiskabúr - Eyðið degi saman við að fylgjast með sjávarlífi',
  'A: Visita all''acquario - Trascorri una giornata osservando la vita marina insieme',
  'A: Aquarium bezoek - Breng samen een dag door met het observeren van zeeleven',
  'A: Akvariebesøk - Tilbring en dag med å observere marint liv sammen',
  'A: Wizyta w akwarium - Spędźcie dzień obserwując życie morskie razem',
  'A: Akvarium besök - Spendera en dag med att observera marint liv tillsammans'
FROM date_ideas_categories c
WHERE c.name_en = 'Alphabet Letters';