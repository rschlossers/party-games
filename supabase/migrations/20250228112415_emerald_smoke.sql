-- Create categories table
CREATE TABLE IF NOT EXISTS would_you_rather_categories (
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
CREATE TABLE IF NOT EXISTS would_you_rather_statements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  category_id uuid REFERENCES would_you_rather_categories(id) ON DELETE CASCADE,
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
ALTER TABLE would_you_rather_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE would_you_rather_statements ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for public read access
CREATE POLICY "Allow public read access for categories"
  ON would_you_rather_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access for statements"
  ON would_you_rather_statements
  FOR SELECT
  TO public
  USING (true);

-- Insert initial categories
INSERT INTO would_you_rather_categories (name_en, name_da, name_cs, name_de, name_es, name_et, name_fi, name_fr, name_hu, name_is, name_it, name_nl, name_no, name_pl, name_sv) VALUES
  ('Lifestyle', 'Livsstil', 'Životní styl', 'Lebensstil', 'Estilo de vida', 'Elustiil', 'Elämäntapa', 'Style de vie', 'Életmód', 'Lífsstíll', 'Stile di vita', 'Levensstijl', 'Livsstil', 'Styl życia', 'Livsstil');

-- Insert initial statements
INSERT INTO would_you_rather_statements (category_id, text_en, text_da, text_cs, text_de, text_es, text_et, text_fi, text_fr, text_hu, text_is, text_it, text_nl, text_no, text_pl, text_sv)
SELECT 
  c.id,
  'Would you rather be able to fly or be invisible?',
  'Vil du hellere kunne flyve eller være usynlig?',
  'Chtěli byste raději umět létat nebo být neviditelní?',
  'Würden Sie lieber fliegen können oder unsichtbar sein?',
  '¿Preferirías poder volar o ser invisible?',
  'Kas sa eelistaksid lennata või olla nähtamatu?',
  'Haluaisitko mieluummin lentää vai olla näkymätön?',
  'Préféreriez-vous pouvoir voler ou être invisible ?',
  'Inkább repülni tudnál vagy láthatatlan lennél?',
  'Myndir þú frekar vilja geta flogið eða verið ósýnilegur?',
  'Preferiresti poter volare o essere invisibile?',
  'Zou je liever kunnen vliegen of onzichtbaar zijn?',
  'Ville du heller kunne fly eller være usynlig?',
  'Wolałbyś umieć latać czy być niewidzialnym?',
  'Skulle du hellre kunna flyga eller vara osynlig?'
FROM would_you_rather_categories c
WHERE c.name_en = 'Lifestyle';