/*
  # True or Bullshit Game Tables

  1. New Tables
    - `true_or_bullshit_categories`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `name_[lang]` (text) for 15 languages
    - `true_or_bullshit_statements`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `category_id` (uuid, foreign key)
      - `text_[lang]` (text) for 15 languages
      - `is_true` (boolean) to indicate if the statement is true or false

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS true_or_bullshit_categories (
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
CREATE TABLE IF NOT EXISTS true_or_bullshit_statements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  category_id uuid REFERENCES true_or_bullshit_categories(id) ON DELETE CASCADE,
  is_true boolean NOT NULL DEFAULT false,
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
ALTER TABLE true_or_bullshit_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE true_or_bullshit_statements ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access for categories" ON true_or_bullshit_categories
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow public read access for statements" ON true_or_bullshit_statements
  FOR SELECT TO public USING (true);

-- Insert example category
INSERT INTO true_or_bullshit_categories (
  name_en, name_da, name_cs, name_de, name_es, name_et, name_fi, name_fr, 
  name_hu, name_is, name_it, name_nl, name_no, name_pl, name_sv
) VALUES (
  'Science Facts', 'Videnskabelige fakta', 'Vědecká fakta', 'Wissenschaftliche Fakten',
  'Hechos científicos', 'Teaduslikud faktid', 'Tieteelliset faktat', 'Faits scientifiques',
  'Tudományos tények', 'Vísindalegar staðreyndir', 'Fatti scientifici', 'Wetenschappelijke feiten',
  'Vitenskapelige fakta', 'Fakty naukowe', 'Vetenskapliga fakta'
);

-- Insert example statement
INSERT INTO true_or_bullshit_statements (
  category_id,
  is_true,
  text_en, text_da, text_cs, text_de, text_es, text_et, text_fi, text_fr,
  text_hu, text_is, text_it, text_nl, text_no, text_pl, text_sv
) VALUES (
  (SELECT id FROM true_or_bullshit_categories LIMIT 1),
  true,
  'Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.',
  'Honning bliver aldrig dårlig. Arkæologer har fundet krukker med honning i gamle egyptiske grave, der er over 3.000 år gamle og stadig perfekt spiselige.',
  'Med se nikdy nekazí. Archeologové našli nádoby s medem ve starověkých egyptských hrobkách, které jsou více než 3000 let staré a stále jsou perfektně poživatelné.',
  'Honig verdirbt nie. Archäologen haben in altägyptischen Gräbern Honigtöpfe gefunden, die über 3.000 Jahre alt und immer noch perfekt genießbar sind.',
  'La miel nunca se echa a perder. Los arqueólogos han encontrado vasijas de miel en tumbas egipcias antiguas que tienen más de 3.000 años y siguen siendo perfectamente comestibles.',
  'Mesi ei rikne kunagi. Arheoloogid on leidnud iidsete Egiptuse haudade meepotte, mis on üle 3000 aasta vanad ja endiselt täiesti söödavad.',
  'Hunaja ei pilaannu koskaan. Arkeologit ovat löytäneet muinaisista egyptiläisistä haudoista hunajapurkkeja, jotka ovat yli 3000 vuotta vanhoja ja edelleen täysin syötäviä.',
  'Le miel ne se gâte jamais. Les archéologues ont trouvé des pots de miel dans des tombes égyptiennes anciennes qui ont plus de 3000 ans et sont toujours parfaitement comestibles.',
  'A méz soha nem romlik meg. A régészek több mint 3000 éves, még mindig tökéletesen ehető mézesedényeket találtak az ókori egyiptomi sírokban.',
  'Hunang skemmist aldrei. Fornleifafræðingar hafa fundið hunangskrukur í fornum egypskum gröfum sem eru yfir 3.000 ára gamlar og enn fullkomlega ætar.',
  'Il miele non si deteriora mai. Gli archeologi hanno trovato vasi di miele in antiche tombe egizie che hanno più di 3.000 anni e sono ancora perfettamente commestibili.',
  'Honing bederft nooit. Archeologen hebben potten honing gevonden in oude Egyptische tombes die meer dan 3.000 jaar oud zijn en nog steeds perfect eetbaar zijn.',
  'Honning blir aldri dårlig. Arkeologer har funnet krukker med honning i gamle egyptiske graver som er over 3000 år gamle og fortsatt perfekt spiselige.',
  'Miód nigdy się nie psuje. Archeolodzy znaleźli garnki z miodem w starożytnych egipskich grobowcach, które mają ponad 3000 lat i nadal są idealnie jadalne.',
  'Honung blir aldrig dålig. Arkeologer har hittat honungskrukor i forntida egyptiska gravar som är över 3000 år gamla och fortfarande perfekt ätbara.'
);