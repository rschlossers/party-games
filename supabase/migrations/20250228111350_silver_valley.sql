/*
  # Add What's Your Number game tables

  1. New Tables
    - `whats_your_number_categories`
      - `id` (uuid, primary key)
      - `created_at` (timestamptz)
      - `name_[lang]` (text) for all 15 languages
    - `whats_your_number_statements`
      - `id` (uuid, primary key)
      - `created_at` (timestamptz)
      - `category_id` (uuid, foreign key)
      - `text_[lang]` (text) for all 15 languages

  2. Security
    - Enable RLS on both tables
    - Add public read access policies
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS whats_your_number_categories (
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
CREATE TABLE IF NOT EXISTS whats_your_number_statements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  category_id uuid REFERENCES whats_your_number_categories(id) ON DELETE CASCADE,
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
ALTER TABLE whats_your_number_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE whats_your_number_statements ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for public read access
CREATE POLICY "Allow public read access for categories"
  ON whats_your_number_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access for statements"
  ON whats_your_number_statements
  FOR SELECT
  TO public
  USING (true);

-- Insert initial categories
INSERT INTO whats_your_number_categories (name_en, name_da, name_cs, name_de, name_es, name_et, name_fi, name_fr, name_hu, name_is, name_it, name_nl, name_no, name_pl, name_sv) VALUES
  ('Personal', 'Personlig', 'Osobní', 'Persönlich', 'Personal', 'Isiklik', 'Henkilökohtainen', 'Personnel', 'Személyes', 'Persónulegt', 'Personale', 'Persoonlijk', 'Personlig', 'Osobisty', 'Personlig');

-- Insert initial statements
INSERT INTO whats_your_number_statements (category_id, text_en, text_da, text_cs, text_de, text_es, text_et, text_fi, text_fr, text_hu, text_is, text_it, text_nl, text_no, text_pl, text_sv)
SELECT 
  c.id,
  'What percentage of your life do you spend on your phone?',
  'Hvor mange procent af dit liv bruger du på din telefon?',
  'Jaké procento svého života trávíte na telefonu?',
  'Wie viel Prozent Ihres Lebens verbringen Sie am Telefon?',
  '¿Qué porcentaje de tu vida pasas en tu teléfono?',
  'Kui suure protsendi oma elust veedate telefonis?',
  'Kuinka suuren osan elämästäsi vietät puhelimellasi?',
  'Quel pourcentage de votre vie passez-vous sur votre téléphone ?',
  'Az életed hány százalékát töltöd a telefonodon?',
  'Hvaða hlutfall af lífi þínu eyðir þú í símann þinn?',
  'Che percentuale della tua vita passi al telefono?',
  'Hoeveel procent van je leven besteed je aan je telefoon?',
  'Hvor stor prosentandel av livet ditt bruker du på telefonen?',
  'Jaki procent swojego życia spędzasz na telefonie?',
  'Hur stor procent av ditt liv spenderar du på din telefon?'
FROM whats_your_number_categories c
WHERE c.name_en = 'Personal';