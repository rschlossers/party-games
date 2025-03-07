import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../utils/i18n';
import { Link } from 'expo-router';

export default function StartDashboard() {
  const { t } = useLanguage();

  const categories = [
    {
      id: 'party-games',
      title: t('index.page'),
      description: t('index.description'),
      icon: 'cards-playing-outline',
      color: '#6C5CE7',
      route: '/party-games'
    },
    {
      id: 'drinking-games',
      title: t('drinkingGames.title'),
      description: t('drinkingGames.description'),
      icon: 'glass-mug-variant',
      color: '#FF5252',
      route: '/drinking-games'
    },
    {
      id: 'fun-stuff',
      title: t('funStuff.title'),
      description: t('funStuff.description'),
      icon: 'party-popper',
      color: '#FF9800',
      route: '/fun-stuff'
    },
    {
      id: 'party-tools',
      title: t('partyTools.title'),
      description: t('partyTools.description'),
      icon: 'toolbox-outline',
      color: '#00B894',
      route: '/party-tools'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>{t('dashboard.title')}</Text>
        <Text style={styles.appDescription}>
          {t('dashboard.description')}
        </Text>
      </View>
      
      <View style={styles.categoryList}>
        {categories.map(category => (
          <Link key={category.id} href={category.route} asChild>
            <Pressable style={styles.categoryCard}>
              <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
                <MaterialCommunityIcons
                  name={category.icon as any}
                  size={36}
                  color="#FFF"
                />
              </View>
              <View style={styles.categoryContent}>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.categoryDescription}>{category.description}</Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={category.color}
              />
            </Pressable>
          </Link>
        ))}
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>{t('dashboard.footer')}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  appDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    maxWidth: 300,
  },
  categoryList: {
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 32,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryContent: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
  }
});