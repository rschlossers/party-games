/*
  # Create Best Story Wins game tables

  1. New Tables
    - `best_story_wins_categories`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `name_en` (text)
      - `name_da` (text)
    - `best_story_wins_prompts`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `category_id` (uuid, foreign key to categories)
      - `text_en` (text)
      - `text_da` (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS best_story_wins_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name_en text NOT NULL,
  name_da text NOT NULL
);

-- Create prompts table (instead of statements)
CREATE TABLE IF NOT EXISTS best_story_wins_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  category_id uuid REFERENCES best_story_wins_categories(id) ON DELETE CASCADE,
  text_en text NOT NULL,
  text_da text NOT NULL
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
INSERT INTO best_story_wins_categories (name_en, name_da) VALUES
  ('Adventure', 'Eventyr'),
  ('Embarrassing', 'Pinlige'),
  ('Childhood', 'Barndom'),
  ('Travel', 'Rejser');

-- Insert initial prompts
INSERT INTO best_story_wins_prompts (category_id, text_en, text_da)
SELECT 
  c.id,
  'Tell us about your most exciting adventure',
  'Fortæl os om dit mest spændende eventyr'
FROM best_story_wins_categories c
WHERE c.name_en = 'Adventure'
UNION ALL
SELECT 
  c.id,
  'Share a time when you faced danger and survived',
  'Del en oplevelse hvor du stod over for fare og overlevede'
FROM best_story_wins_categories c
WHERE c.name_en = 'Adventure'
UNION ALL
SELECT 
  c.id,
  'Tell us about your most embarrassing moment',
  'Fortæl os om dit mest pinlige øjeblik'
FROM best_story_wins_categories c
WHERE c.name_en = 'Embarrassing'
UNION ALL
SELECT 
  c.id,
  'Share a childhood memory that still makes you laugh',
  'Del et barndomsminde der stadig får dig til at grine'
FROM best_story_wins_categories c
WHERE c.name_en = 'Childhood'
UNION ALL
SELECT 
  c.id,
  'Tell us about the most interesting place you've traveled to',
  'Fortæl os om det mest interessante sted, du har rejst til'
FROM best_story_wins_categories c
WHERE c.name_en = 'Travel';