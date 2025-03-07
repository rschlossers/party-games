-- Create categories table
CREATE TABLE IF NOT EXISTS birthday_greetings_categories (
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
CREATE TABLE IF NOT EXISTS birthday_greetings_statements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  category_id uuid REFERENCES birthday_greetings_categories(id) ON DELETE CASCADE,
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
ALTER TABLE birthday_greetings_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE birthday_greetings_statements ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for public read access
CREATE POLICY "Allow public read access for categories"
  ON birthday_greetings_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access for statements"
  ON birthday_greetings_statements
  FOR SELECT
  TO public
  USING (true);

-- Insert initial categories
INSERT INTO birthday_greetings_categories (name_en, name_da, name_cs, name_de, name_es, name_et, name_fi, name_fr, name_hu, name_is, name_it, name_nl, name_no, name_pl, name_sv) VALUES
  ('Heartfelt Wishes', 'Hjertevarme ønsker', 'Srdečná přání', 'Herzliche Wünsche', 'Deseos sinceros', 'Südamlikud soovid', 'Sydämelliset toivotukset', 'Vœux sincères', 'Szívből jövő kívánságok', 'Hjartanleg óskir', 'Auguri sentiti', 'Hartelijke wensen', 'Hjertelige ønsker', 'Serdeczne życzenia', 'Hjärtliga önskningar');

-- Insert initial statements
INSERT INTO birthday_greetings_statements (category_id, text_en, text_da, text_cs, text_de, text_es, text_et, text_fi, text_fr, text_hu, text_is, text_it, text_nl, text_no, text_pl, text_sv)
SELECT 
  c.id,
  'Wishing you a day filled with happiness and a year filled with joy!',
  'Ønsker dig en dag fyldt med lykke og et år fyldt med glæde!',
  'Přeji vám den plný štěstí a rok plný radosti!',
  'Ich wünsche dir einen Tag voller Glück und ein Jahr voller Freude!',
  '¡Te deseo un día lleno de felicidad y un año lleno de alegría!',
  'Soovin sulle õnne täis päeva ja rõõmu täis aastat!',
  'Toivotan sinulle onnea täynnä olevan päivän ja iloa täynnä olevan vuoden!',
  'Je te souhaite une journée pleine de bonheur et une année pleine de joie!',
  'Boldog napot és örömteli évet kívánok neked!',
  'Óska þér dags fylltan af hamingju og árs fyllts af gleði!',
  'Ti auguro una giornata piena di felicità e un anno pieno di gioia!',
  'Ik wens je een dag vol geluk en een jaar vol vreugde!',
  'Jeg ønsker deg en dag fylt med lykke og et år fylt med glede!',
  'Życzę Ci dnia pełnego szczęścia i roku pełnego radości!',
  'Jag önskar dig en dag fylld med lycka och ett år fyllt med glädje!'
FROM birthday_greetings_categories c
WHERE c.name_en = 'Heartfelt Wishes';