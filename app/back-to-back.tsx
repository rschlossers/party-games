import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, ScrollView, SafeAreaView, Image, Dimensions, StatusBar } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../utils/i18n';
import { supabase } from '../utils/supabase';
import type { Database } from '../utils/types';

type Category = Database['public']['Tables']['back_to_back_categories']['Row'];
type Statement = Database['public']['Tables']['back_to_back_statements']['Row'];
type Language = 'en' | 'da';

const BATCH_SIZE = 1000; // Supabase's maximum rows per request
const RANDOM_CATEGORY_ID = 'random';
const { width } = Dimensions.get('window');

export default function BackToBack() {
  const { t, language } = useLanguage();
  const [currentStatement, setCurrentStatement] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<Category['id'] | null>(RANDOM_CATEGORY_ID);
  const [categories, setCategories] = useState<Category[]>([]);
  const [statements, setStatements] = useState<Statement[]>([]);
  const [hasMoreStatements, setHasMoreStatements] = useState(true);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  
  // Initialize game on mount
  useEffect(() => {
    const initializeGame = async () => {
      try {
        await fetchCategories();
        // Don't pre-load all statements, just set loading to false
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to initialize game:', err);
      }
    };
    
    initializeGame();
  }, []);

  useEffect(() => {
    if (selectedCategory && gameStarted) {
      // Load statements when a category is selected and game is started
      fetchStatements(selectedCategory);
    }
  }, [selectedCategory, gameStarted]);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase 
        .from('back_to_back_categories')
        .select('*');
      
      if (error) throw error;
      setCategories(data || []);
      setError(null);
    } catch (err) {
      console.error(err);
      if (retryCount < MAX_RETRIES) {
        // Retry after a short delay
        setTimeout(() => {
          setRetryCount((prev: number) => prev + 1);
          fetchCategories();
        }, 1000 * (retryCount + 1)); // Exponential backoff
      } else {
        setError(t('game.fetchError'));
        setRetryCount(0);
      }
      // Keep any existing categories if we have them
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStatements = async (categoryId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (categoryId === RANDOM_CATEGORY_ID) {
        let allStatements: Statement[] = [];
        let hasMore = true;
        let currentOffset = 0;

        // Fetch all statements in batches
        while (hasMore) {
          const { data, error } = await supabase
            .from('back_to_back_statements')
            .select('*')
            .range(currentOffset, currentOffset + BATCH_SIZE - 1);

          if (error) throw error;

          if (data && data.length > 0) {
            allStatements = [...allStatements, ...data];
            currentOffset += BATCH_SIZE;
          } else {
            hasMore = false;
          }
        }

        // Shuffle all collected statements
        for (let i = allStatements.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [allStatements[i], allStatements[j]] = [allStatements[j], allStatements[i]];
        }

        setStatements(allStatements);
        setHasMoreStatements(false); // Random mode doesn't support pagination
        setCurrentStatement(0);
        return;
      }

      // For specific categories, fetch normally
      const { data, error } = await supabase
        .from('back_to_back_statements')
        .select('*')
        .eq('category_id', categoryId);
      
      if (error) throw error;
      
      // Shuffle the statements before setting them
      const shuffledData = data ? [...data] : [];
      for (let i = shuffledData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledData[i], shuffledData[j]] = [shuffledData[j], shuffledData[i]];
      }
      
      setStatements(shuffledData);
      setCurrentStatement(0);
      setHasMoreStatements(false); // We now fetch all statements at once
    } catch (err) {
      setError('Failed to load statements');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStatement = () => {
    if (statements.length > 0) {
      const nextIndex = currentStatement + 1;

      if (nextIndex < statements.length) {
        setCurrentStatement(nextIndex);
      } else {
        // Shuffle the existing statements when we reach the end
        setStatements((prevStatements: Statement[]) => {
          const shuffled = [...prevStatements];
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[i], shuffled[j]];
          }
          return shuffled;
        });
        setCurrentStatement(0);
      }
    }
  };

  const startGame = () => {
    setGameStarted(true);
    fetchStatements(selectedCategory || RANDOM_CATEGORY_ID);
  };

  if (isLoading) {
    const loadingText = retryCount > 0 
      ? t('game.retrying')
      : t('game.loading');
      
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF5E62" />
        <Text style={styles.loadingText}>{loadingText}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const currentS = statements[currentStatement] || null;
  const categoryName = selectedCategory === RANDOM_CATEGORY_ID
    ? t('game.randomCategory')
    : selectedCategory
      ? categories.find((c: any) => c.id === selectedCategory)?.[`name_${language as Language}` as 'name_en' | 'name_da']
      : t('game.selectCategory');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Small back button in corner */}
      <Pressable 
        style={styles.backButton}
        onPress={() => {
          // Navigate back to game overview
          if (typeof window !== 'undefined') {
            window.history.back();
          }
        }}
      >
        <MaterialCommunityIcons name="arrow-left" size={20} color="#666666" />
        <Text style={styles.backButtonText}>{t('game.back')}</Text>
      </Pressable>
      
      {/* Game Icon ABOVE headline */}
      <View style={styles.iconContainer}>
        <Image 
          source={require('../assets/images/game-icons/back-to-back.png')} 
          style={styles.gameIcon}
          resizeMode="contain"
        />
      </View>
      
      {/* Headline below icon */}
      <Text style={styles.headerTitle}>{t('backToBack.title')}</Text>
      
      {/* Category Selector */}
      <View style={styles.dropdownContainer}>
        <Pressable
          style={styles.dropdown}
          onPress={() => setDropdownOpen(!dropdownOpen)}
          disabled={isLoading}>
          <Text style={styles.dropdownText}>{categoryName}</Text>
          <MaterialCommunityIcons
            name={dropdownOpen ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="#FF5E62"
          />
        </Pressable>
      </View>
      
      {/* Game Content */}
      {gameStarted && currentS ? (
        <View style={styles.questionContainer}>
          <View style={styles.questionCard}>
            <Text style={styles.questionText}>
              {currentS[`text_${language as Language}` as 'text_en' | 'text_da']}
            </Text>
          </View>
          
          {/* Next Button */}
          <Pressable
            onPress={nextStatement}
            style={({pressed}) => [
              styles.nextButton,
              pressed && styles.nextButtonPressed
            ]}>
            <MaterialCommunityIcons name="arrow-right" size={24} color="#FFFFFF" />
          </Pressable>
        </View>
      ) : (
        <View style={styles.startContainer}>
          <Pressable
            style={({pressed}) => [
              styles.startButton,
              pressed && styles.startButtonPressed
            ]}
            onPress={startGame}>
            <Text style={styles.startButtonText}>{t('game.startGame')}</Text>
          </Pressable>
        </View>
      )}
      
      {/* Game Description */}
      <View style={styles.gameInfoContainer}>
        <Text style={styles.gameInfoText}>
          {t('backToBack.description')}
        </Text>
      </View>
      
      {/* Dropdown List - Keep outside main content to handle z-index */}
      {dropdownOpen && (
        <View style={styles.dropdownListContainer}>
          <Pressable 
            style={styles.dropdownBackdrop}
            onPress={() => setDropdownOpen(false)}
          />
          <View style={styles.dropdownListWrapper}>
            <ScrollView style={styles.dropdownList} bounces={false}>
              <Pressable
                key={RANDOM_CATEGORY_ID}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedCategory(RANDOM_CATEGORY_ID);
                  setDropdownOpen(false);
                  if (gameStarted) {
                    fetchStatements(RANDOM_CATEGORY_ID);
                  }
                }}>
                <Text style={[
                  styles.dropdownItemText,
                  selectedCategory === RANDOM_CATEGORY_ID && styles.selectedDropdownItemText,
                ]}>
                  {t('game.randomCategory')}
                </Text>
                {selectedCategory === RANDOM_CATEGORY_ID && (
                  <MaterialCommunityIcons name="check" size={22} color="#FF5E62" />
                )}
              </Pressable>
              
              {categories.map((category: any) => (
                <Pressable
                  key={category.id}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedCategory(category.id);
                    setDropdownOpen(false);
                    if (gameStarted) {
                      fetchStatements(category.id);
                    }
                  }}>
                  <Text style={[
                    styles.dropdownItemText,
                    selectedCategory === category.id && styles.selectedDropdownItemText,
                  ]}>
                    {category[`name_${language as Language}` as 'name_en' | 'name_da']}
                  </Text>
                  {selectedCategory === category.id && (
                    <MaterialCommunityIcons name="check" size={22} color="#FF5E62" />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666666',
    marginLeft: 2,
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 48,
    marginBottom: 12,
  },
  gameIcon: {
    width: 100,
    height: 100,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 24,
  },
  // Dropdown styles
  dropdownContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    zIndex: 5,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  // Question display
  questionContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  questionCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginBottom: 30,
  },
  questionText: {
    fontSize: 22,
    color: '#333333',
    lineHeight: 30,
    textAlign: 'center',
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: '#FF5E62',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  nextButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.95 }],
  },
  // Start Game
  startContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  startButton: {
    backgroundColor: '#FF5E62',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  startButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  // Game info
  gameInfoContainer: {
    padding: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  gameInfoText: {
    color: '#666666',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  // Keep all existing dropdown list styles
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#666666',
    fontSize: 18,
    marginTop: 16,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
    maxWidth: '80%',
  },
  dropdownBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  dropdownListContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  dropdownListWrapper: {
    width: width - 40,
    maxHeight: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  dropdownList: {
    width: '100%',
    maxHeight: '100%',
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333333',
  },
  selectedDropdownItemText: {
    color: '#FF5E62',
    fontWeight: '600',
  }
});