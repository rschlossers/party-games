/*
  # Create You Laugh You Drink Game Tables
  
  1. New Tables
    - `you_laugh_you_drink_categories`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `name_*` (text) for all 15 languages
    - `you_laugh_you_drink_statements`
      - `id` (uuid, primary key) 
      - `created_at` (timestamp)
      - `category_id` (uuid, foreign key)
      - `text_*` (text) for all 15 languages

  2. Security
    - Enable RLS on both tables
    - Add public read access policies
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS you_laugh_you_drink_categories (
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
CREATE TABLE IF NOT EXISTS you_laugh_you_drink_statements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  category_id uuid REFERENCES you_laugh_you_drink_categories(id) ON DELETE CASCADE,
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
ALTER TABLE you_laugh_you_drink_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE you_laugh_you_drink_statements ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for public read access
CREATE POLICY "Allow public read access for categories"
  ON you_laugh_you_drink_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access for statements"
  ON you_laugh_you_drink_statements
  FOR SELECT
  TO public
  USING (true);

-- Insert initial categories
INSERT INTO you_laugh_you_drink_categories (name_en, name_da, name_cs, name_de, name_es, name_et, name_fi, name_fr, name_hu, name_is, name_it, name_nl, name_no, name_pl, name_sv) VALUES
  ('Funny Stories', 'Sjove historier', 'Vtipné příběhy', 'Lustige Geschichten', 'Historias divertidas', 'Naljakad lood', 'Hauskat tarinat', 'Histoires drôles', 'Vicces történetek', 'Fyndnar sögur', 'Storie divertenti', 'Grappige verhalen', 'Morsomme historier', 'Zabawne historie', 'Roliga historier');

-- Insert initial statements
INSERT INTO you_laugh_you_drink_statements (category_id, text_en, text_da, text_cs, text_de, text_es, text_et, text_fi, text_fr, text_hu, text_is, text_it, text_nl, text_no, text_pl, text_sv)
SELECT 
  c.id,
  'I once laughed so hard milk came out of my nose',
  'Jeg grinede engang så meget at mælk kom ud af min næse',
  'Jednou jsem se smál tak moc, že mi mléko vyšlo z nosu',
  'Ich habe einmal so sehr gelacht, dass mir Milch aus der Nase kam',
  'Una vez me reí tan fuerte que la leche me salió por la nariz',
  'Kord naersin ma nii kõvasti, et piim tuli ninast välja',
  'Kerran nauroin niin kovaa, että maito tuli nenästäni',
  'Une fois, j''ai tellement ri que du lait est sorti de mon nez',
  'Egyszer olyan keményen nevettem, hogy tej jött ki az orromból',
  'Einu sinni hló ég svo mikið að mjólk kom út um nefið á mér',
  'Una volta ho riso così tanto che il latte mi è uscito dal naso',
  'Ik lachte ooit zo hard dat er melk uit mijn neus kwam',
  'Jeg lo så hardt en gang at melk kom ut av nesen min',
  'Kiedyś śmiałem się tak mocno, że mleko wyszło mi z nosa',
  'Jag skrattade så hårt en gång att mjölk kom ut ur min näsa'
FROM you_laugh_you_drink_categories c
WHERE c.name_en = 'Funny Stories';