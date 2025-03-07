-- Create categories table
CREATE TABLE IF NOT EXISTS random_theme_categories (
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
CREATE TABLE IF NOT EXISTS random_theme_statements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  category_id uuid REFERENCES random_theme_categories(id) ON DELETE CASCADE,
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
ALTER TABLE random_theme_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE random_theme_statements ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for public read access
CREATE POLICY "Allow public read access for categories"
  ON random_theme_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access for statements"
  ON random_theme_statements
  FOR SELECT
  TO public
  USING (true);

-- Insert initial categories
INSERT INTO random_theme_categories (name_en, name_da, name_cs, name_de, name_es, name_et, name_fi, name_fr, name_hu, name_is, name_it, name_nl, name_no, name_pl, name_sv) VALUES
  ('Party Themes', 'Festtemaer', 'Témata večírku', 'Party-Themen', 'Temas de fiesta', 'Peo teemad', 'Juhlateemoja', 'Thèmes de fête', 'Parti témák', 'Veisluþemur', 'Temi per feste', 'Feest thema''s', 'Fest temaer', 'Tematy imprezowe', 'Festteman');

-- Insert initial statements
INSERT INTO random_theme_statements (category_id, text_en, text_da, text_cs, text_de, text_es, text_et, text_fi, text_fr, text_hu, text_is, text_it, text_nl, text_no, text_pl, text_sv)
SELECT 
  c.id,
  '80s Retro Party - Neon colors, cassette tapes, and vintage video games',
  '80''er Retro Fest - Neonfarver, kassettebånd og gamle videospil',
  '80. léta Retro Party - Neonové barvy, kazetové pásky a staré videohry',
  '80er Retro-Party - Neonfarben, Kassetten und Vintage-Videospiele',
  'Fiesta Retro de los 80 - Colores neón, cintas de casete y videojuegos vintage',
  '80ndate retropidu - Neoonvärvid, kassetid ja vanaaegsed videomängud',
  '80-luvun Retrojuhlat - Neonvärit, kasettisoittimet ja vintage-videopelit',
  'Soirée Rétro Années 80 - Couleurs néon, cassettes et jeux vidéo vintage',
  '80-as évek Retro Party - Neon színek, kazetták és régi videójátékok',
  '80''s Retró Partý - Neon litir, kassettuspólur og gömlir tölvuleikir',
  'Festa Retrò Anni 80 - Colori neon, audiocassette e videogiochi vintage',
  '80''s Retro Feest - Neonkleuren, cassettebandjes en vintage videogames',
  '80-talls Retro Fest - Neonfarger, kassetter og vintage videospill',
  'Impreza Retro z lat 80. - Neony, kasety i stare gry wideo',
  '80-tals Retrofest - Neonfärger, kassettband och vintage videospel'
FROM random_theme_categories c
WHERE c.name_en = 'Party Themes';