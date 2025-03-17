import { ScrollView, View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useRef, useState } from 'react';
import { useLanguage } from '../utils/i18n';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Constants for layout
const ITEM_WIDTH = 64; // Width of each game item
const ITEM_GAP = 16; // Gap between items
const VISIBLE_ITEMS = 4; // Show 4 items at once
const TOTAL_ITEM_WIDTH = ITEM_WIDTH + ITEM_GAP; // Total width including gap

// Sample drinking games data
const drinkingGames = [
  { id: 'kings-cup', title: 'Kings Cup', icon: 'https://images.unsplash.com/photo-1577281747309-e5f2f363c4bc?w=64&h=64&fit=crop' },
  { id: 'beer-pong', title: 'Beer Pong', icon: 'https://images.unsplash.com/photo-1577281746925-9d074a7677e9?w=64&h=64&fit=crop' },
  { id: 'flip-cup', title: 'Flip Cup', icon: 'https://images.unsplash.com/photo-1577281746814-c35c5142b6ce?w=64&h=64&fit=crop' },
  { id: 'quarters', title: 'Quarters', icon: 'https://images.unsplash.com/photo-1577281746931-d5c9d8356d7d?w=64&h=64&fit=crop' },
  { id: 'never-have', title: 'Never Have I Ever', icon: 'https://images.unsplash.com/photo-1577281746937-5c9d8356d7e1?w=64&h=64&fit=crop' },
  { id: 'truth-dare', title: 'Truth or Dare', icon: 'https://images.unsplash.com/photo-1577281746943-5c9d8356d7e3?w=64&h=64&fit=crop' },
];

export function DrinkingGamesSlider() {
  const { t } = useLanguage();
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const maxScroll = Math.max(0, (drinkingGames.length * TOTAL_ITEM_WIDTH) - (VISIBLE_ITEMS * TOTAL_ITEM_WIDTH));

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
        {drinkingGames.map(game => (
          <Link key={game.id} href={`/drinking-game/${game.id}`} asChild>
            <Pressable style={styles.gameItem}>
              <Image
                source={{ uri: game.icon }}
                style={styles.gameIcon}
                resizeMode="cover"
              />
              <Text style={styles.gameTitle} numberOfLines={2}>
                {game.title}
              </Text>
            </Pressable>
          </Link>
        ))}
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