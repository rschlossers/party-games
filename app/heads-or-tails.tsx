import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../utils/i18n';

export default function HeadsOrTails() {
  const { t } = useLanguage();
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  
  const flipCoin = () => {
    if (isFlipping) return;
    
    setIsFlipping(true);
    
    // First clear any existing result
    setResult(null);
    
    // Wait a moment before showing the result
    setTimeout(() => {
      // Generate a truly random result
      const randomValue = Math.random();
      const finalResult = randomValue < 0.5 ? 'heads' : 'tails';
      
      // Set the final result
      setResult(finalResult);
      setIsFlipping(false);
    }, 600);
  };

  return (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      bounces={true}
      showsVerticalScrollIndicator={true}>
      <View style={styles.container}>
        <Text style={styles.title}>{t('headsOrTails.title')}</Text>
        <Text style={styles.description}>{t('headsOrTails.description')}</Text>
        
        <View style={styles.coinContainer}>
          {result === null && !isFlipping && (
            <View style={styles.initialCoin}>
              <Text style={styles.initialText}>{t('headsOrTails.tapToFlip')}</Text>
            </View>
          )}
          
          {isFlipping && (
            <View style={styles.spinningCoin}>
              <Text style={styles.spinningText}>...</Text>
            </View>
          )}
          
          {result === 'heads' && !isFlipping && (
            <View style={styles.headsCoin}>
              <Text style={styles.coinSideText}>{t('headsOrTails.heads')}</Text>
            </View>
          )}
          
          {result === 'tails' && !isFlipping && (
            <View style={styles.tailsCoin}>
              <Text style={styles.coinSideText}>{t('headsOrTails.tails')}</Text>
            </View>
          )}
        </View>

        {result && !isFlipping && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>
              {t(`headsOrTails.${result}`)}
            </Text>
          </View>
        )}

        <Pressable
          style={[styles.flipButton, isFlipping && styles.disabledButton]}
          onPress={flipCoin}
          disabled={isFlipping}>
          <Text style={styles.flipButtonText}>
            {t('headsOrTails.flipCoin')}
          </Text>
        </Pressable>

        <View style={styles.factContainer}>
          <Text style={styles.factTitle}>{t('headsOrTails.funFact.title')}</Text>
          <Text style={styles.factText}>{t('headsOrTails.funFact.text')}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: '100%',
    alignItems: 'center',
    paddingVertical: 20,
  },
  container: {
    width: '100%',
    maxWidth: 800,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  coinContainer: {
    width: '100%',
    aspectRatio: 1,
    maxWidth: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  initialCoin: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: '50%',
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 6,
    borderColor: '#B8860B',
    padding: 20,
  },
  initialText: {
    fontSize: 16,
    color: '#6C5CE7',
    textAlign: 'center',
  },
  spinningCoin: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: '50%',
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 6,
    borderColor: '#B8860B',
  },
  spinningText: {
    fontSize: 24,
    color: '#6C5CE7',
  },
  headsCoin: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: '50%',
    backgroundColor: '#FFD700', // Gold color for heads
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 6,
    borderColor: '#B8860B',
  },
  tailsCoin: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: '50%',
    backgroundColor: '#DAA520', // Darker gold for tails
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 6,
    borderColor: '#B8860B',
  },
  coinSideText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  resultContainer: {
    backgroundColor: '#F0EEFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 50,
    marginBottom: 20,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
  flipButton: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 50,
    marginBottom: 30,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    minWidth: 200,
  },
  disabledButton: {
    opacity: 0.7,
  },
  flipButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  factContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    maxWidth: 600,
  },
  factTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  factText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});