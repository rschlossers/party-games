-- Create categories table
CREATE TABLE IF NOT EXISTS photo_challenges_categories (
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
CREATE TABLE IF NOT EXISTS photo_challenges_statements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  category_id uuid REFERENCES photo_challenges_categories(id) ON DELETE CASCADE,
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
ALTER TABLE photo_challenges_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_challenges_statements ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for public read access
CREATE POLICY "Allow public read access for categories"
  ON photo_challenges_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access for statements"
  ON photo_challenges_statements
  FOR SELECT
  TO public
  USING (true);

-- Insert initial categories
INSERT INTO photo_challenges_categories (name_en, name_da, name_cs, name_de, name_es, name_et, name_fi, name_fr, name_hu, name_is, name_it, name_nl, name_no, name_pl, name_sv) VALUES
  ('Creative', 'Kreativ', 'Kreativní', 'Kreativ', 'Creativo', 'Loov', 'Luova', 'Créatif', 'Kreatív', 'Skapandi', 'Creativo', 'Creatief', 'Kreativ', 'Kreatywny', 'Kreativ');

-- Insert initial statements
INSERT INTO photo_challenges_statements (category_id, text_en, text_da, text_cs, text_de, text_es, text_et, text_fi, text_fr, text_hu, text_is, text_it, text_nl, text_no, text_pl, text_sv)
SELECT 
  c.id,
  'Take a photo that represents "happiness" without showing any faces',
  'Tag et billede der repræsenterer "lykke" uden at vise ansigter',
  'Vyfoťte obrázek, který představuje "štěstí" bez zobrazení obličejů',
  'Machen Sie ein Foto, das "Glück" darstellt, ohne Gesichter zu zeigen',
  'Toma una foto que represente "felicidad" sin mostrar rostros',
  'Tee foto, mis kujutab "õnne" ilma nägusid näitamata',
  'Ota kuva, joka edustaa "onnellisuutta" näyttämättä kasvoja',
  'Prenez une photo qui représente le "bonheur" sans montrer de visages',
  'Készíts egy képet, ami "boldogságot" ábrázol arcok nélkül',
  'Taktu mynd sem táknar "hamingju" án þess að sýna andlit',
  'Scatta una foto che rappresenti la "felicità" senza mostrare volti',
  'Maak een foto die "geluk" vertegenwoordigt zonder gezichten te tonen',
  'Ta et bilde som representerer "lykke" uten å vise ansikter',
  'Zrób zdjęcie przedstawiające "szczęście" bez pokazywania twarzy',
  'Ta en bild som representerar "lycka" utan att visa några ansikten'
FROM photo_challenges_categories c
WHERE c.name_en = 'Creative';