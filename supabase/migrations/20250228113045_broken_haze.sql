-- Create categories table
CREATE TABLE IF NOT EXISTS who_in_the_room_categories (
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
CREATE TABLE IF NOT EXISTS who_in_the_room_statements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  category_id uuid REFERENCES who_in_the_room_categories(id) ON DELETE CASCADE,
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
ALTER TABLE who_in_the_room_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE who_in_the_room_statements ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for public read access
CREATE POLICY "Allow public read access for categories"
  ON who_in_the_room_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access for statements"
  ON who_in_the_room_statements
  FOR SELECT
  TO public
  USING (true);

-- Insert initial categories
INSERT INTO who_in_the_room_categories (name_en, name_da, name_cs, name_de, name_es, name_et, name_fi, name_fr, name_hu, name_is, name_it, name_nl, name_no, name_pl, name_sv) VALUES
  ('General', 'Generelt', 'Obecný', 'Allgemein', 'General', 'Üldine', 'Yleinen', 'Général', 'Általános', 'Almennt', 'Generale', 'Algemeen', 'Generelt', 'Ogólny', 'Allmänt');

-- Insert initial statements
INSERT INTO who_in_the_room_statements (category_id, text_en, text_da, text_cs, text_de, text_es, text_et, text_fi, text_fr, text_hu, text_is, text_it, text_nl, text_no, text_pl, text_sv)
SELECT 
  c.id,
  'Who in the room has traveled to more than 5 countries?',
  'Hvem i rummet har rejst til mere end 5 lande?',
  'Kdo v místnosti navštívil více než 5 zemí?',
  'Wer im Raum hat mehr als 5 Länder bereist?',
  '¿Quién en la habitación ha viajado a más de 5 países?',
  'Kes ruumis on reisinud rohkem kui 5 riiki?',
  'Kuka huoneessa on matkustanut yli 5 maahan?',
  'Qui dans la pièce a voyagé dans plus de 5 pays?',
  'Ki járt a szobában több mint 5 országban?',
  'Hver í herberginu hefur ferðast til fleiri en 5 landa?',
  'Chi nella stanza ha visitato più di 5 paesi?',
  'Wie in de kamer heeft meer dan 5 landen bezocht?',
  'Hvem i rommet har reist til mer enn 5 land?',
  'Kto w pokoju odwiedził więcej niż 5 krajów?',
  'Vem i rummet har rest till mer än 5 länder?'
FROM who_in_the_room_categories c
WHERE c.name_en = 'General';