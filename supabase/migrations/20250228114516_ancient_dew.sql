-- Create categories table
CREATE TABLE IF NOT EXISTS taskmaster_categories (
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
CREATE TABLE IF NOT EXISTS taskmaster_statements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  category_id uuid REFERENCES taskmaster_categories(id) ON DELETE CASCADE,
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
ALTER TABLE taskmaster_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE taskmaster_statements ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for public read access
CREATE POLICY "Allow public read access for categories"
  ON taskmaster_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access for statements"
  ON taskmaster_statements
  FOR SELECT
  TO public
  USING (true);

-- Insert initial categories
INSERT INTO taskmaster_categories (name_en, name_da, name_cs, name_de, name_es, name_et, name_fi, name_fr, name_hu, name_is, name_it, name_nl, name_no, name_pl, name_sv) VALUES
  ('Quick Tasks', 'Hurtige Opgaver', 'Rychlé úkoly', 'Schnelle Aufgaben', 'Tareas rápidas', 'Kiired ülesanded', 'Nopeat tehtävät', 'Tâches rapides', 'Gyors feladatok', 'Fljótverk', 'Compiti veloci', 'Snelle taken', 'Raske oppgaver', 'Szybkie zadania', 'Snabba uppgifter');

-- Insert initial statements
INSERT INTO taskmaster_statements (category_id, text_en, text_da, text_cs, text_de, text_es, text_et, text_fi, text_fr, text_hu, text_is, text_it, text_nl, text_no, text_pl, text_sv)
SELECT 
  c.id,
  'Make the best paper airplane in 30 seconds',
  'Lav det bedste papirfly på 30 sekunder',
  'Udělej nejlepší papírovou vlaštovku za 30 sekund',
  'Baue das beste Papierflugzeug in 30 Sekunden',
  'Haz el mejor avión de papel en 30 segundos',
  'Tee parim paberlennuk 30 sekundiga',
  'Tee paras paperilentokone 30 sekunnissa',
  'Fabrique le meilleur avion en papier en 30 secondes',
  'Készítsd el a legjobb papírrepülőt 30 másodperc alatt',
  'Búðu til besta pappírsflugvélina á 30 sekúndum',
  'Fai il miglior aeroplanino di carta in 30 secondi',
  'Maak het beste papieren vliegtuigje in 30 seconden',
  'Lag det beste papirflyet på 30 sekunder',
  'Zrób najlepszy papierowy samolot w 30 sekund',
  'Gör det bästa pappersflygplanet på 30 sekunder'
FROM taskmaster_categories c
WHERE c.name_en = 'Quick Tasks';