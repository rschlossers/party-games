/*
  # Create Best Story Wins game tables

  1. New Tables
    - `best_story_wins_categories`
      - Categories for story prompts with translations in 15 languages
    - `best_story_wins_prompts`
      - Story prompts with translations in 15 languages
      - Links to categories via foreign key

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS best_story_wins_categories (
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

-- Create prompts table
CREATE TABLE IF NOT EXISTS best_story_wins_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  category_id uuid REFERENCES best_story_wins_categories(id) ON DELETE CASCADE,
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
ALTER TABLE best_story_wins_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE best_story_wins_prompts ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for public read access
CREATE POLICY "Allow public read access for categories"
  ON best_story_wins_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access for prompts"
  ON best_story_wins_prompts
  FOR SELECT
  TO public
  USING (true);

-- Insert initial categories
INSERT INTO best_story_wins_categories (name_en, name_da, name_cs, name_de, name_es, name_et, name_fi, name_fr, name_hu, name_is, name_it, name_nl, name_no, name_pl, name_sv) VALUES
  ('Adventure', 'Eventyr', 'Dobrodružství', 'Abenteuer', 'Aventura', 'Seiklus', 'Seikkailu', 'Aventure', 'Kaland', 'Ævintýri', 'Avventura', 'Avontuur', 'Eventyr', 'Przygoda', 'Äventyr'),
  ('Embarrassing', 'Pinlige', 'Trapné', 'Peinlich', 'Vergonzoso', 'Piinlik', 'Nolo', 'Embarrassant', 'Kínos', 'Vandræðalegt', 'Imbarazzante', 'Gênant', 'Pinlig', 'Żenujące', 'Pinsamt'),
  ('Childhood', 'Barndom', 'Dětství', 'Kindheit', 'Infancia', 'Lapsepõlv', 'Lapsuus', 'Enfance', 'Gyermekkor', 'Barnæska', 'Infanzia', 'Kindertijd', 'Barndom', 'Dzieciństwo', 'Barndom'),
  ('Travel', 'Rejser', 'Cestování', 'Reisen', 'Viajes', 'Reisimine', 'Matkailu', 'Voyage', 'Utazás', 'Ferðalög', 'Viaggi', 'Reizen', 'Reise', 'Podróże', 'Resor');

-- Insert initial prompts
INSERT INTO best_story_wins_prompts (category_id, text_en, text_da, text_cs, text_de, text_es, text_et, text_fi, text_fr, text_hu, text_is, text_it, text_nl, text_no, text_pl, text_sv)
SELECT 
  c.id,
  'Tell us about your most exciting adventure',
  'Fortæl os om dit mest spændende eventyr',
  'Řekněte nám o svém nejzajímavějším dobrodružství',
  'Erzählen Sie uns von Ihrem aufregendsten Abenteuer',
  'Cuéntanos sobre tu aventura más emocionante',
  'Räägi meile oma kõige põnevamast seiklusest',
  'Kerro meille jännittävimmästä seikkailustasi',
  'Racontez-nous votre aventure la plus excitante',
  'Mesélj nekünk a legizgalmasabb kalandodról',
  'Segðu okkur frá mest spennandi ævintýrinu þínu',
  'Raccontaci la tua avventura più emozionante',
  'Vertel ons over je meest opwindende avontuur',
  'Fortell oss om ditt mest spennende eventyr',
  'Opowiedz nam o swojej najbardziej ekscytującej przygodzie',
  'Berätta om ditt mest spännande äventyr'
FROM best_story_wins_categories c
WHERE c.name_en = 'Adventure'
UNION ALL
SELECT 
  c.id,
  'Share your most embarrassing moment',
  'Del dit mest pinlige øjeblik',
  'Podělte se o svůj nejostudnější moment',
  'Teilen Sie Ihren peinlichsten Moment',
  'Comparte tu momento más vergonzoso',
  'Jaga oma kõige piinlikumat hetke',
  'Jaa noloin hetkesi',
  'Partagez votre moment le plus embarrassant',
  'Oszd meg a legkínosabb pillanatod',
  'Deildu mest vandræðalega augnablikinu þínu',
  'Condividi il tuo momento più imbarazzante',
  'Deel je meest gênante moment',
  'Del ditt mest pinlige øyeblikk',
  'Podziel się swoim najbardziej żenującym momentem',
  'Dela med dig av ditt mest pinsamma ögonblick'
FROM best_story_wins_categories c
WHERE c.name_en = 'Embarrassing'
UNION ALL
SELECT 
  c.id,
  'Share a childhood memory that still makes you laugh',
  'Del et barndomsminde der stadig får dig til at grine',
  'Podělte se o vzpomínku z dětství, která vás stále rozesměje',
  'Teilen Sie eine Kindheitserinnerung, die Sie immer noch zum Lachen bringt',
  'Comparte un recuerdo de la infancia que aún te hace reír',
  'Jaga lapsepõlve mälestust, mis paneb sind siiani naerma',
  'Jaa lapsuusmuisto, joka naurattaa sinua edelleen',
  E'Partagez un souvenir d\'enfance qui vous fait encore rire',
  'Oszd meg egy gyermekkori emléked, ami még mindig megnevettet',
  'Deildu minningum úr æsku sem fær þig enn til að hlæja',
  'Condividi un ricordo di infanzia che ti fa ancora ridere',
  'Deel een jeugdherinnering die je nog steeds laat lachen',
  'Del et barndomsminne som fortsatt får deg til å le',
  'Podziel się wspomnieniem z dzieciństwa, które wciąż wywołuje uśmiech',
  'Dela ett barndomsminne som fortfarande får dig att skratta'
FROM best_story_wins_categories c
WHERE c.name_en = 'Childhood'
UNION ALL
SELECT 
  c.id,
  'Tell us about your most interesting travel experience',
  'Fortæl os om din mest interessante rejseoplevelse',
  'Řekněte nám o své nejzajímavější cestovatelské zkušenosti',
  'Erzählen Sie uns von Ihrer interessantesten Reiseerfahrung',
  'Cuéntanos sobre tu experiencia de viaje más interesante',
  'Räägi meile oma kõige huvitavamast reisikogemusest',
  'Kerro meille mielenkiintoisimmasta matkakokemuksestasi',
  'Racontez-nous votre expérience de voyage la plus intéressante',
  'Mesélj nekünk a legérdekesebb utazási élményedről',
  'Segðu okkur frá áhugaverðustu ferðaupplifun þinni',
  'Raccontaci la tua esperienza di viaggio più interessante',
  'Vertel ons over je meest interessante reiservaring',
  'Fortell oss om din mest interessante reiseopplevelse',
  'Opowiedz nam o swoim najciekawszym doświadczeniu podróżniczym',
  'Berätta om din mest intressanta reseupplevelse'
FROM best_story_wins_categories c
WHERE c.name_en = 'Travel';