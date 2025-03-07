/*
  # Add missing translations

  1. Changes
    - Add missing translations for app.title and categories
    - Remove duplicate policy creation
    - Add translations for category titles
*/

-- Insert missing translations
INSERT INTO translations (language_id, key, value) VALUES
  -- English translations
  ('en', 'app.title', 'Party Games'),
  ('en', 'neverHaveIEver.categories.title', 'Select Category'),
  ('en', 'neverHaveIEver.categories.party', 'Party Stories'),
  ('en', 'neverHaveIEver.categories.travel', 'Travel & Adventure'),
  ('en', 'neverHaveIEver.categories.food', 'Food & Drinks'),
  ('en', 'neverHaveIEver.categories.life', 'Life Experiences'),

  -- Danish translations
  ('da', 'app.title', 'Festspil'),
  ('da', 'neverHaveIEver.categories.title', 'Vælg Kategori'),
  ('da', 'neverHaveIEver.categories.party', 'Festhistorier'),
  ('da', 'neverHaveIEver.categories.travel', 'Rejser & Eventyr'),
  ('da', 'neverHaveIEver.categories.food', 'Mad & Drikke'),
  ('da', 'neverHaveIEver.categories.life', 'Livserfaringer');