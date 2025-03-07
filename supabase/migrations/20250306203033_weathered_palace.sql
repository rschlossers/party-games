/*
  # Add True or Bullshit translations

  1. New Translations
    - Adds translations for True or Bullshit game:
      - trueOrBullshit.true: "True"
      - trueOrBullshit.false: "Bullshit"
      - trueOrBullshit.correct: "Correct!"
      - trueOrBullshit.incorrect: "Wrong!"
      - trueOrBullshit.explanation: "This statement is %{status}"
      - trueOrBullshit.streak: "Current Streak: %{count}"
*/

-- English translations
INSERT INTO translations (language_id, key, value)
VALUES 
  ('en', 'trueOrBullshit.true', 'True'),
  ('en', 'trueOrBullshit.false', 'Bullshit'),
  ('en', 'trueOrBullshit.correct', 'Correct!'),
  ('en', 'trueOrBullshit.incorrect', 'Wrong!'),
  ('en', 'trueOrBullshit.explanation', 'This statement is %{status}'),
  ('en', 'trueOrBullshit.streak', 'Current Streak: %{count}');

-- Danish translations
INSERT INTO translations (language_id, key, value)
VALUES 
  ('da', 'trueOrBullshit.true', 'Sandt'),
  ('da', 'trueOrBullshit.false', 'Bullshit'),
  ('da', 'trueOrBullshit.correct', 'Rigtigt!'),
  ('da', 'trueOrBullshit.incorrect', 'Forkert!'),
  ('da', 'trueOrBullshit.explanation', 'Dette udsagn er %{status}'),
  ('da', 'trueOrBullshit.streak', 'Nuværende Streak: %{count}');

-- Czech translations
INSERT INTO translations (language_id, key, value)
VALUES 
  ('cs', 'trueOrBullshit.true', 'Pravda'),
  ('cs', 'trueOrBullshit.false', 'Bullshit'),
  ('cs', 'trueOrBullshit.correct', 'Správně!'),
  ('cs', 'trueOrBullshit.incorrect', 'Špatně!'),
  ('cs', 'trueOrBullshit.explanation', 'Toto tvrzení je %{status}'),
  ('cs', 'trueOrBullshit.streak', 'Aktuální série: %{count}');

-- German translations
INSERT INTO translations (language_id, key, value)
VALUES 
  ('de', 'trueOrBullshit.true', 'Wahr'),
  ('de', 'trueOrBullshit.false', 'Bullshit'),
  ('de', 'trueOrBullshit.correct', 'Richtig!'),
  ('de', 'trueOrBullshit.incorrect', 'Falsch!'),
  ('de', 'trueOrBullshit.explanation', 'Diese Aussage ist %{status}'),
  ('de', 'trueOrBullshit.streak', 'Aktuelle Serie: %{count}');

-- Spanish translations
INSERT INTO translations (language_id, key, value)
VALUES 
  ('es', 'trueOrBullshit.true', 'Verdadero'),
  ('es', 'trueOrBullshit.false', 'Mentira'),
  ('es', 'trueOrBullshit.correct', '¡Correcto!'),
  ('es', 'trueOrBullshit.incorrect', '¡Incorrecto!'),
  ('es', 'trueOrBullshit.explanation', 'Esta afirmación es %{status}'),
  ('es', 'trueOrBullshit.streak', 'Racha actual: %{count}');

-- Estonian translations
INSERT INTO translations (language_id, key, value)
VALUES 
  ('et', 'trueOrBullshit.true', 'Tõsi'),
  ('et', 'trueOrBullshit.false', 'Jama'),
  ('et', 'trueOrBullshit.correct', 'Õige!'),
  ('et', 'trueOrBullshit.incorrect', 'Vale!'),
  ('et', 'trueOrBullshit.explanation', 'See väide on %{status}'),
  ('et', 'trueOrBullshit.streak', 'Praegune seeria: %{count}');

-- Finnish translations
INSERT INTO translations (language_id, key, value)
VALUES 
  ('fi', 'trueOrBullshit.true', 'Totta'),
  ('fi', 'trueOrBullshit.false', 'Pötyä'),
  ('fi', 'trueOrBullshit.correct', 'Oikein!'),
  ('fi', 'trueOrBullshit.incorrect', 'Väärin!'),
  ('fi', 'trueOrBullshit.explanation', 'Tämä väite on %{status}'),
  ('fi', 'trueOrBullshit.streak', 'Nykyinen putki: %{count}');

