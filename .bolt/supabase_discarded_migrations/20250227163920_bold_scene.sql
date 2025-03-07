/*
  # Add game visibility translations

  1. New Translations
    - Add translation keys for game visibility feature
    - Add translations for "Never Have I Ever" game visibility labels

  This migration ensures the game visibility labels are available in the translations table
  for both English and Danish languages.
*/

-- Insert game visibility translations
INSERT INTO translations (language_id, key, value) VALUES
  -- English translations
  ('en', 'settings.gameVisibility.title', 'Game Visibility'),
  ('en', 'settings.gameVisibility.description', 'Show or hide games from the main menu'),
  ('en', 'settings.gameVisibility.neverHaveIEver', 'Never Have I Ever'),

  -- Danish translations
  ('da', 'settings.gameVisibility.title', 'Spil Synlighed'),
  ('da', 'settings.gameVisibility.description', 'Vis eller skjul spil fra hovedmenuen'),
  ('da', 'settings.gameVisibility.neverHaveIEver', 'Jeg Har Aldrig');