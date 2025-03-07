-- Create categories table
CREATE TABLE IF NOT EXISTS joke_generator_categories (
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
CREATE TABLE IF NOT EXISTS joke_generator_statements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  category_id uuid REFERENCES joke_generator_categories(id) ON DELETE CASCADE,
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
ALTER TABLE joke_generator_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE joke_generator_statements ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for public read access
CREATE POLICY "Allow public read access for categories"
  ON joke_generator_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access for statements"
  ON joke_generator_statements
  FOR SELECT
  TO public
  USING (true);

-- Insert initial categories
INSERT INTO joke_generator_categories (name_en, name_da, name_cs, name_de, name_es, name_et, name_fi, name_fr, name_hu, name_is, name_it, name_nl, name_no, name_pl, name_sv) VALUES
  ('Dad Jokes', 'Far-vittigheder', 'Tatínkovy vtipy', 'Vaterwitze', 'Chistes de papá', 'Isa naljad', 'Isävitsit', 'Blagues de papa', 'Apás viccek', 'Pabbabrandarar', 'Battute da papà', 'Vader grappen', 'Pappavitser', 'Dowcipy taty', 'Pappaskämt');

-- Insert initial statements
INSERT INTO joke_generator_statements (category_id, text_en, text_da, text_cs, text_de, text_es, text_et, text_fi, text_fr, text_hu, text_is, text_it, text_nl, text_no, text_pl, text_sv)
SELECT 
  c.id,
  'Why don''t scientists trust atoms? Because they make up everything!',
  'Hvorfor stoler videnskabsmænd ikke på atomer? Fordi de opfinder alt!',
  'Proč vědci nevěří atomům? Protože všechno vymýšlejí!',
  'Warum vertrauen Wissenschaftler Atomen nicht? Weil sie alles erfinden!',
  '¿Por qué los científicos no confían en los átomos? ¡Porque inventan todo!',
  'Miks teadlased ei usalda aatomeid? Sest nad mõtlevad kõik välja!',
  'Miksi tieteilijät eivät luota atomeihin? Koska ne keksivät kaiken!',
  'Pourquoi les scientifiques ne font-ils pas confiance aux atomes? Parce qu''ils inventent tout!',
  'Miért nem bíznak a tudósok az atomokban? Mert mindent kitalálnak!',
  'Af hverju treysta vísindamenn ekki á atóm? Vegna þess að þau finna upp allt!',
  'Perché gli scienziati non si fidano degli atomi? Perché inventano tutto!',
  'Waarom vertrouwen wetenschappers atomen niet? Omdat ze alles verzinnen!',
  'Hvorfor stoler ikke forskere på atomer? Fordi de finner opp alt!',
  'Dlaczego naukowcy nie ufają atomom? Bo wszystko wymyślają!',
  'Varför litar inte forskare på atomer? För att de hittar på allt!'
FROM joke_generator_categories c
WHERE c.name_en = 'Dad Jokes';