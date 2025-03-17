import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { Link } from 'expo-router';
import { useLanguage } from '../utils/i18n';
import { useGameSettings } from '../utils/gameSettings';
import { PartyToolsSlider } from '../components/PartyToolsSlider';

// Tool icons mapping
const toolIcons = {
  'random-letter': require('../assets/images/game-icons/random-letter-generator.png'),
  'random-number': require('../assets/images/game-icons/random-number-generator.png'),
  'countdown': require('../assets/images/game-icons/countdown-timer.png'),
  'stopwatch': require('../assets/images/game-icons/stopwatch.png'),
  'dice': require('../assets/images/game-icons/dice-roller.png'),
  'rock-paper-scissors': require('../assets/images/game-icons/rock-paper-scissors.png'),
  'heads-or-tails': require('../assets/images/game-icons/heads-or-tails.png'),
  'spin-the-bottle': require('../assets/images/game-icons/spin-the-bottle.png'),
  'blood-alcohol-calculator': require('../assets/images/game-icons/blood-alcohol-calculator.png'),
  'team-generator': require('../assets/images/game-icons/team-generator.png'),
  'scoreboard': require('../assets/images/game-icons/scoreboard.png')
} as const;

export default function PartyTools() {
  const { t, language } = useLanguage();
  const { games, isLoading } = useGameSettings();

  // Only show enabled tools and sort them alphabetically by title
  const enabledTools = !isLoading ? games
    .filter(game => game.enabled && game.dashboard === 'partyTools')
    .sort((a, b) => t(a.titleKey).localeCompare(t(b.titleKey), language)) : [];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t('partyTools.title')}</Text>
      <Text style={styles.description}>{t('partyTools.description')}</Text>
      
      <PartyToolsSlider />
      
      <View style={styles.toolsGrid}>
        {enabledTools.map(tool => {
          const icon = toolIcons[tool.id as keyof typeof toolIcons];
          if (!icon) return null;

          return (
            <Link key={tool.id} href={`/${tool.path}`} asChild>
              <Pressable style={styles.toolCard}>
                <Image
                  source={icon}
                  style={styles.toolIcon}
                  resizeMode="cover"
                />
                <Text style={styles.toolTitle}>
                  {t(tool.titleKey)}
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
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingHorizontal: 20,
    justifyContent: 'center',
    paddingVertical: 16,
  },
  toolCard: {
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
  toolIcon: {
    width: 100,
    height: 100,
    borderRadius: 16,
    marginBottom: 12,
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    lineHeight: 20
  }
});