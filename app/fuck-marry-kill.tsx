import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../utils/i18n';
import { supabase } from '../utils/supabase';
import type { Database } from '../utils/types';

type Category = Database['public']['Tables']['fuck_marry_kill_categories']['Row'];
type Gender = Database['public']['Tables']['fuck_marry_kill_genders']['Row'];
type Statement = Database['public']['Tables']['fuck_marry_kill_statements']['Row'];
type Language = 'en' | 'da';

const BATCH_SIZE = 1000; // Supabase's maximum rows per request
const RANDOM_CATEGORY_ID = 'random';

export default function FuckMarryKill() {
  const { t, language } = useLanguage();
  const [currentStatement, setCurrentStatement] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<Category['id'] | null>(RANDOM_CATEGORY_ID);
  const [selectedGender, setSelectedGender] = useState<Gender['id'] | 'mixed' | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [genders, setGenders] = useState<Gender[]>([]);
  const [statements, setStatements] = useState<Statement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
        await fetchGenders();
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
        .from('fuck_marry_kill_categories')
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

  const fetchGenders = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('fuck_marry_kill_genders')
        .select('*');
      
      if (error) throw error;
      setGenders(data || []);
    } catch (err) {
      setError('Failed to load genders');
      console.error(err);
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
            .from('fuck_marry_kill_statements')
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

      const { data, error } = await supabase
        .from('fuck_marry_kill_statements')
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

  if (!gameStarted) {
    return (
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.categoryScrollContent}
        bounces={true}
        showsVerticalScrollIndicator={true}>
        <View style={styles.innerContainer}>
        <Text style={styles.title}>
          {t('fuckMarryKill.categories.title')}
        </Text>
        
        <View style={styles.dropdownContainer}>
          <Pressable
            style={styles.dropdown}
            onPress={() => setDropdownOpen(!dropdownOpen)}>
            <Text style={styles.dropdownText}>
              {selectedCategory
                ? categories.find(c => c.id === selectedCategory)?.[`name_${language}` as keyof typeof categories[0]]
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
                  }}>
                  <Text
                    style={[
                      styles.dropdownItemText,
                      selectedCategory === category.id && styles.selectedDropdownItemText,
                    ]}>
                    {category[`name_${language}` as keyof typeof category]}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <Pressable
          style={[
            styles.startButton,
            !selectedCategory && styles.startButtonDisabled,
          ]}
          onPress={() => setGameStarted(true)}
          disabled={!selectedCategory}>
          <Text style={styles.startButtonText}>
            {t('game.startGame')}
          </Text>
        </Pressable>
        </View>
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
          {t('game.back')}
        </Text>
      </Pressable>

      <Text style={styles.title}>
        {categories.find(c => c.id === selectedCategory)?.[`name_${language}` as keyof typeof categories[0]]}
      </Text>
      
      <View style={styles.statementContainer}>
        {currentS ? (
          <View style={styles.statement}>
            <Text style={styles.statementText}>
              {currentS[`text_${language}` as keyof typeof currentS]}
            </Text>
          </View>
        ) : (
          <Text style={styles.errorText}>
            {t('game.noStatements')}
          </Text>
        )}
      </View>

      <Pressable
        style={styles.nextButton}
        onPress={() => setCurrentStatement(prev => prev + 1)}>
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
    padding: 16,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dropdownText: {
    fontSize: 16,
    color: '#000',
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
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
    overflow: 'scroll'
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
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  startButtonText: {
    color: '#FFFFFF',
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
    color: '#FFFFFF',
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#6C5CE7',
    padding: 20,
    borderRadius: 16,
    margin: 16
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  }
});