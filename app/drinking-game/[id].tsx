import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable, Platform } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../../utils/i18n';
import { supabase } from '../../utils/supabase';

interface DrinkingGame {
  id: string;
  game_name: string;
  description: string;
  type: string;
  language: string;
  countries: string[] | null;
  materials: string[] | null;
  introduction_text: string;
  materials_text: string;
  how_to_text: string;
  variations_text: string;
  strategy_and_tips_text: string;
  best_drinks_text: string;
  history_text: string;
}

export default function DrinkingGameDetails() {
  const { id } = useLocalSearchParams();
  const { t, language } = useLanguage();
  const [game, setGame] = useState<DrinkingGame | null>(null);
  const [relatedGames, setRelatedGames] = useState<DrinkingGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGameDetails();
  }, [id, language]);

  const fetchGameDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch main game details
      const { data: gameData, error: gameError } = await supabase
        .from('drinking_games')
        .select('*')
        .eq('id', id)
        .eq('language', language);

      if (gameError) throw gameError;

      if (!gameData || gameData.length === 0) {
        setError(t('drinkingGames.gameNotFound'));
        return;
      }
      setGame(gameData[0]);
      // Fetch related games of the same type
      if (game) {
        const { data: relatedData, error: relatedError } = await supabase
          .from('drinking_games')
          .select('*')
          .eq('language', language)
          .eq('type', game.type)
          .neq('id', game.id)
          .limit(3);

        if (relatedError) throw relatedError;
        setRelatedGames(relatedData || []);
      }
    } catch (err) {
      console.error('Error fetching game details:', err); 
      setError(t('drinkingGames.fetchError'));
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C5CE7" />
      </View>
    );
  }

  if (error || !game) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || t('drinkingGames.gameNotFound')}</Text>
      </View>
    );
  }

  const renderHtml = (html: string) => {
    // Clean up the HTML by removing extra spaces and normalizing structure
    const cleanHtml = html
      .replace(/<\/h[1-6]>\s+<p>/g, '</h1><p>') // Remove space between headings and paragraphs
      .replace(/<\/p>\s+<p>/g, '</p><p>') // Remove space between paragraphs
      .replace(/<\/p>\s+<ul>/g, '</p><ul>') // Remove space between paragraph and lists
      .replace(/<\/ul>\s+<p>/g, '</ul><p>') // Remove space between lists and paragraphs
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    return (
      <View style={styles.htmlContent}>
        <div 
          dangerouslySetInnerHTML={{ __html: cleanHtml }}
          style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#333',
          }}
        />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{game.game_name}</Text>
          <Text style={styles.description}>{game.description}</Text>
        </View>

        {/* Quick Info with Tags */}
        <View style={styles.quickInfo}>
          <View style={styles.tagRow}>
            <Link href={`/drinking-games?type=${encodeURIComponent(game.type)}`} asChild>
              <Pressable style={styles.tag}>
                <Text style={styles.tagText}>{game.type}</Text>
              </Pressable>
            </Link>

            {game.countries?.map(country => (
              <Link 
                key={country}
                href={`/drinking-games?country=${encodeURIComponent(country)}`}
                asChild>
                <Pressable style={styles.tag}>
                  <Text style={styles.tagText}>{country}</Text>
                </Pressable>
              </Link>
            ))}

            {game.materials?.map(material => (
              <Link 
                key={material}
                href={`/drinking-games?material=${encodeURIComponent(material)}`}
                asChild>
                <Pressable style={styles.tag}>
                  <Text style={styles.tagText}>{material}</Text>
                </Pressable>
              </Link>
            ))}
          </View>
        </View>

        {/* Table of Contents */}
        <View style={styles.tableOfContents}>
          <Text style={styles.tocTitle}>{t('drinkingGames.contents')}</Text>
          <View style={styles.tocLinks}>
            <Pressable onPress={() => scrollToSection('introduction')}>
              <Text style={styles.tocLink}>1. {t('drinkingGames.introduction')}</Text>
            </Pressable>
            
            {game.materials_text && (
              <Pressable onPress={() => scrollToSection('materials')}>
                <Text style={styles.tocLink}>2. {t('drinkingGames.materials')}</Text>
              </Pressable>
            )}
            
            <Pressable onPress={() => scrollToSection('howToPlay')}>
              <Text style={styles.tocLink}>3. {t('drinkingGames.howToPlay')}</Text>
            </Pressable>
            
            {game.variations_text && (
              <Pressable onPress={() => scrollToSection('variations')}>
                <Text style={styles.tocLink}>4. {t('drinkingGames.variations')}</Text>
              </Pressable>
            )}
            
            {game.strategy_and_tips_text && (
              <Pressable onPress={() => scrollToSection('strategyAndTips')}>
                <Text style={styles.tocLink}>5. {t('drinkingGames.strategyAndTips')}</Text>
              </Pressable>
            )}
            
            {game.best_drinks_text && (
              <Pressable onPress={() => scrollToSection('bestDrinks')}>
                <Text style={styles.tocLink}>6. {t('drinkingGames.bestDrinks')}</Text>
              </Pressable>
            )}
            
            {game.history_text && (
              <Pressable onPress={() => scrollToSection('history')}>
                <Text style={styles.tocLink}>7. {t('drinkingGames.history')}</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <View id="introduction" style={styles.section}>
            {renderHtml(game.introduction_text)}
          </View>

          {game.materials_text && (
            <View id="materials" style={styles.section}>
              {renderHtml(game.materials_text)}
            </View>
          )}

          <View id="howToPlay" style={styles.section}>
            {renderHtml(game.how_to_text)}
          </View>

          {game.variations_text && (
            <View id="variations" style={styles.section}>
              {renderHtml(game.variations_text)}
            </View>
          )}

          {game.strategy_and_tips_text && (
            <View id="strategyAndTips" style={styles.section}>
              {renderHtml(game.strategy_and_tips_text)}
            </View>
          )}

          {game.best_drinks_text && (
            <View id="bestDrinks" style={styles.section}>
              {renderHtml(game.best_drinks_text)}
            </View>
          )}

          {game.history_text && (
            <View id="history" style={styles.section}>
              {renderHtml(game.history_text)}
            </View>
          )}
        </View>

        {/* Related Games */}
        {relatedGames.length > 0 && (
          <View style={styles.relatedGames}>
            <Text style={styles.relatedTitle}>{t('drinkingGames.relatedGames')}</Text>
            <View style={styles.relatedGrid}>
              {relatedGames.map(relatedGame => (
                <Link 
                  key={relatedGame.id}
                  href={`/drinking-game/${relatedGame.id}`}
                  asChild>
                  <Pressable style={styles.relatedCard}>
                    <Text style={styles.relatedType}>{relatedGame.type}</Text>
                    <Text style={styles.relatedName}>{relatedGame.game_name}</Text>
                    <Text style={styles.relatedDescription} numberOfLines={2}>
                      {relatedGame.description}
                    </Text>
                  </Pressable>
                </Link>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 20,
    maxWidth: 800,
    marginHorizontal: 'auto',
    width: '100%',
  },
  header: {
    marginBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
    lineHeight: 44,
  },
  description: {
    fontSize: 18,
    color: '#666',
    lineHeight: 28,
  },
  quickInfo: {
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: '#F0EEFF',
          borderColor: '#6C5CE7',
        },
      },
    }),
  },
  tagText: {
    fontSize: 14,
    color: '#6C5CE7',
  },
  tableOfContents: {
    backgroundColor: '#F0EEFF',
    padding: 24,
    borderRadius: 12,
    marginBottom: 32,
  },
  tocTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  tocLinks: {
    gap: 12,
  },
  tocLink: {
    fontSize: 16,
    color: '#6C5CE7',
    textDecorationLine: 'underline',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        '&:hover': {
          color: '#5046c7',
        },
      },
    }),
  },
  mainContent: {
    gap: 0,
  },
  section: {
    marginBottom: 0,
  },
  htmlContent: {
    ...Platform.select({
      web: {
        '& h1': {
          fontSize: 28,
          fontWeight: 'bold',
          color: '#000',
          marginBottom: 8,
          lineHeight: 1.2,
        },
        '& h2': {
          fontSize: 22,
          fontWeight: 'bold',
          color: '#000',
          marginBottom: 8,
          marginTop: 16,
          lineHeight: 1.2,
        },
        '& h3': {
          fontSize: 18,
          fontWeight: 'bold',
          color: '#000',
          marginBottom: 8,
          marginTop: 16,
          lineHeight: 1.2,
        },
        '& p': {
          fontSize: 16,
          lineHeight: 1.4,
          color: '#333',
          marginBottom: 8,
        },
        '& ul, & ol': {
          marginBottom: 8,
          paddingLeft: 16,
        },
        '& li': {
          fontSize: 16,
          lineHeight: 1.4,
          color: '#333',
          marginBottom: 4,
        },
        '& li:last-child': {
          marginBottom: 0,
        },
      },
    }),
  },
  relatedGames: {
    marginTop: 48,
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  relatedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 24,
  },
  relatedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  relatedCard: {
    flex: 1,
    minWidth: 250,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 20,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      },
    }),
  },
  relatedType: {
    fontSize: 12,
    color: '#6C5CE7',
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 8,
  },
  relatedName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  relatedDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});