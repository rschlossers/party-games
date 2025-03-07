/*
  # Array Functions for Drinking Games
  
  1. New Functions
    - get_unique_countries: Returns unique countries from the drinking_games table
    - get_unique_materials: Returns unique materials from the drinking_games table
    
  2. Security
    - Functions are accessible to public for read access
*/

-- Function to get unique countries
CREATE OR REPLACE FUNCTION get_unique_countries(lang text)
RETURNS TABLE (country text)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT DISTINCT unnest(countries)
  FROM drinking_games
  WHERE language = lang
  AND countries IS NOT NULL
  ORDER BY unnest(countries);
$$;

-- Grant access to public
GRANT EXECUTE ON FUNCTION get_unique_countries TO public;

-- Function to get unique materials
CREATE OR REPLACE FUNCTION get_unique_materials(lang text)
RETURNS TABLE (material text)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT DISTINCT unnest(materials)
  FROM drinking_games
  WHERE language = lang
  AND materials IS NOT NULL
  ORDER BY unnest(materials);
$$;

-- Grant access to public
GRANT EXECUTE ON FUNCTION get_unique_materials TO public;