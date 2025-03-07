import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../utils/i18n';
import { useGameSettings } from '../utils/gameSettings';
import { GAMES } from '../utils/gameConfig';

export default function PartyTools() {
  const { t, language } = useLanguage();
  const { isGameEnabled } = useGameSettings();

  // Get only party tools from GAMES config
  const partyTools = GAMES
    .filter(game => game.dashboard === 'partyTools' && isGameEnabled(game.id))
    .sort((a, b) => t(a.titleKey).localeCompare(t(b.titleKey), language));

  // Tool color assignments based on icon
  function getToolColor(gameId: string) {
    const colorMap: Record<string, string> = {
      'random-letter': '#FF9800',         // Orange
      'random-number': '#3F51B5',         // Indigo
      'countdown': '#F44336',             // Red
      'stopwatch': '#9C27B0',             // Purple
      'dice': '#00BCD4',                  // Cyan
      'rock-paper-scissors': '#FFC107',   // Amber
      'heads-or-tails': '#4CAF50',        // Green
    };
    return colorMap[gameId] || '#00B894'; // Default teal color
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {t('partyTools.title')}
      </Text>
      <Text style={styles.description}>
        {t('partyTools.description')}
      </Text>
      
      <View style={styles.cardList}>
        {partyTools.map(tool => (
          <Link key={tool.id} href={`/${tool.path}`} asChild>
            <Pressable style={styles.card}>
              <View style={[styles.iconContainer, { backgroundColor: getToolColor(tool.id) }]}>
                <MaterialCommunityIcons
                  name={tool.icon as any}
                  size={32}
                  color="#FFF"
                />
              </View>
              <View style={styles.cardTextContent}>
                <Text style={styles.cardTitle}>
                  {t(tool.titleKey)}
                </Text>
                <Text style={styles.cardDescription}>
                  {t(tool.descriptionKey)}
                </Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={getToolColor(tool.id)}
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
    backgroundColor: '#FFFFFF'
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
    padding: 20,
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
    fontSize: 16,
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
  }
});