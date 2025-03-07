import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../utils/i18n';
import { Link } from 'expo-router';
import { useGameSettings } from '../utils/gameSettings';
import { GAMES } from '../utils/gameConfig';

export default function FunStuff() {
  const { t, language } = useLanguage();
  const { isGameEnabled } = useGameSettings();

  // Get only fun stuff games from GAMES config
  const funStuffGames = GAMES
    .filter(game => game.dashboard === 'funStuff' && isGameEnabled(game.id))
    .sort((a, b) => t(a.titleKey).localeCompare(t(b.titleKey), language));

  // Game color assignments based on icon
  function getGameColor(gameId: string) {
    const colorMap: Record<string, string> = {
      'pickup-lines': '#E91E63',
      'date-ideas': '#E91E63',
    };
    return colorMap[gameId] || '#6C5CE7'; // Default purple color
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {t('funStuff.title')}
      </Text>
      <Text style={styles.description}>
        {t('funStuff.description')}
      </Text>
      
      <View style={styles.cardList}>
        {funStuffGames.map(game => (
          <Link key={game.id} href={`/${game.path}`} asChild>
            <Pressable style={styles.card}>
              <View style={[styles.iconContainer, { backgroundColor: getGameColor(game.id) }]}>
                <MaterialCommunityIcons
                  name={game.icon as any}
                  size={32}
                  color="#FFF"
                />
              </View>
              <View style={styles.cardTextContent}>
                <Text style={styles.cardTitle}>
                  {t(game.titleKey)}
                </Text>
                <Text style={styles.cardDescription}>
                  {t(game.descriptionKey)}
                </Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color="#6C5CE7"
              />
            </Pressable>
          </Link>
        ))}
        
        {/* Coming Soon Card */}
        <View style={[styles.card, styles.comingSoonCard]}>
          <View style={[styles.iconContainer, { backgroundColor: '#CCCCCC' }]}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={32}
              color="#FFF"
            />
          </View>
          <View style={styles.cardTextContent}>
            <Text style={styles.comingSoonTitle}>
              {t('index.comingSoon')}
            </Text>
            <Text style={styles.comingSoonDescription}>
              {t('index.moreGames')}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
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
  cardList: {
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardTextContent: {
    flex: 1,
  },
  cardTitle: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDescription: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
  comingSoonCard: {
    backgroundColor: '#F8F8F8',
    opacity: 0.8,
  },
  comingSoonTitle: {
    color: '#666',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  comingSoonDescription: {
    color: '#999',
    fontSize: 14,
    lineHeight: 20,
  },
});