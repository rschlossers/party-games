import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { useLanguage } from '../utils/i18n';
import { useGameSettings } from '../utils/gameSettings';
import { Link } from 'expo-router';
import { FunStuffSlider } from '../components/FunStuffSlider';

// Game icons mapping
const gameIcons = {
  'date-ideas': require('../assets/images/game-icons/date-ideas.png'),
  'pickup-lines': require('../assets/images/game-icons/pickup-lines.png'),
  'joke-generator': require('../assets/images/game-icons/joke-generator.png'),
  'random-theme': require('../assets/images/game-icons/random-theme.png'),
  'birthday-greetings': require('../assets/images/game-icons/birthday-greetings.png'),
  'conversation-starters': require('../assets/images/game-icons/conversation-starters.png')
} as const;

export default function FunStuff() {
  const { t, language } = useLanguage();
  const { games, isLoading } = useGameSettings();

  // Only show enabled games on the fun stuff dashboard and sort them alphabetically by title
  const enabledGames = !isLoading ? games
    .filter(game => game.enabled && game.dashboard === 'funStuff')
    .sort((a, b) => t(a.titleKey).localeCompare(t(b.titleKey), language)) : [];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {t('funStuff.title')}
      </Text>
      <Text style={styles.description}>
        {t('funStuff.description')}
      </Text>
      
      <FunStuffSlider />
      
      <View style={styles.gamesGrid}>
        {enabledGames.map(game => {
          const icon = gameIcons[game.id as keyof typeof gameIcons];
          if (!icon) return null;

          return (
          <Link key={game.id} href={`/${game.path}`} asChild>
            <Pressable style={styles.gameCard}>
              <Image
                source={icon}
                style={styles.gameIcon}
                resizeMode="cover"
              />
              <Text style={styles.gameTitle}>
                {t(game.titleKey)}
              </Text>
            </Pressable>
          </Link>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 20
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center'
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
    paddingHorizontal: 12
  },
  gamesGrid: { 
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingHorizontal: 20,
    justifyContent: 'center',
    paddingVertical: 16,
  },
  gameCard: {
    width: 140,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  gameIcon: {
    width: 100,
    height: 100,
    borderRadius: 16,
    marginBottom: 12,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    lineHeight: 20
  }
});