import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Modal, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../utils/i18n';
import { supabase } from '../utils/supabase';
import debounce from 'lodash/debounce';

interface DrinkingGame {
  id: string;
  game_name: string;
  description: string;
  type: string;
  language: string;
  countries: string[] | null;
  materials: string[] | null;
  introduction_text: string;
  materials_text: string;
  how_to_text: string;
  variations_text: string;
  strategy_and_tips_text: string;
  best_drinks_text: string;
  history_text: string;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: string[];
  selectedOptions: string[];
  onSelect: (options: string[]) => void;
}

function FilterModal({ visible, onClose, title, options, selectedOptions, onSelect }: FilterModalProps) {
  const [search, setSearch] = useState('');
  const [localSelected, setLocalSelected] = useState<string[]>(selectedOptions);
  const { t } = useLanguage();

  useEffect(() => {
    setLocalSelected(selectedOptions);
  }, [visible, selectedOptions]);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  const toggleOption = (option: string) => {
    const newSelection = localSelected.includes(option)
      ? localSelected.filter(item => item !== option)
      : [...localSelected, option];
    setLocalSelected(newSelection);
  };

  const handleApply = () => {
    onSelect(localSelected);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color="#333" />
            </Pressable>
          </View>

          <View style={styles.searchContainer}>
            <MaterialCommunityIcons name="magnify" size={24} color="#666" />
            <TextInput
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
              placeholder={t('drinkingGames.filters.search')}
              placeholderTextColor="#999"
            />
          </View>

          <ScrollView style={styles.optionsList}>
            {filteredOptions.map(option => (
              <Pressable
                key={option}
                style={styles.optionItem}
                onPress={() => toggleOption(option)}>
                <MaterialCommunityIcons
                  name={localSelected.includes(option) ? 'checkbox-marked' : 'checkbox-blank-outline'}
                  size={24}
                  color={localSelected.includes(option) ? '#6C5CE7' : '#666'}
                />
                <Text style={[
                  styles.optionText,
                  localSelected.includes(option) && styles.selectedOptionText
                ]}>
                  {option}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <View style={styles.modalFooter}>
            <Pressable
              style={[styles.footerButton, styles.cancelButton]}
              onPress={onClose}>
              <Text style={styles.footerButtonText}>{t('drinkingGames.filters.cancel')}</Text>
            </Pressable>
            <Pressable
              style={[styles.footerButton, styles.applyButton]}
              onPress={handleApply}>
              <Text style={[styles.footerButtonText, styles.applyButtonText]}>
                {t('drinkingGames.filters.apply', { count: localSelected.length })}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const ITEMS_PER_PAGE = 10;

export default function DrinkingGames() {
  const { t, language } = useLanguage();
  const [games, setGames] = useState<DrinkingGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showTypesModal, setShowTypesModal] = useState(false);
  const [showCountriesModal, setShowCountriesModal] = useState(false);
  const [showMaterialsModal, setShowMaterialsModal] = useState(false);
  
  const [types, setTypes] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [materials, setMaterials] = useState<string[]>([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalGames, setTotalGames] = useState(0);

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
      setCurrentPage(1);
    }, 300),
    []
  );

  const fetchGames = async () => {
    try {
      setIsLoading(true);
      
      // First get total count with filters but no pagination
      let countQuery = supabase
        .from('drinking_games')
        .select('*', { count: 'exact', head: true })
        .eq('language', language);

      if (searchQuery) {
        countQuery = countQuery.or(`game_name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }
      if (selectedTypes.length > 0) {
        countQuery = countQuery.in('type', selectedTypes);
      }
      if (selectedCountries.length > 0) {
        countQuery = countQuery.overlaps('countries', selectedCountries);
      }
      if (selectedMaterials.length > 0) {
        countQuery = countQuery.contains('materials', selectedMaterials);
      }

      const { count: totalCount } = await countQuery;
      setTotalGames(totalCount || 0);
      
      // Then fetch paginated data
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      // Start building the query
      let query = supabase
        .from('drinking_games')
        .select('*', { count: 'exact' })
        .eq('language', language);

      // Apply search filter if exists
      if (searchQuery) {
        query = query.or(`game_name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      // Apply type filter
      if (selectedTypes.length > 0) {
        query = query.in('type', selectedTypes);
      }

      // Apply country filter
      if (selectedCountries.length > 0) {
        query = query.overlaps('countries', selectedCountries);
      }

      // Apply materials filter
      if (selectedMaterials.length > 0) {
        query = query.contains('materials', selectedMaterials);
      }

      // Apply pagination
      query = query.range(start, end);

      const { data, error, count } = await query;

      if (error) throw error;
      setGames(data || []);
      setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));
    } catch (err) {
      console.error('Error fetching games:', err);
      setError(t('drinkingGames.fetchError'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [language, currentPage, searchQuery, selectedTypes, selectedCountries, selectedMaterials]);

  useEffect(() => {
    fetchFilterOptions();
  }, [language]);

  const fetchFilterOptions = async () => {
    try {
      const { data: typeData } = await supabase
        .from('drinking_games')
        .select('type')
        .eq('language', language);
      
      const { data: countryData } = await supabase
        .from('drinking_games')
        .select('countries')
        .eq('language', language);
      
      const { data: materialData } = await supabase
        .from('drinking_games')
        .select('materials')
        .eq('language', language);

      if (typeData) {
        const uniqueTypes = Array.from(new Set(typeData.map(item => item.type))).filter(Boolean);
        setTypes(uniqueTypes);
      }

      if (countryData) {
        const uniqueCountries = Array.from(
          new Set(countryData.flatMap(item => item.countries || []))
        ).filter(Boolean);
        setCountries(uniqueCountries);
      }

      if (materialData) {
        const uniqueMaterials = Array.from(
          new Set(materialData.flatMap(item => item.materials || []))
        ).filter(Boolean);
        setMaterials(uniqueMaterials);
      }
    } catch (err) {
      console.error('Error fetching filter options:', err);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTypes([]);
    setSelectedCountries([]);
    setSelectedMaterials([]);
    setCurrentPage(1);
  };

  const loadMoreGames = async () => {
    if (currentPage < totalPages && !isLoadingMore) {
      setIsLoadingMore(true);
      setCurrentPage(prev => prev + 1);
      await fetchGames();
      setIsLoadingMore(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{t('drinkingGames.title')}</Text>
        <Text style={styles.description}>
          {t('drinkingGames.description')} • {totalGames} {t('drinkingGames.gamesAvailable')}
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={24} color="#666" />
        <TextInput
          style={styles.searchInput}
          onChangeText={debouncedSearch}
          defaultValue={searchQuery}
          placeholder={t('drinkingGames.searchPlaceholder')}
          placeholderTextColor="#999"
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      <Pressable 
        style={styles.filtersToggle}
        onPress={() => setShowFilters(!showFilters)}>
        <Text style={styles.filtersToggleText}>
          {t('drinkingGames.filters')}
          {(selectedTypes.length > 0 || selectedCountries.length > 0 || selectedMaterials.length > 0) && ' (Active)'}
        </Text>
        <MaterialCommunityIcons
          name={showFilters ? 'chevron-up' : 'chevron-down'}
          size={24}
          color="#666"
        />
      </Pressable>

      {showFilters && (
        <View style={styles.filtersSection}>
          <View style={styles.filtersHeader}>
            {(selectedTypes.length > 0 || selectedCountries.length > 0 || selectedMaterials.length > 0) && (
              <Pressable style={styles.clearButton} onPress={clearFilters}>
                <Text style={styles.clearButtonText}>{t('drinkingGames.clearFilters')}</Text>
              </Pressable>
            )}
          </View>

          <View style={styles.filterGroups}>
            <View style={styles.filterGroup}>
              <Text style={styles.filterGroupLabel}>{t('drinkingGames.type')}</Text>
              <Pressable
                style={styles.filterButton}
                onPress={() => setShowTypesModal(true)}>
                <Text style={styles.filterButtonText}>
                  {selectedTypes.length > 0
                    ? t('drinkingGames.filters.selected', { count: selectedTypes.length })
                    : t('drinkingGames.filters.selectTypes')}
                </Text>
                <MaterialCommunityIcons name="chevron-right" size={20} color="#666" />
              </Pressable>
            </View>

            <View style={styles.filterGroup}>
              <Text style={styles.filterGroupLabel}>{t('drinkingGames.country')}</Text>
              <Pressable
                style={styles.filterButton}
                onPress={() => setShowCountriesModal(true)}>
                <Text style={styles.filterButtonText}>
                  {selectedCountries.length > 0
                    ? t('drinkingGames.filters.selected', { count: selectedCountries.length })
                    : t('drinkingGames.filters.selectCountries')}
                </Text>
                <MaterialCommunityIcons name="chevron-right" size={20} color="#666" />
              </Pressable>
            </View>

            <View style={styles.filterGroup}>
              <Text style={styles.filterGroupLabel}>{t('drinkingGames.materials')}</Text>
              <Pressable
                style={styles.filterButton}
                onPress={() => setShowMaterialsModal(true)}>
                <Text style={styles.filterButtonText}>
                  {selectedMaterials.length > 0
                    ? t('drinkingGames.filters.selected', { count: selectedMaterials.length })
                    : t('drinkingGames.filters.selectMaterials')}
                </Text>
                <MaterialCommunityIcons name="chevron-right" size={20} color="#666" />
              </Pressable>
            </View>
          </View>
        </View>
      )}

      <FilterModal
        visible={showTypesModal}
        onClose={() => setShowTypesModal(false)}
        title={t('drinkingGames.type')}
        options={types}
        selectedOptions={selectedTypes}
        onSelect={setSelectedTypes}
      />

      <FilterModal
        visible={showCountriesModal}
        onClose={() => setShowCountriesModal(false)}
        title={t('drinkingGames.country')}
        options={countries}
        selectedOptions={selectedCountries}
        onSelect={setSelectedCountries}
      />

      <FilterModal
        visible={showMaterialsModal}
        onClose={() => setShowMaterialsModal(false)}
        title={t('drinkingGames.materials')}
        options={materials}
        selectedOptions={selectedMaterials}
        onSelect={setSelectedMaterials}
      />

      {isLoading && currentPage === 1 ? (
        <Text style={styles.loadingText}>{t('drinkingGames.loading')}</Text>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <>
          <View style={styles.gamesGrid}>
            {games.map(game => (
              <Link 
                key={game.id} 
                href={`/drinking-game/${game.id}`}
                asChild>
                <Pressable style={styles.gameCard}>
                  <View style={styles.gameContent}>
                    <Text style={styles.gameType}>{game.type}</Text>
                    <Text style={styles.gameName}>{game.game_name}</Text>
                    <Text style={styles.gameDescription} numberOfLines={2}>
                      {game.description}
                    </Text>
                    {game.materials && (
                      <View style={styles.materialsContainer}>
                        <Text style={styles.materialsTitle}>
                          {t('drinkingGames.materials')}:
                        </Text>
                        <Text style={styles.materials}>
                          {game.materials.join(', ')}
                        </Text>
                      </View>
                    )}
                  </View>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={24}
                    color="#6C5CE7"
                    style={styles.cardIcon}
                  />
                </Pressable>
              </Link>
            ))}
          </View>

          {games.length === 0 && !isLoading && (
            <Text style={styles.noGamesText}>{t('drinkingGames.noGamesFound')}</Text>
          )}

          <View style={styles.paginationContainer}>
            <Pressable
              style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
              onPress={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}>
              <MaterialCommunityIcons name="chevron-left" size={24} color={currentPage === 1 ? "#999" : "#6C5CE7"} />
              <Text style={[styles.paginationButtonText, currentPage === 1 && styles.disabledButtonText]}>
                {t('drinkingGames.pagination.previous')}
              </Text>
            </Pressable>

            <View style={styles.paginationInfo}>
              <Text style={styles.paginationText}>
                {`${currentPage} / ${totalPages}`}
              </Text>
            </View>

            <Pressable
              style={[styles.paginationButton, currentPage === totalPages && styles.disabledButton]}
              onPress={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}>
              <Text style={[styles.paginationButtonText, currentPage === totalPages && styles.disabledButtonText]}>
                {t('drinkingGames.pagination.next')}
              </Text>
              <MaterialCommunityIcons name="chevron-right" size={24} color={currentPage === totalPages ? "#999" : "#6C5CE7"} />
            </Pressable>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    backgroundColor: '#F8F8F8',
    padding: 20,
    marginBottom: 20,
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
    paddingHorizontal: 16,
  },
  inputContainer: {
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
    marginRight: 8,
    padding: 0,
    height: 24,
    backgroundColor: 'transparent'
  },
  filtersToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    marginBottom: 16,
  },
  filtersToggleText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  filtersSection: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    color: '#6C5CE7',
    fontSize: 14,
  },
  filterGroups: {
    gap: 24,
  },
  filterGroup: {
    gap: 8,
  },
  filterGroupLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeFilterChip: {
    backgroundColor: '#6C5CE7',
    borderColor: '#6C5CE7',
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterChipText: {
    color: '#FFFFFF',
  },
  gamesGrid: {
    gap: 16,
  },
  gameCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  gameContent: {
    flex: 1,
  },
  gameType: {
    fontSize: 12,
    color: '#6C5CE7',
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 4,
  },
  gameName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  gameDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  materialsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 4,
  },
  materialsTitle: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  materials: {
    fontSize: 12,
    color: '#666',
  },
  cardIcon: {
    marginLeft: 16,
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 32,
  },
  errorText: {
    textAlign: 'center',
    color: '#FF3B30',
    fontSize: 16,
    marginTop: 32,
  },
  filterButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#333',
  },
  loadingMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  loadingMoreText: {
    color: '#666',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  optionsList: {
    padding: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  selectedOptionText: {
    color: '#6C5CE7',
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 12,
  },
  footerButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
  },
  applyButton: {
    backgroundColor: '#6C5CE7',
  },
  footerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  applyButtonText: {
    color: '#FFFFFF',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  paginationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0EEFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 4,
  },
  paginationButtonText: {
    color: '#6C5CE7',
    fontSize: 16,
    fontWeight: '500',
  },
  disabledButton: {
    backgroundColor: '#F5F5F5',
  },
  disabledButtonText: {
    color: '#999',
  },
  paginationInfo: {
    backgroundColor: '#F8F8F8',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  paginationText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  noGamesText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 32,
    marginBottom: 32,
  },
});