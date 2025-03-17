import { ScrollView, View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useRef, useState } from 'react';
import { useLanguage } from '../utils/i18n';
import { useGameSettings } from '../utils/gameSettings';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Constants for layout
const ITEM_WIDTH = 64; // Width of each game item
const ITEM_GAP = 16; // Gap between items
const VISIBLE_ITEMS = 4; // Show 4 items at once
const TOTAL_ITEM_WIDTH = ITEM_WIDTH + ITEM_GAP; // Total width including gap

// Create a mapping of game IDs to their image imports
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
  'fuck-marry-kill': require('../assets/images/game-icons/fuck-marry-kill.png')
} as const;

export function GameSlider() {
  const { t } = useLanguage();
  const { games } = useGameSettings();
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // Only show party games
  const partyGames = games
    .filter(game => game.dashboard === 'party')
    .sort((a, b) => t(a.titleKey).localeCompare(t(b.titleKey)));

  const maxScroll = Math.max(0, (partyGames.length * TOTAL_ITEM_WIDTH) - (VISIBLE_ITEMS * TOTAL_ITEM_WIDTH));

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
        {partyGames.map(game => {
          const icon = gameIcons[game.id as keyof typeof gameIcons];
          if (!icon) return null;

          return (
            <Link key={game.id} href={`/${game.path}`} asChild>
              <Pressable style={styles.gameItem}>
                <Image
                  source={icon}
                  style={styles.gameIcon}
                  resizeMode="contain"
                />
                <Text style={styles.gameTitle} numberOfLines={2}>
                  {t(game.titleKey)}
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
  gameItem: {
    width: 64,
    alignItems: 'center',
    gap: 8,
  },
  gameIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  gameTitle: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
    maxWidth: '100%',
  },
});