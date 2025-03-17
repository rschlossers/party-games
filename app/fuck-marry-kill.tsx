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

interface Choice {
  id: string;
  choice: 'fuck' | 'marry' | 'kill' | null;
}

export default function FuckMarryKill() {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<Category['id'] | null>(null);
  const [selectedGender, setSelectedGender] = useState<Gender['id'] | 'mixed' | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<'gender' | 'category' | null>(null);
  const [genders, setGenders] = useState<Gender[]>([]);
  const [statements, setStatements] = useState<Statement[]>([]);
  const [currentRound, setCurrentRound] = useState<Statement[]>([]);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchGenders();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('fuck_marry_kill_categories')
        .select('*');
      
      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(t('game.fetchError'));
    }
  };

  const fetchGenders = async () => {
    try {
      const { data, error } = await supabase
        .from('fuck_marry_kill_genders')
        .select('*');
      
      if (error) throw error;
      setGenders(data || []);
    } catch (err) {
      console.error('Error fetching genders:', err);
      setError(t('game.fetchError')); 
    } finally {
      setIsLoading(false);
    }
  };

  const startGame = async () => {
    if (!selectedCategory || !selectedGender) return;
    
    try {
      setIsLoading(true);
      let query = supabase.from('fuck_marry_kill_statements').select('*');
      
      // Apply filters
      if (selectedCategory !== 'random') {
        query = query.eq('category_id', selectedCategory);
      }
      if (selectedGender !== 'mixed') {
        query = query.eq('gender_id', selectedGender);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Shuffle statements
      const shuffled = [...(data || [])].sort(() => Math.random() - 0.5);
      setStatements(shuffled);
      
      // Set first round
      if (shuffled.length >= 3) {
        const firstRound = shuffled.slice(0, 3);
        setCurrentRound(firstRound);
        setChoices(firstRound.map(s => ({ id: s.id, choice: null })));
        setGameStarted(true);
      } else {
        setError(t('fuckMarryKill.notEnoughStatements'));
      }
    } catch (err) {
      console.error('Error starting game:', err);
      setError(t('game.fetchError'));
    } finally {
      setIsLoading(false);
    }
  };

  const makeChoice = (statementId: string, choice: 'fuck' | 'marry' | 'kill') => {
    setChoices(prev => {
      const newChoices = [...prev];
      const choiceIndex = newChoices.findIndex(c => c.id === statementId);
      const currentChoice = newChoices[choiceIndex].choice;
      
      // If clicking the same choice, uncheck it
      if (currentChoice === choice) {
        newChoices[choiceIndex].choice = null;
      } else {
        // Remove the choice from other statements if already used
        const existingChoiceIndex = newChoices.findIndex(c => c.choice === choice);
        if (existingChoiceIndex !== -1) {
          newChoices[existingChoiceIndex].choice = null;
        }
        
        // Set the new choice
        newChoices[choiceIndex].choice = choice;
      }
      
      if (choiceIndex !== -1) {
        // Keep the choice state
      }
      
      return newChoices;
    });
  };

  const nextRound = () => {
    const currentIndex = statements.indexOf(currentRound[2]);
    if (currentIndex < statements.length - 3) {
      const nextThree = statements.slice(currentIndex + 1, currentIndex + 4);
      setCurrentRound(nextThree);
      setChoices(nextThree.map(s => ({ id: s.id, choice: null })));
    } else {
      // Reshuffle and start over
      const shuffled = [...statements].sort(() => Math.random() - 0.5);
      setStatements(shuffled);
      setCurrentRound(shuffled.slice(0, 3));
      setChoices(shuffled.slice(0, 3).map(s => ({ id: s.id, choice: null })));
    }
  };

  const isChoiceDisabled = (choice: 'fuck' | 'marry' | 'kill') => {
    return choices.some(c => c.choice === choice);
  };

  const areAllChoicesMade = () => {
    return choices.every(c => c.choice !== null);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6C5CE7" />
      </View>
    );
  }

  if (!gameStarted) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>{t('fuckMarryKill.title')}</Text>
          <Text style={styles.description}>{t('fuckMarryKill.description')}</Text>

          {/* Gender Selection */}
          <View style={[styles.dropdownContainer, dropdownOpen === 'gender' && styles.activeDropdown]}>
            <Pressable
              style={styles.dropdown}
              onPress={() => setDropdownOpen(dropdownOpen === 'gender' ? null : 'gender')}>
              <Text style={styles.dropdownText}>
                {selectedGender === 'mixed'
                  ? t('fuckMarryKill.allGenders')
                  : selectedGender
                    ? genders.find(g => g.id === selectedGender)?.[`name_${language}` as keyof typeof genders[0]]
                    : t('fuckMarryKill.selectGender')}
              </Text>
              <MaterialCommunityIcons
                name={dropdownOpen === 'gender' ? 'chevron-up' : 'chevron-down'}
                size={24}
                color="#000"
              />
            </Pressable>
            
            {dropdownOpen === 'gender' && (
              <View style={styles.dropdownList}>
                <Pressable
                  style={[styles.dropdownItem, selectedGender === 'mixed' && styles.selectedDropdownItem]}
                  onPress={() => {
                    setSelectedGender('mixed');
                    setDropdownOpen(null);
                  }}>
                  <Text style={[styles.dropdownItemText, selectedGender === 'mixed' && styles.selectedDropdownItemText]}>
                    {t('fuckMarryKill.mixed')}
                  </Text>
                </Pressable>
                {genders.map(gender => (
                  <Pressable
                    key={gender.id}
                    style={[styles.dropdownItem, selectedGender === gender.id && styles.selectedDropdownItem]}
                    onPress={() => {
                      setSelectedGender(gender.id);
                      setDropdownOpen(null);
                    }}>
                    <Text style={[styles.dropdownItemText, selectedGender === gender.id && styles.selectedDropdownItemText]}>
                      {gender[`name_${language}` as keyof typeof gender]}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* Category Selection */}
          <View style={[styles.dropdownContainer, dropdownOpen === 'category' && styles.activeDropdown]}>
            <Pressable
              style={styles.dropdown}
              onPress={() => setDropdownOpen(dropdownOpen === 'category' ? null : 'category')}>
              <Text style={styles.dropdownText}>
                {selectedCategory === 'random'
                  ? t('game.randomCategory')
                  : selectedCategory
                    ? categories.find(c => c.id === selectedCategory)?.[`name_${language}` as keyof typeof categories[0]]
                    : t('fuckMarryKill.selectCategory')}
              </Text>
              <MaterialCommunityIcons
                name={dropdownOpen === 'category' ? 'chevron-up' : 'chevron-down'}
                size={24}
                color="#000"
              />
            </Pressable>
            
            {dropdownOpen === 'category' && (
              <View style={styles.dropdownList}>
                <Pressable
                  style={[styles.dropdownItem, selectedCategory === 'random' && styles.selectedDropdownItem]}
                  onPress={() => {
                    setSelectedCategory('random');
                    setDropdownOpen(null);
                  }}>
                  <Text style={[styles.dropdownItemText, selectedCategory === 'random' && styles.selectedDropdownItemText]}>
                    {t('game.randomCategory')}
                  </Text>
                </Pressable>
                {categories.map(category => (
                  <Pressable
                    key={category.id}
                    style={[styles.dropdownItem, selectedCategory === category.id && styles.selectedDropdownItem]}
                    onPress={() => {
                      setSelectedCategory(category.id);
                      setDropdownOpen(null);
                    }}>
                    <Text style={[styles.dropdownItemText, selectedCategory === category.id && styles.selectedDropdownItemText]}>
                      {category[`name_${language}` as keyof typeof category]}
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
            (!selectedCategory || !selectedGender) && styles.disabledButton
          ]}
          onPress={startGame}
          disabled={!selectedCategory || !selectedGender}>
          <Text style={styles.startButtonText}>{t('fuckMarryKill.getOptions')}</Text>
        </Pressable>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.gameHeader}>
        <Pressable
          style={styles.backButton}
          onPress={() => {
            setGameStarted(false);
            setSelectedCategory(null);
            setSelectedGender(null);
            setCurrentRound([]);
            setChoices([]);
          }}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
          <Text style={styles.backButtonText}>{t('game.back')}</Text>
        </Pressable>
        <Text style={styles.roundTitle}>{t('fuckMarryKill.makeYourChoices')}</Text>
      </View>

      <View style={styles.gameContent}>
        {currentRound.map((statement, index) => (
          <View key={statement.id} style={styles.optionCard}>
            <Text style={styles.optionText}>
              {statement[`text_${language}` as keyof typeof statement]}
            </Text>
            <View style={styles.choiceButtons}>
              <Pressable
                style={[
                  styles.choiceButton,
                  styles.fuckButton,
                  choices.find(c => c.id === statement.id)?.choice === 'fuck' && styles.selectedChoice,
                  isChoiceDisabled('fuck') && 
                  choices.find(c => c.id === statement.id)?.choice !== 'fuck' && 
                  styles.disabledChoice
                ]}
                onPress={() => makeChoice(statement.id, 'fuck')}
                disabled={isChoiceDisabled('fuck') && choices.find(c => c.id === statement.id)?.choice !== 'fuck'}>
                <Text style={styles.choiceButtonText}>{t('fuckMarryKill.fuck')}</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.choiceButton,
                  styles.marryButton,
                  choices.find(c => c.id === statement.id)?.choice === 'marry' && styles.selectedChoice,
                  isChoiceDisabled('marry') && 
                  choices.find(c => c.id === statement.id)?.choice !== 'marry' && 
                  styles.disabledChoice
                ]}
                onPress={() => makeChoice(statement.id, 'marry')}
                disabled={isChoiceDisabled('marry') && choices.find(c => c.id === statement.id)?.choice !== 'marry'}>
                <Text style={styles.choiceButtonText}>{t('fuckMarryKill.marry')}</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.choiceButton,
                  styles.killButton,
                  choices.find(c => c.id === statement.id)?.choice === 'kill' && styles.selectedChoice,
                  isChoiceDisabled('kill') && 
                  choices.find(c => c.id === statement.id)?.choice !== 'kill' && 
                  styles.disabledChoice
                ]}
                onPress={() => makeChoice(statement.id, 'kill')}
                disabled={isChoiceDisabled('kill') && choices.find(c => c.id === statement.id)?.choice !== 'kill'}>
                <Text style={styles.choiceButtonText}>{t('fuckMarryKill.kill')}</Text>
              </Pressable>
            </View>
          </View>
        ))}

        <Pressable
          style={[styles.nextButton, !areAllChoicesMade() && styles.disabledButton]}
          onPress={nextRound}
          disabled={!areAllChoicesMade()}>
          <Text style={styles.nextButtonText}>{t('fuckMarryKill.nextOptions')}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 16,
    position: 'relative',
    zIndex: 1,
  },
  title: {
    fontSize: 32,
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
  },
  dropdownContainer: {
    position: 'relative',
    marginBottom: 16,
    zIndex: 3,
  },
  activeDropdown: {
    zIndex: 4,
  },
  dropdown: {
    backgroundColor: '#F8F8F8', 
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'space-between'
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 4,
    maxHeight: 200,
    overflow: 'scroll',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 999,
  },
  dropdownItem: {
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
    marginVertical: 4,
  },
  selectedDropdownItem: {
    backgroundColor: '#6C5CE7',
  },
  dropdownText: {
    fontSize: 16,
    color: '#000',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#000',
  },
  selectedDropdownItemText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 40,
    marginBottom: 40,
    position: 'relative',
    zIndex: 0,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
  },
  gameHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  roundTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  gameContent: {
    padding: 20,
  },
  optionCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  optionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  choiceButtons: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'space-between',
  },
  choiceButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  fuckButton: {
    backgroundColor: '#FF9500',
  },
  marryButton: {
    backgroundColor: '#34C759',
  },
  killButton: {
    backgroundColor: '#FF3B30',
  },
  selectedChoice: {
    opacity: 1,
    transform: [{ scale: 1.05 }],
  },
  disabledChoice: {
    opacity: 0.5,
  },
  choiceButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});