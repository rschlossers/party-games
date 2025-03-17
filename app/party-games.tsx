import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { Link } from 'expo-router';
import { useLanguage } from '../utils/i18n';
import { useGameSettings } from '../utils/gameSettings';
import { GameSlider } from '../components/GameSlider';

// Game icons mapping
const gameIcons = {
  'back-to-back': require('../assets/images/game-icons/back-to-back.png'),
  'everyone-who-stands': require('../assets/images/game-icons/everyone-who-stands.png'),
  'best-story-wins': require('../assets/images/game-icons/best-story-wins.png'),
  'charades': require('../assets/images/game-icons/charades.png'),
  'do-or-drink': require('../assets/images/game-icons/do-or-drink.png'),
  'bad-movie-plots': require('../assets/images/game-icons/bad-movie-plots.png'),
  'i-should-know-that': require('../assets/images/game-icons/i-should-know-that.png'),
  'i-wish-i-didnt-know-that': require('../assets/images/game-icons/i-wish-i-didnt-know-that.png'),
  'photo-challenges': require('../assets/images/game-icons/photo-challenges.png'),
  'pictionary': require('../assets/images/game-icons/pictionary.png'),
  'whats-your-number': require('../assets/images/game-icons/whats\'your-number.png'),
  'you-laugh-you-drink': require('../assets/images/game-icons/you-laugh-you-drink.png'),
  'you-lie-you-drink': require('../assets/images/game-icons/you-lie-you-drink.png'),
  'would-you-rather': require('../assets/images/game-icons/would-you-rather.png'),
  'who-in-the-room': require('../assets/images/game-icons/who-in-the-room.png'),
  'truth-or-dare': require('../assets/images/game-icons/truth-or-dare.png'),
  'truth-or-bullshit': require('../assets/images/game-icons/truth-or-bullshit.png'),
  'taskmaster': require('../assets/images/game-icons/taskmaster.png'),
  'say-the-same-thing': require('../assets/images/game-icons/say-the-same-thing.png'),
  'never-have-i-ever': require('../assets/images/game-icons/never-have-i-ever.png'),
  'impressions': require('../assets/images/game-icons/impressions.png'),
  'fuck-marry-kill': require('../assets/images/game-icons/fuck-marry-kill.png'),
  'video-challenges': require('../assets/images/game-icons/video-challenges.png')
} as const;

export default function PartyGames() {
  const { t, language } = useLanguage();
  const { games, isLoading } = useGameSettings();

  // Only show enabled games on the party games dashboard and sort them alphabetically by title
  const enabledGames = !isLoading ? games
    .filter(game => game.enabled && game.dashboard === 'party')
    .sort((a, b) => t(a.titleKey).localeCompare(t(b.titleKey), language)) : [];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t('index.page')}</Text>
      <Text style={styles.description}>{t('index.description')}</Text>
      
      <GameSlider />
      
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
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
    paddingHorizontal: 12,
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