-- French translations
INSERT INTO translations (language_id, key, value)
VALUES 
  ('fr', 'trueOrBullshit.true', 'Vrai'),
  ('fr', 'trueOrBullshit.false', 'Connerie'),
  ('fr', 'trueOrBullshit.correct', 'Correct!'),
  ('fr', 'trueOrBullshit.incorrect', 'Faux!'),
  ('fr', 'trueOrBullshit.explanation', 'Cette affirmation est %{status}'),
  ('fr', 'trueOrBullshit.streak', 'Série actuelle: %{count}');

-- Hungarian translations
INSERT INTO translations (language_id, key, value)
VALUES 
  ('hu', 'trueOrBullshit.true', 'Igaz'),
  ('hu', 'trueOrBullshit.false', 'Hülyeség'),
  ('hu', 'trueOrBullshit.correct', 'Helyes!'),
  ('hu', 'trueOrBullshit.incorrect', 'Hibás!'),
  ('hu', 'trueOrBullshit.explanation', 'Ez az állítás %{status}'),
  ('hu', 'trueOrBullshit.streak', 'Jelenlegi sorozat: %{count}');

-- Icelandic translations
INSERT INTO translations (language_id, key, value)
VALUES 
  ('is', 'trueOrBullshit.true', 'Satt'),
  ('is', 'trueOrBullshit.false', 'Kjaftæði'),
  ('is', 'trueOrBullshit.correct', 'Rétt!'),
  ('is', 'trueOrBullshit.incorrect', 'Rangt!'),
  ('is', 'trueOrBullshit.explanation', 'Þessi fullyrðing er %{status}'),
  ('is', 'trueOrBullshit.streak', 'Núverandi runa: %{count}');

-- Italian translations
INSERT INTO translations (language_id, key, value)
VALUES 
  ('it', 'trueOrBullshit.true', 'Vero'),
  ('it', 'trueOrBullshit.false', 'Stronzate'),
  ('it', 'trueOrBullshit.correct', 'Corretto!'),
  ('it', 'trueOrBullshit.incorrect', 'Sbagliato!'),
  ('it', 'trueOrBullshit.explanation', 'Questa affermazione è %{status}'),
  ('it', 'trueOrBullshit.streak', 'Serie attuale: %{count}');

-- Dutch translations
INSERT INTO translations (language_id, key, value)
VALUES 
  ('nl', 'trueOrBullshit.true', 'Waar'),
  ('nl', 'trueOrBullshit.false', 'Onzin'),
  ('nl', 'trueOrBullshit.correct', 'Juist!'),
  ('nl', 'trueOrBullshit.incorrect', 'Fout!'),
  ('nl', 'trueOrBullshit.explanation', 'Deze stelling is %{status}'),
  ('nl', 'trueOrBullshit.streak', 'Huidige reeks: %{count}');

-- Norwegian translations
INSERT INTO translations (language_id, key, value)
VALUES 
  ('no', 'trueOrBullshit.true', 'Sant'),
  ('no', 'trueOrBullshit.false', 'Tull'),
  ('no', 'trueOrBullshit.correct', 'Riktig!'),
  ('no', 'trueOrBullshit.incorrect', 'Feil!'),
  ('no', 'trueOrBullshit.explanation', 'Denne påstanden er %{status}'),
  ('no', 'trueOrBullshit.streak', 'Nåværende streak: %{count}');

-- Polish translations
INSERT INTO translations (language_id, key, value)
VALUES 
  ('pl', 'trueOrBullshit.true', 'Prawda'),
  ('pl', 'trueOrBullshit.false', 'Bzdura'),
  ('pl', 'trueOrBullshit.correct', 'Poprawnie!'),
  ('pl', 'trueOrBullshit.incorrect', 'Źle!'),
  ('pl', 'trueOrBullshit.explanation', 'To stwierdzenie jest %{status}'),
  ('pl', 'trueOrBullshit.streak', 'Aktualna seria: %{count}');

-- Swedish translations
INSERT INTO translations (language_id, key, value)
VALUES 
  ('sv', 'trueOrBullshit.true', 'Sant'),
  ('sv', 'trueOrBullshit.false', 'Skitsnack'),
  ('sv', 'trueOrBullshit.correct', 'Rätt!'),
  ('sv', 'trueOrBullshit.incorrect', 'Fel!'),
  ('sv', 'trueOrBullshit.explanation', 'Detta påstående är %{status}'),
  ('sv', 'trueOrBullshit.streak', 'Nuvarande streak: %{count}');