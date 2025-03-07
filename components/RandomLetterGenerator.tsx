import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../utils/i18n';

export default function RandomLetterGenerator() {
  const { t, language } = useLanguage();
  const [letter, setLetter] = useState<string | null>(null);
  const [animation, setAnimation] = useState(false);

  // Define different letter sets based on language
  const getLetterSet = (): string[] => {
    // Base alphabet (A-Z)
    const baseAlphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
    
    // Add special characters for Nordic languages
    if (['da', 'no', 'sv'].includes(language)) {
      return [...baseAlphabet, 'Æ', 'Ø', 'Å'];
    }
    
    return baseAlphabet;
  };

  const generateRandomLetter = () => {
    // Start animation
    setAnimation(true);
    
    // Get the appropriate letter set
    const letterSet = getLetterSet();
    
    // Generate random letters with a delay to create animation effect
    let counter = 0;
    const maxIterations = 15; // Number of "flickers" before settling on final letter
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * letterSet.length);
      setLetter(letterSet[randomIndex]);
      
      counter++;
      if (counter >= maxIterations) {
        clearInterval(interval);
        setAnimation(false);
      }
    }, 80); // Speed of animation
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('randomLetter.title')}</Text>
      <Text style={styles.description}>{t('randomLetter.description')}</Text>
      
      <View style={styles.letterContainer}>
        {letter ? (
          <Text style={[styles.letter, animation && styles.animatingLetter]}>
            {letter}
          </Text>
        ) : (
          <View style={styles.placeholderLetter}>
            <MaterialCommunityIcons name="alpha-a-box-outline" size={80} color="#6C5CE7" />
          </View>
        )}
      </View>
      
      <Pressable
        style={styles.generateButton}
        onPress={generateRandomLetter}>
        <Text style={styles.generateButtonText}>
          {t('randomLetter.generate')}
        </Text>
      </Pressable>
      
      <Text style={styles.infoText}>
        {language === 'da' && letter ? t('randomLetter.resultDanish') : 
         language === 'sv' && letter ? t('randomLetter.resultSwedish') : 
         language === 'no' && letter ? t('randomLetter.resultNorwegian') : 
         letter ? t('randomLetter.result') : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
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
  },
  letterContainer: {
    width: 150,
    height: 150,
    backgroundColor: '#F0EEFF',
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  letter: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
  animatingLetter: {
    opacity: 0.7,
  },
  placeholderLetter: {
    opacity: 0.5,
  },
  generateButton: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    marginBottom: 20,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  }
});