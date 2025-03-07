/*
  # Create Fuck, Marry, Kill Game Tables

  1. New Tables
    - fuck_marry_kill_categories
      - id (uuid, primary key)
      - created_at (timestamptz)
      - name_[lang] (text) for 15 languages
    
    - fuck_marry_kill_genders
      - id (uuid, primary key) 
      - created_at (timestamptz)
      - name_[lang] (text) for 15 languages

    - fuck_marry_kill_statements
      - id (uuid, primary key)
      - created_at (timestamptz) 
      - category_id (uuid, foreign key)
      - gender_id (uuid, foreign key)
      - text_[lang] (text) for 15 languages

  2. Security
    - Enable RLS on all tables
    - Add public read access policies
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS fuck_marry_kill_categories (
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

-- Create genders table
CREATE TABLE IF NOT EXISTS fuck_marry_kill_genders (
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
CREATE TABLE IF NOT EXISTS fuck_marry_kill_statements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  category_id uuid REFERENCES fuck_marry_kill_categories(id) ON DELETE CASCADE,
  gender_id uuid REFERENCES fuck_marry_kill_genders(id) ON DELETE CASCADE,
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
ALTER TABLE fuck_marry_kill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE fuck_marry_kill_genders ENABLE ROW LEVEL SECURITY;
ALTER TABLE fuck_marry_kill_statements ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for public read access
CREATE POLICY "Allow public read access for categories"
  ON fuck_marry_kill_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access for genders"
  ON fuck_marry_kill_genders
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access for statements"
  ON fuck_marry_kill_statements
  FOR SELECT
  TO public
  USING (true);

-- Insert initial categories
INSERT INTO fuck_marry_kill_categories (name_en, name_da, name_cs, name_de, name_es, name_et, name_fi, name_fr, name_hu, name_is, name_it, name_nl, name_no, name_pl, name_sv) VALUES
  ('Celebrities', 'Kendisser', 'Celebrity', 'Prominente', 'Celebridades', 'Kuulsused', 'Julkkikset', 'Célébrités', 'Hírességek', 'Frægir', 'Celebrità', 'Beroemdheden', 'Kjendiser', 'Celebryci', 'Kändisar');

-- Insert initial genders
INSERT INTO fuck_marry_kill_genders (name_en, name_da, name_cs, name_de, name_es, name_et, name_fi, name_fr, name_hu, name_is, name_it, name_nl, name_no, name_pl, name_sv) VALUES
  ('Male', 'Mand', 'Muž', 'Männlich', 'Masculino', 'Mees', 'Mies', 'Homme', 'Férfi', 'Karl', 'Uomo', 'Man', 'Mann', 'Mężczyzna', 'Man'),
  ('Female', 'Kvinde', 'Žena', 'Weiblich', 'Femenino', 'Naine', 'Nainen', 'Femme', 'Nő', 'Kona', 'Donna', 'Vrouw', 'Kvinne', 'Kobieta', 'Kvinna');

-- Insert initial statements
INSERT INTO fuck_marry_kill_statements (category_id, gender_id, text_en, text_da, text_cs, text_de, text_es, text_et, text_fi, text_fr, text_hu, text_is, text_it, text_nl, text_no, text_pl, text_sv)
SELECT 
  c.id,
  g.id,
  'Brad Pitt',
  'Brad Pitt',
  'Brad Pitt',
  'Brad Pitt',
  'Brad Pitt',
  'Brad Pitt',
  'Brad Pitt',
  'Brad Pitt',
  'Brad Pitt',
  'Brad Pitt',
  'Brad Pitt',
  'Brad Pitt',
  'Brad Pitt',
  'Brad Pitt',
  'Brad Pitt'
FROM fuck_marry_kill_categories c, fuck_marry_kill_genders g
WHERE c.name_en = 'Celebrities' AND g.name_en = 'Male';