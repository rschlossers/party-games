import { ScrollView, View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useRef, useState } from 'react';
import { useLanguage } from '../utils/i18n';
import { useGameSettings } from '../utils/gameSettings';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Create a mapping of tool IDs to their image imports
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

// Constants for layout
const ITEM_WIDTH = 64; // Width of each tool item
const ITEM_GAP = 16; // Gap between items
const VISIBLE_ITEMS = 4; // Show 4 items at once
const TOTAL_ITEM_WIDTH = ITEM_WIDTH + ITEM_GAP; // Total width including gap

export function PartyToolsSlider() {
  const { t } = useLanguage();
  const { games } = useGameSettings();
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // Only show party tools
  const partyTools = games
    .filter(game => game.dashboard === 'partyTools')
    .sort((a, b) => t(a.titleKey).localeCompare(t(b.titleKey)));

  const maxScroll = Math.max(0, (partyTools.length * TOTAL_ITEM_WIDTH) - (VISIBLE_ITEMS * TOTAL_ITEM_WIDTH));

  const scrollLeft = () => {
    // Scroll by page (4 items at a time)
    const pageWidth = TOTAL_ITEM_WIDTH * VISIBLE_ITEMS;
    const newPosition = Math.max(0, scrollPosition - pageWidth);
    scrollViewRef.current?.scrollTo({ x: newPosition, animated: true });
    setScrollPosition(newPosition);
  };

  const scrollRight = () => {
    // Scroll by page (4 items at a time)
    const pageWidth = TOTAL_ITEM_WIDTH * VISIBLE_ITEMS;
    const newPosition = Math.min(maxScroll, scrollPosition + pageWidth);
    scrollViewRef.current?.scrollTo({ x: newPosition, animated: true });
    setScrollPosition(newPosition);
  };

  const handleScroll = (event: any) => {
    setScrollPosition(event.nativeEvent.contentOffset.x);
  };

  return (
    <View style={styles.sliderContainer}>
      <Pressable 
        style={[styles.navButton, scrollPosition <= 0 && styles.navButtonDisabled]} 
        onPress={scrollLeft}
        disabled={scrollPosition <= 0}>
        <MaterialCommunityIcons name="chevron-left" size={24} color="#666" />
      </Pressable>

      <ScrollView 
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.container}>
        {partyTools.map(tool => {
          const icon = toolIcons[tool.id as keyof typeof toolIcons];
          if (!icon) return null;

          return (
            <Link key={tool.id} href={`/${tool.path}`} asChild>
              <Pressable style={styles.toolItem}>
                <Image
                  source={icon}
                  style={styles.toolIcon}
                  resizeMode="contain"
                />
                <Text style={styles.toolTitle} numberOfLines={2}>
                  {t(tool.titleKey)}
                </Text>
              </Pressable>
            </Link>
          );
        })}
      </ScrollView>

      <Pressable 
        style={[styles.navButton, scrollPosition >= maxScroll && styles.navButtonDisabled]}
        onPress={scrollRight}
        disabled={scrollPosition >= maxScroll}>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#666" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#F8F8F8',
    marginHorizontal: -16,
  },
  container: {
    paddingHorizontal: 16,
    gap: ITEM_GAP,
    width: TOTAL_ITEM_WIDTH * VISIBLE_ITEMS, // Constrain width to show exactly 4 items
  },
  navButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
    marginHorizontal: 4,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  toolItem: {
    width: 64,
    alignItems: 'center',
    gap: 8,
  },
  toolIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  toolTitle: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
    maxWidth: '100%',
  },
});