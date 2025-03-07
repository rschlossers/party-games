/*
  # Create Do or Drink Game Tables

  1. New Tables
    - `do_or_drink_categories`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `name_[lang]` (text) for 15 languages
    - `do_or_drink_statements`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `category_id` (uuid, foreign key)
      - `text_[lang]` (text) for 15 languages

  2. Security
    - Enable RLS on both tables
    - Add public read-only access policies
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS do_or_drink_categories (
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
CREATE TABLE IF NOT EXISTS do_or_drink_statements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  category_id uuid REFERENCES do_or_drink_categories(id) ON DELETE CASCADE,
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

-- Enable Row Level Security
ALTER TABLE do_or_drink_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE do_or_drink_statements ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access for categories"
  ON do_or_drink_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access for statements"
  ON do_or_drink_statements
  FOR SELECT
  TO public
  USING (true);

-- Insert example data
INSERT INTO do_or_drink_categories (
  name_en, name_da, name_cs, name_de, name_es, name_et, name_fi, name_fr, 
  name_hu, name_is, name_it, name_nl, name_no, name_pl, name_sv
) VALUES (
  'Party Challenges', 'Festudfordringer', 'Párty výzvy', 'Party-Herausforderungen',
  'Desafíos de fiesta', 'Peo väljakutsed', 'Juhlien haasteet', 'Défis de fête',
  'Parti kihívások', 'Partí áskoranir', 'Sfide per feste', 'Feestuitdagingen',
  'Fest utfordringer', 'Wyzwania imprezowe', 'Festutmaningar'
);

INSERT INTO do_or_drink_statements (
  category_id,
  text_en, text_da, text_cs, text_de, text_es, text_et, text_fi, text_fr,
  text_hu, text_is, text_it, text_nl, text_no, text_pl, text_sv
) VALUES (
  (SELECT id FROM do_or_drink_categories LIMIT 1),
  'Do a handstand or take a drink', 'Lav en håndstand eller tag en drink',
  'Udělej stojku nebo se napij', 'Mach einen Handstand oder trink',
  'Haz el pino o bebe', 'Tee kätelseisu või joo', 'Tee käsilläseisonta tai juo',
  'Fais le poirier ou bois', 'Állj kézen vagy igyál', 'Gerðu handstöðu eða drekktu',
  'Fai la verticale o bevi', 'Doe een handstand of drink', 'Gjør en håndstand eller drikk',
  'Zrób stanie na rękach albo wypij', 'Gör en handstående eller ta en drink'
);