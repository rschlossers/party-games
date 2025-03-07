-- Create truth categories table
CREATE TABLE IF NOT EXISTS truth_or_dare_truth_categories (
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

-- Create truth statements table
CREATE TABLE IF NOT EXISTS truth_or_dare_truth_statements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  category_id uuid REFERENCES truth_or_dare_truth_categories(id) ON DELETE CASCADE,
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

-- Create dare categories table
CREATE TABLE IF NOT EXISTS truth_or_dare_dare_categories (
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

-- Create dare statements table
CREATE TABLE IF NOT EXISTS truth_or_dare_dare_statements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  category_id uuid REFERENCES truth_or_dare_dare_categories(id) ON DELETE CASCADE,
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
ALTER TABLE truth_or_dare_truth_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE truth_or_dare_truth_statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE truth_or_dare_dare_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE truth_or_dare_dare_statements ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for public read access
CREATE POLICY "Allow public read access for truth categories"
  ON truth_or_dare_truth_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access for truth statements"
  ON truth_or_dare_truth_statements
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access for dare categories"
  ON truth_or_dare_dare_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access for dare statements"
  ON truth_or_dare_dare_statements
  FOR SELECT
  TO public
  USING (true);

-- Insert initial truth categories
INSERT INTO truth_or_dare_truth_categories (name_en, name_da, name_cs, name_de, name_es, name_et, name_fi, name_fr, name_hu, name_is, name_it, name_nl, name_no, name_pl, name_sv) VALUES
  ('Personal', 'Personlig', 'Osobní', 'Persönlich', 'Personal', 'Isiklik', 'Henkilökohtainen', 'Personnel', 'Személyes', 'Persónulegt', 'Personale', 'Persoonlijk', 'Personlig', 'Osobisty', 'Personlig');

-- Insert initial truth statements
INSERT INTO truth_or_dare_truth_statements (category_id, text_en, text_da, text_cs, text_de, text_es, text_et, text_fi, text_fr, text_hu, text_is, text_it, text_nl, text_no, text_pl, text_sv)
SELECT 
  c.id,
  'What is your biggest fear?',
  'Hvad er din største frygt?',
  'Jaký je tvůj největší strach?',
  'Was ist deine größte Angst?',
  '¿Cuál es tu mayor miedo?',
  'Mis on sinu suurim hirm?',
  'Mikä on suurin pelkosi?',
  'Quelle est ta plus grande peur?',
  'Mi a legnagyobb félelmed?',
  'Hver er þín stærsta ótti?',
  'Qual è la tua più grande paura?',
  'Wat is je grootste angst?',
  'Hva er din største frykt?',
  'Co jest twoim największym lękiem?',
  'Vad är din största rädsla?'
FROM truth_or_dare_truth_categories c
WHERE c.name_en = 'Personal';

-- Insert initial dare categories
INSERT INTO truth_or_dare_dare_categories (name_en, name_da, name_cs, name_de, name_es, name_et, name_fi, name_fr, name_hu, name_is, name_it, name_nl, name_no, name_pl, name_sv) VALUES
  ('Funny', 'Sjove', 'Vtipné', 'Lustig', 'Divertidos', 'Naljakad', 'Hauskat', 'Drôles', 'Vicces', 'Fyndið', 'Divertenti', 'Grappig', 'Morsomme', 'Zabawne', 'Roliga');

-- Insert initial dare statements
INSERT INTO truth_or_dare_dare_statements (category_id, text_en, text_da, text_cs, text_de, text_es, text_et, text_fi, text_fr, text_hu, text_is, text_it, text_nl, text_no, text_pl, text_sv)
SELECT 
  c.id,
  'Do your best impression of a celebrity for 30 seconds',
  'Lav din bedste efterligning af en kendis i 30 sekunder',
  'Udělej svou nejlepší imitaci celebrity po dobu 30 sekund',
  'Mache deine beste Promi-Imitation für 30 Sekunden',
  'Haz tu mejor imitación de una celebridad durante 30 segundos',
  'Tee oma parim järeleaimamine kuulsusest 30 sekundi jooksul',
  'Tee paras julkkisimitaatiosi 30 sekunnin ajan',
  'Fais ta meilleure imitation d''une célébrité pendant 30 secondes',
  'Csináld a legjobb hírességimitációdat 30 másodpercig',
  'Gerðu þína bestu eftirlíkingu af frægri manneskju í 30 sekúndur',
  'Fai la tua migliore imitazione di una celebrità per 30 secondi',
  'Doe je beste imitatie van een beroemdheid gedurende 30 seconden',
  'Gjør din beste imitasjon av en kjendis i 30 sekunder',
  'Zrób swoją najlepszą imitację celebryty przez 30 sekund',
  'Gör din bästa imitation av en kändis i 30 sekunder'
FROM truth_or_dare_dare_categories c
WHERE c.name_en = 'Funny';