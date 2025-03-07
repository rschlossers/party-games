import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../utils/i18n';
import { supabase } from '../utils/supabase';
import type { Database } from '../utils/types';

type Category = Database['public']['Tables']['you_laugh_you_drink_categories']['Row'];
type Statement = Database['public']['Tables']['you_laugh_you_drink_statements']['Row'];
type Language = 'en' | 'da';

const BATCH_SIZE = 1000; // Supabase's maximum rows per request
const RANDOM_CATEGORY_ID = 'random';

export default function YouLaughYouDrink() {
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
        // Fetch statements for random category by default
        await fetchStatements(RANDOM_CATEGORY_ID);
      } catch (err) {
        console.error('Failed to initialize game:', err);
      }
    };
    
    initializeGame();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchStatements(selectedCategory);
      setPage(0);
      setHasMoreStatements(true);
      setStatements([]);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('you_laugh_you_drink_categories')
        .select('*');

      if (error) throw error;
      setCategories(data || []);
      setError(null);
    } catch (err) {
      console.error(err);
      if (retryCount < MAX_RETRIES) {
        // Retry after a short delay
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
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
            .from('you_laugh_you_drink_statements')
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
        .from('you_laugh_you_drink_statements')
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
      setHasMoreStatements(false); // We now fetch all statements at once
      setCurrentStatement(0);
    } catch (err) {
      setError('Failed to load statements');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
    
  const nextStatement = () => {
    if (selectedCategory) {
      const nextIndex = currentStatement + 1;

      if (nextIndex < statements.length) {
        setCurrentStatement(nextIndex);
      } else {
        // Shuffle the existing statements when we reach the end
        setStatements(prevStatements => {
          const shuffled = [...prevStatements];
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }
          return shuffled;
        });
        setCurrentStatement(0);
      }
    }
  };

  const startGame = () => {
    if (statements.length > 0) {
      setGameStarted(true);
    }
  };

  const goBackToCategories = () => {
    setSelectedCategory(null);
    setGameStarted(false); // Also reset the game state
    setCurrentStatement(0);
  };

  if (isLoading) {
    const loadingText = retryCount > 0 
      ? t('game.retrying', { count: retryCount })
      : t('game.loading');
      
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{loadingText}</Text>
        <ActivityIndicator size="large" color="#6C5CE7" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!gameStarted) {
    return (
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.categoryScrollContent}
        bounces={true}
        showsVerticalScrollIndicator={true}>
        <View style={styles.innerContainer}>
        <Text style={styles.title}>
          {t('youLaughYouDrink.categories.title')}
        </Text>
        
        <View style={styles.dropdownContainer}>
          <Pressable
            style={styles.dropdown}
            onPress={() => setDropdownOpen(!dropdownOpen)}
            disabled={isLoading}>
            <Text style={styles.dropdownText}>
              {selectedCategory === RANDOM_CATEGORY_ID
                ? t('game.randomCategory')
                : selectedCategory
                  ? categories.find(c => c.id === selectedCategory)?.[`name_${language as Language}` as 'name_en' | 'name_da']
                  : t('game.selectCategory')}
            </Text>
            <MaterialCommunityIcons
              name={dropdownOpen ? 'chevron-up' : 'chevron-down'}
              size={24}
              color="#000"
            />
          </Pressable>
          
          {dropdownOpen && (
            <View style={styles.dropdownList}>
              <Pressable
                key={RANDOM_CATEGORY_ID}
                style={[
                  styles.dropdownItem,
                  selectedCategory === RANDOM_CATEGORY_ID && styles.selectedDropdownItem,
                ]}
                onPress={() => {
                  setSelectedCategory(RANDOM_CATEGORY_ID);
                  setDropdownOpen(false);
                  fetchStatements(RANDOM_CATEGORY_ID);
                }}>
                <Text
                  style={[
                    styles.dropdownItemText,
                    selectedCategory === RANDOM_CATEGORY_ID && styles.selectedDropdownItemText,
                  ]}>
                  {t('game.randomCategory')}
                </Text>
              </Pressable>
              {categories.map((category) => (
                <Pressable
                  key={category.id}
                  style={[
                    styles.dropdownItem,
                    selectedCategory === category.id && styles.selectedDropdownItem,
                  ]}
                  onPress={() => {
                    setSelectedCategory(category.id);
                    setDropdownOpen(false);
                    fetchStatements(category.id);
                  }}>
                  <Text
                    style={[
                      styles.dropdownItemText,
                      selectedCategory === category.id && styles.selectedDropdownItemText,
                    ]}>
                    {category[`name_${language as Language}` as 'name_en' | 'name_da']}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
        </View>

        <Pressable
          style={[
            styles.startButton,
            !selectedCategory && styles.startButtonDisabled,
          ]}
          onPress={startGame}
          disabled={!selectedCategory}>
          <Text style={styles.startButtonText}>
            {t('game.startGame')}
          </Text>
        </Pressable>
      </ScrollView>
    );
  }

  const currentS = statements[currentStatement] || null;

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.gameScrollContent}
      bounces={true}
      showsVerticalScrollIndicator={true}>
      <Pressable
        onPress={goBackToCategories}
        style={styles.backButton}>
        <MaterialCommunityIcons
          name="arrow-left"
          size={24}
          color="#000"
        />
        <Text style={styles.backButtonText}>
          {t('youLaughYouDrink.categories.title')}
        </Text>
      </Pressable>

      <Text style={styles.title}>
        {t('youLaughYouDrink.title')}
      </Text>
      
      <View style={styles.statementContainer}>
        <View style={styles.statement}>
          {currentS ? (
            <>
              <Text style={styles.statementText}>
                {currentS[`text_${language as Language}` as 'text_en' | 'text_da']}
              </Text>
              <Text style={styles.statementCount}>
                {currentStatement + 1} / {statements.length}
                {hasMoreStatements ? '+' : ''}
              </Text>
            </>
          ) : (
            <Text style={styles.statementText}>
              {t('game.noStatements')}
            </Text>
          )}
        </View>
      </View>
      
      {isLoadingMore && (
        <View style={styles.loadingMoreContainer}>
          <ActivityIndicator size="small" color="#6C5CE7" />
          <Text style={styles.loadingMoreText}>{t('game.loadingMore')}</Text>
        </View>
      )}
      
      <Pressable
        onPress={nextStatement}
        style={styles.nextButton}>
        <Text style={styles.nextButtonText}>
          {t('game.next')}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    width: '100%',
  },
  categoryScrollContent: {
    flexGrow: 1,
    minHeight: '100%',
  },
  gameScrollContent: {
    flexGrow: 1,
    minHeight: '100%',
    paddingBottom: 20,
  },
  innerContainer: {
    flex: 1,
    padding: 16,
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 1,
    marginBottom: 16,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
  },
  dropdownText: {
    fontSize: 18,
    color: '#000',
  },
  dropdownList: {
    position: 'absolute',
    top: 'auto',
    left: 0,
    right: 0,
    maxHeight: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 4,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 8,
    zIndex: 1000,
    overflow: 'scroll',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginVertical: 2,
  },
  selectedDropdownItem: {
    backgroundColor: '#6C5CE7',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#000',
    width: '100%',
  },
  selectedDropdownItemText: {
    color: '#000',
    fontWeight: 'bold',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  backButtonText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#000',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 12,
    paddingHorizontal: 16,
    color: '#000',
  },
  statementContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    minHeight: 300,
  },
  startButton: {
    backgroundColor: '#6C5CE7',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    margin: 16,
  },
  startButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  startButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statement: {
    padding: 32,
    backgroundColor: '#6C5CE7',
    borderRadius: 15,
    minHeight: 200,
    justifyContent: 'center',
  },
  statementText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statementCount: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
  },
  loadingMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    gap: 8,
  },
  loadingMoreText: {
    color: '#666',
    fontSize: 14,
  },
  nextButton: {
    backgroundColor: '#6C5CE7',
    padding: 20,
    borderRadius: 16,
    margin: 16,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
  },
  nextButtonText: {
    color: '#000',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
});