/*
  # Bad Movie Plots Game Tables

  1. New Tables
    - `bad_movie_plots_categories`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `name_[lang]` (text) for 15 languages
    - `bad_movie_plots_statements`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `category_id` (uuid, foreign key)
      - `text_[lang]` (text) for 15 languages

  2. Security
    - Enable RLS on both tables
    - Add public read-only access policies
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS bad_movie_plots_categories (
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
CREATE TABLE IF NOT EXISTS bad_movie_plots_statements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  category_id uuid REFERENCES bad_movie_plots_categories(id) ON DELETE CASCADE,
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
ALTER TABLE bad_movie_plots_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE bad_movie_plots_statements ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access for categories"
  ON bad_movie_plots_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access for statements"
  ON bad_movie_plots_statements
  FOR SELECT
  TO public
  USING (true);

-- Insert example data
INSERT INTO bad_movie_plots_categories (name_en, name_da, name_cs, name_de, name_es, name_et, name_fi, name_fr, name_hu, name_is, name_it, name_nl, name_no, name_pl, name_sv) 
VALUES (
  'Action Movies',           -- en
  'Actionfilm',             -- da
  'Akční filmy',            -- cs
  'Actionfilme',            -- de
  'Películas de acción',    -- es
  'Märulifilmid',          -- et
  'Toimintaelokuvat',      -- fi
  'Films d''action',        -- fr
  'Akciófilmek',           -- hu
  'Hasar myndir',          -- is
  'Film d''azione',        -- it
  'Actiefilms',            -- nl
  'Actionfilmer',          -- no
  'Filmy akcji',           -- pl
  'Actionfilmer'           -- sv
);

-- Get the category ID for the foreign key reference
DO $$
DECLARE
  category_id uuid;
BEGIN
  SELECT id INTO category_id FROM bad_movie_plots_categories LIMIT 1;
  
  INSERT INTO bad_movie_plots_statements (category_id, text_en, text_da, text_cs, text_de, text_es, text_et, text_fi, text_fr, text_hu, text_is, text_it, text_nl, text_no, text_pl, text_sv)
  VALUES (
    category_id,
    'A guy who can''t stop running or he''ll explode has to deliver a pizza across town',  -- en
    'En fyr der ikke kan stoppe med at løbe eller han eksploderer skal levere en pizza på tværs af byen', -- da
    'Chlap, který nemůže přestat běhat, nebo vybuchne, musí doručit pizzu přes město', -- cs
    'Ein Typ, der nicht aufhören kann zu laufen, oder er explodiert, muss eine Pizza durch die Stadt liefern', -- de
    'Un tipo que no puede dejar de correr o explotará tiene que entregar una pizza por la ciudad', -- es
    'Mees, kes ei saa joosta lõpetada või ta plahvatab, peab pitsa üle linna kohale toimetama', -- et
    'Kaveri, joka ei voi lopettaa juoksemista tai hän räjähtää, joutuu toimittamaan pizzan kaupungin halki', -- fi
    'Un gars qui ne peut pas s''arrêter de courir ou il explosera doit livrer une pizza à travers la ville', -- fr
    'Egy srác, aki nem állhat meg futni, különben felrobban, pizzát kell szállítania a városon át', -- hu
    'Gaur sem getur ekki hætt að hlaupa annars springur hann þarf að afhenda pizzu yfir bæinn', -- is
    'Un ragazzo che non può smettere di correre o esploderà deve consegnare una pizza in città', -- it
    'Een man die niet kan stoppen met rennen of hij ontploft moet een pizza door de stad bezorgen', -- nl
    'En fyr som ikke kan slutte å løpe ellers eksploderer han må levere en pizza over byen', -- no
    'Facet, który nie może przestać biegać bo wybuchnie, musi dostarczyć pizzę przez miasto', -- pl
    'En kille som inte kan sluta springa eller så exploderar han måste leverera en pizza genom staden' -- sv
  );
END $$;