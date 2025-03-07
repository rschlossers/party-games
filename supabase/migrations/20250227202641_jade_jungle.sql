/*
  # Create I Should Know That Game

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
CREATE TABLE IF NOT EXISTS i_should_know_that_categories (
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
CREATE TABLE IF NOT EXISTS i_should_know_that_statements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  category_id uuid REFERENCES i_should_know_that_categories(id) ON DELETE CASCADE,
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
ALTER TABLE i_should_know_that_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE i_should_know_that_statements ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for public read access
CREATE POLICY "Allow public read access for categories"
  ON i_should_know_that_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access for statements"
  ON i_should_know_that_statements
  FOR SELECT
  TO public
  USING (true);