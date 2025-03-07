-- Create categories table
CREATE TABLE IF NOT EXISTS charades_categories (
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
CREATE TABLE IF NOT EXISTS charades_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  category_id uuid REFERENCES charades_categories(id) ON DELETE CASCADE,
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
ALTER TABLE charades_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE charades_prompts ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for public read access
CREATE POLICY "Allow public read access for categories"
  ON charades_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access for prompts"
  ON charades_prompts
  FOR SELECT
  TO public
  USING (true);

-- Insert initial categories
INSERT INTO charades_categories (name_en, name_da, name_cs, name_de, name_es, name_et, name_fi, name_fr, name_hu, name_is, name_it, name_nl, name_no, name_pl, name_sv) VALUES
  ('Movies', 'Film', 'Filmy', 'Filme', 'Películas', 'Filmid', 'Elokuvat', 'Films', 'Filmek', 'Kvikmyndir', 'Film', 'Films', 'Filmer', 'Filmy', 'Filmer');

-- Insert initial prompts
INSERT INTO charades_prompts (category_id, text_en, text_da, text_cs, text_de, text_es, text_et, text_fi, text_fr, text_hu, text_is, text_it, text_nl, text_no, text_pl, text_sv)
SELECT 
  c.id,
  'Titanic',
  'Titanic',
  'Titanic',
  'Titanic',
  'Titanic',
  'Titanic',
  'Titanic',
  'Titanic',
  'Titanic',
  'Titanic',
  'Titanic',
  'Titanic',
  'Titanic',
  'Titanic',
  'Titanic'
FROM charades_categories c
WHERE c.name_en = 'Movies';