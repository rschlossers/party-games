import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../utils/i18n';
import { supabase } from '../utils/supabase';
import type { Database } from '../utils/types';

type TruthCategory = Database['public']['Tables']['truth_or_dare_truth_categories']['Row'];
type TruthStatement = Database['public']['Tables']['truth_or_dare_truth_statements']['Row'];
type DareCategory = Database['public']['Tables']['truth_or_dare_dare_categories']['Row'];
type DareStatement = Database['public']['Tables']['truth_or_dare_dare_statements']['Row'];
type Language = 'en' | 'da';

const BATCH_SIZE = 1000; // Supabase's maximum rows per request
const RANDOM_CATEGORY_ID = 'random';

export default function TruthOrDare() {
  const { t, language } = useLanguage();
  
  // Truth state
  const [selectedTruthCategory, setSelectedTruthCategory] = useState<TruthCategory['id'] | 'random'>(RANDOM_CATEGORY_ID);
  const [truthCategories, setTruthCategories] = useState<TruthCategory[]>([]);
  const [truthStatements, setTruthStatements] = useState<TruthStatement[]>([]);
  
  // Dare state
  const [selectedDareCategory, setSelectedDareCategory] = useState<DareCategory['id'] | 'random'>(RANDOM_CATEGORY_ID);
  const [dareCategories, setDareCategories] = useState<DareCategory[]>([]);
  const [dareStatements, setDareStatements] = useState<DareStatement[]>([]);
  
  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [truthDropdownOpen, setTruthDropdownOpen] = useState(false);
  const [dareDropdownOpen, setDareDropdownOpen] = useState(false);
  const [currentStatement, setCurrentStatement] = useState<TruthStatement | DareStatement | null>(null);
  const [statementType, setStatementType] = useState<'truth' | 'dare' | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  // Load categories when component mounts
  useEffect(() => {
    const initializeGame = async () => {
      setIsLoading(true);
      try {
        // First fetch categories
        await fetchTruthCategories();
        await fetchDareCategories();
        
        // Then fetch random statements for both truth and dare
        await Promise.all([
          fetchTruthStatements(RANDOM_CATEGORY_ID),
          fetchDareStatements(RANDOM_CATEGORY_ID)
        ]);
        
        setError(null);
      } catch (err) {
        console.error('Failed to initialize game:', err);
        setError(t('game.fetchError'));
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeGame();
  }, []);

  // Close dropdowns when clicking outside (for web)
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleClickOutside = () => {
        setTruthDropdownOpen(false);
        setDareDropdownOpen(false);
      };
      
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, []);

  const handleDropdownToggle = (e: any, type: 'truth' | 'dare') => {
    // Prevent click from propagating to document (for the useEffect click handler)
    if (Platform.OS === 'web' && e.stopPropagation) {
      e.stopPropagation();
    }
    
    if (type === 'truth') {
      setTruthDropdownOpen(!truthDropdownOpen);
      setDareDropdownOpen(false);
    } else {
      setDareDropdownOpen(!dareDropdownOpen);
      setTruthDropdownOpen(false);
    }
  };

  const fetchTruthCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('truth_or_dare_truth_categories')
        .select('*');
      
      if (error) throw error;
      setTruthCategories(data || []);
    } catch (err) {
      console.error(err);
      if (retryCount < MAX_RETRIES) {
        // Retry after a short delay
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchTruthCategories();
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

  const fetchDareCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('truth_or_dare_dare_categories')
        .select('*');
      
      if (error) throw error;
      setDareCategories(data || []);
    } catch (err) {
      console.error(err);
      if (retryCount < MAX_RETRIES) {
        // Retry after a short delay
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchDareCategories();
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

  const fetchTruthStatements = async (categoryId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (categoryId === RANDOM_CATEGORY_ID) {
        let allStatements: TruthStatement[] = [];
        let hasMore = true;
        let currentOffset = 0;

        // Fetch all statements in batches
        while (hasMore) {
          const { data, error } = await supabase
            .from('truth_or_dare_truth_statements')
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

        setTruthStatements(allStatements);
        return;
      }

      const { data, error } = await supabase
        .from('truth_or_dare_truth_statements')
        .select('*')
        .eq('category_id', categoryId);
      
      if (error) throw error;
      
      // Shuffle the statements before setting them
      const shuffledData = data ? [...data] : [];
      for (let i = shuffledData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledData[i], shuffledData[j]] = [shuffledData[j], shuffledData[i]];
      }
      
      setTruthStatements(shuffledData);
    } catch (err) {
      setError('Failed to load truth statements');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDareStatements = async (categoryId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (categoryId === RANDOM_CATEGORY_ID) {
        let allStatements: DareStatement[] = [];
        let hasMore = true;
        let currentOffset = 0;

        // Fetch all statements in batches
        while (hasMore) {
          const { data, error } = await supabase
            .from('truth_or_dare_dare_statements')
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

        setDareStatements(allStatements);
        return;
      }

      const { data, error } = await supabase
        .from('truth_or_dare_dare_statements')
        .select('*')
        .eq('category_id', categoryId);
      
      if (error) throw error;
      
      // Shuffle the statements before setting them
      const shuffledData = data ? [...data] : [];
      for (let i = shuffledData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledData[i], shuffledData[j]] = [shuffledData[j], shuffledData[i]];
      }
      
      setDareStatements(shuffledData);
    } catch (err) {
      setError('Failed to load dare statements');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getRandomTruth = () => {
    if (!selectedTruthCategory || truthStatements.length === 0) {
      return;
    }
    
    // Get next statement
    const nextStatement = truthStatements[0];
    
    // Rotate array to move used statement to end
    setTruthStatements(prev => {
      const [first, ...rest] = prev;
      return [...rest, first];
    });
    
    setCurrentStatement(nextStatement);
    setStatementType('truth');
    
    // If we're running low on statements, fetch more
    if (truthStatements.length < 5) {
      fetchTruthStatements(selectedTruthCategory);
    }
  };

  const getRandomDare = () => {
    if (!selectedDareCategory || dareStatements.length === 0) {
      return;
    }
    
    // Get next statement
    const nextStatement = dareStatements[0];
    
    // Rotate array to move used statement to end
    setDareStatements(prev => {
      const [first, ...rest] = prev;
      return [...rest, first];
    });
    
    setCurrentStatement(nextStatement);
    setStatementType('dare');
    
    // If we're running low on statements, fetch more
    if (dareStatements.length < 5) {
      fetchDareStatements(selectedDareCategory);
    }
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

  const renderTruthDropdown = () => (
    <View style={[styles.dropdownWrapper, truthDropdownOpen && styles.activeDropdownWrapper]}>
      <Text style={styles.categoryLabel}>{t('truthOrDare.categories.truthTitle')}</Text>
      <View style={styles.dropdownContainer}>
        <Pressable
          style={styles.dropdown}
          onPress={(e) => handleDropdownToggle(e, 'truth')}>
          <Text style={styles.dropdownText} numberOfLines={1} ellipsizeMode="tail">
            {selectedTruthCategory === RANDOM_CATEGORY_ID
              ? t('game.randomCategory')
              : selectedTruthCategory
              ? truthCategories.find(c => c.id === selectedTruthCategory)?.[`name_${language as Language}` as 'name_en' | 'name_da']
              : t('game.selectCategory')}
          </Text>
          <MaterialCommunityIcons
            name={truthDropdownOpen ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="#000"
          />
        </Pressable>
        
        {truthDropdownOpen && (
          <View style={styles.dropdownListContainer}>
            <ScrollView 
              style={styles.dropdownList}
              contentContainerStyle={styles.dropdownScrollContent}
              nestedScrollEnabled={true}>
              <Pressable
                key={RANDOM_CATEGORY_ID}
                style={[
                  styles.dropdownItem,
                  selectedTruthCategory === RANDOM_CATEGORY_ID && styles.selectedDropdownItem,
                ]}
                onPress={() => {
                  setSelectedTruthCategory(RANDOM_CATEGORY_ID);
                  setTruthDropdownOpen(false);
                  fetchTruthStatements(RANDOM_CATEGORY_ID);
                }}>
                <Text
                  style={[
                    styles.dropdownItemText,
                    selectedTruthCategory === RANDOM_CATEGORY_ID && styles.selectedDropdownItemText,
                  ]}>
                  {t('game.randomCategory')}
                </Text>
              </Pressable>
              {truthCategories.map((category) => (
                <Pressable
                  key={category.id}
                  style={[
                    styles.dropdownItem,
                    selectedTruthCategory === category.id && styles.selectedDropdownItem,
                  ]}
                  onPress={() => {
                    setSelectedTruthCategory(category.id);
                    setTruthDropdownOpen(false);
                  }}>
                  <Text
                    style={[
                      styles.dropdownItemText,
                      selectedTruthCategory === category.id && styles.selectedDropdownItemText,
                    ]}>
                    {category[`name_${language as Language}` as 'name_en' | 'name_da']}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );

  const renderDareDropdown = () => (
    <View style={[styles.dropdownWrapper, dareDropdownOpen && styles.activeDropdownWrapper]}>
      <Text style={styles.categoryLabel}>{t('truthOrDare.categories.dareTitle')}</Text>
      <View style={styles.dropdownContainer}>
        <Pressable
          style={styles.dropdown}
          onPress={(e) => handleDropdownToggle(e, 'dare')}>
          <Text style={styles.dropdownText} numberOfLines={1} ellipsizeMode="tail">
            {selectedDareCategory === RANDOM_CATEGORY_ID
              ? t('game.randomCategory')
              : selectedDareCategory
              ? dareCategories.find(c => c.id === selectedDareCategory)?.[`name_${language as Language}` as 'name_en' | 'name_da']
              : t('game.selectCategory')}
          </Text>
          <MaterialCommunityIcons
            name={dareDropdownOpen ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="#000"
          />
        </Pressable>
        
        {dareDropdownOpen && (
          <View style={styles.dropdownListContainer}>
            <ScrollView 
              style={styles.dropdownList}
              contentContainerStyle={styles.dropdownScrollContent}
              nestedScrollEnabled={true}>
              <Pressable
                key={RANDOM_CATEGORY_ID}
                style={[
                  styles.dropdownItem,
                  selectedDareCategory === RANDOM_CATEGORY_ID && styles.selectedDropdownItem,
                ]}
                onPress={() => {
                  setSelectedDareCategory(RANDOM_CATEGORY_ID);
                  setDareDropdownOpen(false);
                  fetchDareStatements(RANDOM_CATEGORY_ID);
                }}>
                <Text
                  style={[
                    styles.dropdownItemText,
                    selectedDareCategory === RANDOM_CATEGORY_ID && styles.selectedDropdownItemText,
                  ]}>
                  {t('game.randomCategory')}
                </Text>
              </Pressable>
              {dareCategories.map((category) => (
                <Pressable
                  key={category.id}
                  style={[
                    styles.dropdownItem,
                    selectedDareCategory === category.id && styles.selectedDropdownItem,
                  ]}
                  onPress={() => {
                    setSelectedDareCategory(category.id);
                    setDareDropdownOpen(false);
                  }}>
                  <Text
                    style={[
                      styles.dropdownItemText,
                      selectedDareCategory === category.id && styles.selectedDropdownItemText,
                    ]}>
                    {category[`name_${language as Language}` as 'name_en' | 'name_da']}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.scrollContent}
      bounces={true}
      showsVerticalScrollIndicator={true}>
      <Text style={styles.title}>{t('truthOrDare.title')}</Text>
      
      <View style={styles.categorySelectionContainer}>
        {renderTruthDropdown()}
        {renderDareDropdown()}
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          style={[
            styles.truthButton,
            !selectedTruthCategory && styles.disabledButton
          ]}
          onPress={getRandomTruth}
          disabled={!selectedTruthCategory || truthStatements.length === 0}>
          <Text style={styles.buttonText}>{t('truthOrDare.selectTruth')}</Text>
        </Pressable>
        
        <Pressable
          style={[
            styles.dareButton,
            !selectedDareCategory && styles.disabledButton
          ]}
          onPress={getRandomDare}
          disabled={!selectedDareCategory || dareStatements.length === 0}>
          <Text style={styles.buttonText}>{t('truthOrDare.selectDare')}</Text>
        </Pressable>
      </View>
      
      {/* Instructions or current statement */}
      <View style={styles.statementContainer}>
        {currentStatement ? (
          <View style={[
            styles.statementBox, 
            statementType === 'truth' ? styles.truthBox : styles.dareBox
          ]}>
            <Text style={styles.statementTypeText}>
              {statementType === 'truth' ? t('truthOrDare.truth') : t('truthOrDare.dare')}
            </Text>
            <Text style={styles.statementText}>
              {currentStatement[`text_${language as Language}` as 'text_en' | 'text_da']}
            </Text>
          </View>
        ) : (
          <View style={styles.instructionsBox}>
            <Text style={styles.instructionsText}>
              {t('truthOrDare.instructions')}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: '100%',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#000',
  },
  categorySelectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    zIndex: 10,
  },
  dropdownWrapper: {
    flex: 1,
    marginHorizontal: 4,
    zIndex: 1,
  },
  activeDropdownWrapper: {
    zIndex: 20,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
    color: '#333',
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 2,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dropdownText: {
    fontSize: 14,
    color: '#000',
    flex: 1,
  },
  dropdownListContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 30,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginTop: 4,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  dropdownList: {
    maxHeight: 200,
    ...Platform.select({
      web: {
        overflowY: 'auto' as any,
      },
      default: {},
    }),
  },
  dropdownScrollContent: {
    padding: 4,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginVertical: 2,
  },
  selectedDropdownItem: {
    backgroundColor: '#E8E4FF',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#000',
  },
  selectedDropdownItemText: {
    color: '#6C5CE7',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
    zIndex: 1,
  },
  truthButton: {
    flex: 1,
    backgroundColor: '#6C5CE7',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dareButton: {
    flex: 1,
    backgroundColor: '#FF5252',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  statementContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    zIndex: 1,
  },
  statementBox: {
    width: '100%',
    padding: 24,
    borderRadius: 16,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  truthBox: {
    backgroundColor: '#E8E4FF',
    borderWidth: 2,
    borderColor: '#6C5CE7',
  },
  dareBox: {
    backgroundColor: '#FFE8E8',
    borderWidth: 2,
    borderColor: '#FF5252',
  },
  statementTypeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  statementText: {
    fontSize: 22,
    textAlign: 'center',
    color: '#333',
    fontWeight: '500',
  },
  instructionsBox: {
    width: '100%',
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionsText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
  },
});