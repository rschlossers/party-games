/*
  # Never Have I Ever Database Schema

  1. New Tables
    - `never_have_i_ever_categories`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `name_en` (text) - English category name
      - `name_da` (text) - Danish category name

    - `never_have_i_ever_statements`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `category_id` (uuid, foreign key)
      - `text_en` (text) - English statement
      - `text_da` (text) - Danish statement

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS never_have_i_ever_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name_en text NOT NULL,
  name_da text NOT NULL
);

-- Create statements table
CREATE TABLE IF NOT EXISTS never_have_i_ever_statements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  category_id uuid REFERENCES never_have_i_ever_categories(id) ON DELETE CASCADE,
  text_en text NOT NULL,
  text_da text NOT NULL
);

-- Enable RLS
ALTER TABLE never_have_i_ever_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE never_have_i_ever_statements ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for public read access
CREATE POLICY "Allow public read access for categories"
  ON never_have_i_ever_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access for statements"
  ON never_have_i_ever_statements
  FOR SELECT
  TO public
  USING (true);

-- Insert initial categories
INSERT INTO never_have_i_ever_categories (name_en, name_da) VALUES
  ('Party Stories', 'Festhistorier'),
  ('Travel & Adventure', 'Rejser & Eventyr'),
  ('Food & Drinks', 'Mad & Drikke'),
  ('Life Experiences', 'Livserfaringer');

-- Insert initial statements
INSERT INTO never_have_i_ever_statements (category_id, text_en, text_da)
SELECT 
  c.id,
  'Crashed a wedding',
  'Crashet et bryllup'
FROM never_have_i_ever_categories c
WHERE c.name_en = 'Party Stories'
UNION ALL
SELECT 
  c.id,
  'Karaoked in front of strangers',
  'Sunget karaoke foran fremmede'
FROM never_have_i_ever_categories c
WHERE c.name_en = 'Party Stories'
UNION ALL
SELECT 
  c.id,
  'Danced on a table',
  'Danset på et bord'
FROM never_have_i_ever_categories c
WHERE c.name_en = 'Party Stories';