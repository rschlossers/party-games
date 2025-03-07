/*
  # Add I Wish I Didn't Know That game tables

  1. New Tables
    - `i_should_know_that_categories`
      - `id` (uuid, primary key)
      - `created_at` (timestamptz)
      - `name_en` (text)
      - `name_da` (text)
      - `name_cs` (text)
      - `name_de` (text)
      - `name_es` (text)
      - `name_et` (text)
      - `name_fi` (text)
      - `name_fr` (text)
      - `name_hu` (text)
      - `name_is` (text)
      - `name_it` (text)
      - `name_nl` (text)
      - `name_no` (text)
      - `name_pl` (text)
      - `name_sv` (text)

    - `i_should_know_that_statements`
      - `id` (uuid, primary key)
      - `created_at` (timestamptz)
      - `category_id` (uuid, foreign key)
      - `text_en` (text)
      - `text_da` (text)
      - `text_cs` (text)
      - `text_de` (text)
      - `text_es` (text)
      - `text_et` (text)
      - `text_fi` (text)
      - `text_fr` (text)
      - `text_hu` (text)
      - `text_is` (text)
      - `text_it` (text)
      - `text_nl` (text)
      - `text_no` (text)
      - `text_pl` (text)
      - `text_sv` (text)

  2. Security
    - Enable RLS on both tables
    - Add public read access policies
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS i_wish_i_didnt_know_that_categories (
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
CREATE TABLE IF NOT EXISTS i_wish_i_didnt_know_that_statements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  category_id uuid REFERENCES i_wish_i_didnt_know_that_categories(id) ON DELETE CASCADE,
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
ALTER TABLE i_wish_i_didnt_know_that_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE i_wish_i_didnt_know_that_statements ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for public read access
CREATE POLICY "Allow public read access for categories"
  ON i_wish_i_didnt_know_that_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access for statements"
  ON i_wish_i_didnt_know_that_statements
  FOR SELECT
  TO public
  USING (true);

-- Insert initial categories
INSERT INTO i_wish_i_didnt_know_that_categories (name_en, name_da, name_cs, name_de, name_es, name_et, name_fi, name_fr, name_hu, name_is, name_it, name_nl, name_no, name_pl, name_sv) VALUES
  ('Weird Facts', 'Mærkelige fakta', 'Podivná fakta', 'Seltsame Fakten', 'Hechos extraños', 'Veidrad faktid', 'Outoja faktoja', 'Faits étranges', 'Furcsa tények', 'Skrýtin staðreyndir', 'Fatti strani', 'Vreemde feiten', 'Rare fakta', 'Dziwne fakty', 'Konstiga fakta');

-- Insert initial statements
INSERT INTO i_wish_i_didnt_know_that_statements (category_id, text_en, text_da, text_cs, text_de, text_es, text_et, text_fi, text_fr, text_hu, text_is, text_it, text_nl, text_no, text_pl, text_sv)
SELECT 
  c.id,
  'Dolphins sleep with one eye open',
  'Delfiner sover med et øje åbent',
  'Delfíni spí s jedním okem otevřeným',
  'Delfine schlafen mit einem offenen Auge',
  'Los delfines duermen con un ojo abierto',
  'Delfiinid magavad ühe silmaga',
  'Delfiinit nukkuvat toinen silmä auki',
  'Les dauphins dorment avec un œil ouvert',
  'A delfinek egy szemmel alszanak',
  'Höfrungar sofa með annað augað opið',
  'I delfini dormono con un occhio aperto',
  'Dolfijnen slapen met één oog open',
  'Delfiner sover med ett øye åpent',
  'Delfiny śpią z jednym okiem otwartym',
  'Delfiner sover med ett öga öppet'
FROM i_wish_i_didnt_know_that_categories c
WHERE c.name_en = 'Weird Facts';