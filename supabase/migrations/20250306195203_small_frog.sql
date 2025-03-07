/*
  # Say the Same Thing Game Tables

  1. New Tables
    - `say_the_same_thing_categories`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `name_[lang]` (text) for 15 languages
    - `say_the_same_thing_statements`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `category_id` (uuid, foreign key)
      - `text_[lang]` (text) for 15 languages

  2. Security
    - Enable RLS on both tables
    - Add public read-only access policies
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS say_the_same_thing_categories (
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

-- Enable RLS for categories
ALTER TABLE say_the_same_thing_categories ENABLE ROW LEVEL SECURITY;

-- Add read-only policy for categories
CREATE POLICY "Allow public read access for categories"
  ON say_the_same_thing_categories
  FOR SELECT
  TO public
  USING (true);

-- Create statements table
CREATE TABLE IF NOT EXISTS say_the_same_thing_statements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  category_id uuid REFERENCES say_the_same_thing_categories(id) ON DELETE CASCADE,
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

-- Enable RLS for statements
ALTER TABLE say_the_same_thing_statements ENABLE ROW LEVEL SECURITY;

-- Add read-only policy for statements
CREATE POLICY "Allow public read access for statements"
  ON say_the_same_thing_statements
  FOR SELECT
  TO public
  USING (true);

-- Insert example category
INSERT INTO say_the_same_thing_categories (
  name_en, name_da, name_cs, name_de, name_es, name_et, name_fi, name_fr, 
  name_hu, name_is, name_it, name_nl, name_no, name_pl, name_sv
) VALUES (
  'Basic Words', 'Grundlæggende Ord', 'Základní Slova', 'Grundwörter', 'Palabras Básicas',
  'Põhisõnad', 'Perussanat', 'Mots de Base', 'Alapszavak', 'Grunnorð',
  'Parole Base', 'Basiswoorden', 'Grunnleggende Ord', 'Podstawowe Słowa', 'Grundord'
);

-- Insert example statement
INSERT INTO say_the_same_thing_statements (
  category_id,
  text_en, text_da, text_cs, text_de, text_es, text_et, text_fi, text_fr,
  text_hu, text_is, text_it, text_nl, text_no, text_pl, text_sv
) VALUES (
  (SELECT id FROM say_the_same_thing_categories LIMIT 1),
  'Apple', 'Æble', 'Jablko', 'Apfel', 'Manzana',
  'Õun', 'Omena', 'Pomme', 'Alma', 'Epli',
  'Mela', 'Appel', 'Eple', 'Jabłko', 'Äpple'
);