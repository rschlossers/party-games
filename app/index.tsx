import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useLanguage } from '../utils/i18n';
import { GameSlider } from '../components/GameSlider';
import { FunStuffSlider } from '../components/FunStuffSlider';
import { PartyToolsSlider } from '../components/PartyToolsSlider';

export default function StartDashboard() {
  const { t } = useLanguage();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>{t('dashboard.title')}</Text>
        <Text style={styles.appDescription}>
          {t('dashboard.description')}
        </Text>
      </View>

      {/* Party Games Section */}
      <View style={styles.section}>
        <Link href="/party-games" asChild>
          <Pressable style={styles.sectionHeader}>
            <Image 
              source={require('../assets/images/game-icons/party-games.png')}
              style={styles.sectionIcon}
              resizeMode="contain"
            />
            <View style={styles.sectionTitles}>
              <Text style={styles.sectionTitle}>{t('index.page')}</Text>
              <Text style={styles.sectionDescription}>{t('index.description')}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#666" />
          </Pressable>
        </Link>
        <GameSlider />
      </View>

      {/* Fun Stuff Section */}
      <View style={styles.section}>
        <Link href="/fun-stuff" asChild>
          <Pressable style={styles.sectionHeader}>
            <Image 
              source={require('../assets/images/game-icons/fun-stuff.png')}
              style={styles.sectionIcon}
              resizeMode="contain"
            />
            <View style={styles.sectionTitles}>
              <Text style={styles.sectionTitle}>{t('funStuff.title')}</Text>
              <Text style={styles.sectionDescription}>{t('funStuff.description')}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#666" />
          </Pressable>
        </Link>
        <FunStuffSlider />
      </View>

      {/* Party Tools Section */}
      <View style={styles.section}>
        <Link href="/party-tools" asChild>
          <Pressable style={styles.sectionHeader}>
            <Image 
              source={require('../assets/images/game-icons/party-tools.png')}
              style={styles.sectionIcon}
              resizeMode="contain"
            />
            <View style={styles.sectionTitles}>
              <Text style={styles.sectionTitle}>{t('partyTools.title')}</Text>
              <Text style={styles.sectionDescription}>{t('partyTools.description')}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#666" />
          </Pressable>
        </Link>
        <PartyToolsSlider />
      </View>

      {/* Drinking Games Section */}
      <View style={styles.section}>
        <Link href="/drinking-games" asChild>
          <Pressable style={styles.sectionHeader}>
            <Image 
              source={require('../assets/images/game-icons/drinking-games.png')}
              style={styles.sectionIcon}
              resizeMode="contain"
            />
            <View style={styles.sectionTitles}>
              <Text style={styles.sectionTitle}>{t('drinkingGames.title')}</Text>
              <Text style={styles.sectionDescription}>{t('drinkingGames.description')}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#666" />
          </Pressable>
        </Link>
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
  section: {
    marginBottom: 24,
    backgroundColor: '#F8F8F8',
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
    paddingVertical: 8,
  },
  sectionIcon: {
    width: 48,
    height: 48,
    marginRight: 16,
  },
  sectionTitles: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  sectionDescription: {
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