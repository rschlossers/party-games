/*
  # Create pickup lines game tables

  1. New Tables
    - `pickup_lines_categories`: Categories for pickup lines
    - `pickup_lines_statements`: The pickup lines themselves
  
  2. Structure
    - Both tables include all 15 supported languages
    - Added example data to both tables
  
  3. Security
    - Enable RLS with public read-only access
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS pickup_lines_categories (
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
CREATE TABLE IF NOT EXISTS pickup_lines_statements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  category_id uuid REFERENCES pickup_lines_categories(id) ON DELETE CASCADE,
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
ALTER TABLE pickup_lines_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pickup_lines_statements ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for public read access
CREATE POLICY "Allow public read access for categories"
  ON pickup_lines_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access for statements"
  ON pickup_lines_statements
  FOR SELECT
  TO public
  USING (true);

-- Insert initial categories
INSERT INTO pickup_lines_categories (name_en, name_da, name_cs, name_de, name_es, name_et, name_fi, name_fr, name_hu, name_is, name_it, name_nl, name_no, name_pl, name_sv) VALUES
  ('Funny', 'Sjove', 'Vtipné', 'Lustig', 'Divertidos', 'Naljakad', 'Hauskat', 'Drôles', 'Vicces', 'Fyndið', 'Divertenti', 'Grappig', 'Morsomme', 'Zabawne', 'Roliga');

-- Insert initial statements
INSERT INTO pickup_lines_statements (category_id, text_en, text_da, text_cs, text_de, text_es, text_et, text_fi, text_fr, text_hu, text_is, text_it, text_nl, text_no, text_pl, text_sv)
SELECT 
  c.id,
  'Are you made of copper and tellurium? Because you''re Cu-Te',
  'Er du lavet af kobber og tellurium? For du er Cu-Te (sød)',
  'Jsi vyroben z mědi a telluru? Protože jsi Cu-Te',
  'Bestehst du aus Kupfer und Tellur? Weil du Cu-Te bist',
  '¿Estás hecho de cobre y telurio? Porque eres Cu-Te',
  'Kas sa koosned vasest ja telluurist? Sest sa oled Cu-Te',
  'Oletko tehty kuparista ja telluurista? Koska olet Cu-Te',
  'Es-tu fait de cuivre et de tellure? Parce que tu es Cu-Te',
  'Rézből és tellúriumból vagy? Mert Cu-Te vagy',
  'Ertu gerður úr kopar og tellúr? Því þú ert Cu-Te',
  'Sei fatto di rame e tellurio? Perché sei Cu-Te',
  'Ben je gemaakt van koper en tellurium? Want je bent Cu-Te',
  'Er du laget av kobber og tellur? Fordi du er Cu-Te',
  'Czy jesteś zrobiony z miedzi i telluru? Bo jesteś Cu-Te',
  'Är du gjord av koppar och tellur? För du är Cu-Te'
FROM pickup_lines_categories c
WHERE c.name_en = 'Funny';