import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../utils/i18n';
import { supabase } from '../utils/supabase';

export default function Settings() {
  const { language: currentLanguage, setLanguage, t } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [languages, setLanguages] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all available languages from the database
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('languages')
          .select('id, name')
          .order('name');
        
        if (error) throw error;
        setLanguages(data || []);
      } catch (err) {
        setError('Failed to load languages');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C5CE7" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {t('settings.title')}
      </Text>
      
      {/* Language Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t('settings.language')}
        </Text>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setIsDropdownOpen(!isDropdownOpen)}
            activeOpacity={0.7}>
            <Text style={styles.dropdownButtonText}>
              {languages.find(lang => lang.id === currentLanguage)?.name || 'Select Language'}
            </Text>
            <MaterialCommunityIcons
              name={isDropdownOpen ? 'chevron-up' : 'chevron-down'}
              size={24}
              color="#000"
            />
          </TouchableOpacity>
          
          {isDropdownOpen && (
            <View style={styles.dropdownListContainer}>
              <ScrollView 
                style={styles.dropdownList}
                contentContainerStyle={styles.dropdownScrollContent}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}>
                {languages.map((lang) => (
                  <TouchableOpacity
                    key={lang.id}
                    style={[
                      styles.dropdownItem,
                      currentLanguage === lang.id && styles.activeDropdownItem,
                    ]}
                    onPress={() => {
                      setLanguage(lang.id);
                      setIsDropdownOpen(false);
                    }}>
                    <Text
                      style={[
                        styles.dropdownItemText,
                        currentLanguage === lang.id && styles.activeDropdownItemText,
                      ]}>
                      {lang.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#000',
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#000',
    textAlign: 'center',
  },
  dropdownContainer: {
    position: 'relative',
    marginTop: 12,
    zIndex: 10,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  dropdownListContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 999,
  },
  dropdownList: {
    maxHeight: 300,
  },
  dropdownScrollContent: {
    padding: 8,
  },
  dropdownItem: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 4,
  },
  activeDropdownItem: {
    backgroundColor: '#6C5CE7',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#000',
  },
  activeDropdownItemText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});