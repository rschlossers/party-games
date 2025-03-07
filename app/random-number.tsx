import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../utils/i18n';

export default function RandomNumber() {
  const { t } = useLanguage();
  const [number, setNumber] = useState<number | null>(null);
  const [animation, setAnimation] = useState(false);
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('10');
  const [isCustomRange, setIsCustomRange] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateRandomNumber = () => {
    // Validate input
    const minNum = parseInt(min);
    const maxNum = parseInt(max);
    
    if (isNaN(minNum) || isNaN(maxNum)) {
      setError(t('randomNumber.invalidRange'));
      return;
    }
    
    if (maxNum <= minNum) {
      setError(t('randomNumber.invalidRange'));
      return;
    }

    setError(null);
    
    // Start animation
    setAnimation(true);
    
    // Generate random numbers with a delay to create animation effect
    let counter = 0;
    const maxIterations = 15; // Number of "flickers" before settling on final number
    const interval = setInterval(() => {
      const randomNum = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
      setNumber(randomNum);
      
      counter++;
      if (counter >= maxIterations) {
        clearInterval(interval);
        setAnimation(false);
      }
    }, 80); // Speed of animation
  };

  const toggleRange = () => {
    setIsCustomRange(!isCustomRange);
    if (!isCustomRange) {
      setMin('1');
      setMax('10');
    }
  };

  return (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      bounces={true}
      showsVerticalScrollIndicator={true}>
      <View style={styles.container}>
        <Text style={styles.title}>{t('randomNumber.title')}</Text>
        <Text style={styles.description}>{t('randomNumber.description')}</Text>
      
        <View style={styles.numberContainer}>
          {number !== null ? (
            <Text style={[styles.number, animation && styles.animatingNumber]}>
              {number}
            </Text>
          ) : (
            <View style={styles.placeholderNumber}>
              <MaterialCommunityIcons name="numeric" size={80} color="#6C5CE7" />
            </View>
          )}
        </View>

        <Pressable
          style={styles.rangeToggle}
          onPress={toggleRange}>
          <Text style={styles.rangeToggleText}>
            {isCustomRange ? t('randomNumber.defaultRange') : t('randomNumber.customRange')}
          </Text>
        </Pressable>
      
        {isCustomRange && (
          <View style={styles.rangeInputs}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{t('randomNumber.minLabel')}</Text>
              <TextInput
                style={styles.input}
                value={min}
                onChangeText={setMin}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{t('randomNumber.maxLabel')}</Text>
              <TextInput
                style={styles.input}
                value={max}
                onChangeText={setMax}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>
          </View>
        )}
      
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
      
        <Pressable
          style={styles.generateButton}
          onPress={generateRandomNumber}>
          <Text style={styles.generateButtonText}>
            {t('randomNumber.generate')}
          </Text>
        </Pressable>
      
        {number !== null && (
          <Text style={styles.infoText}>
            {t('randomNumber.result')}
          </Text>
        )}
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
    paddingVertical: 20,
  },
  container: {
    width: '100%',
    maxWidth: 800,
    marginHorizontal: 'auto',
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
  numberContainer: {
    width: 150,
    aspectRatio: 1,
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
  number: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
  animatingNumber: {
    opacity: 0.7,
  },
  placeholderNumber: {
    opacity: 0.5,
  },
  rangeToggle: {
    marginBottom: 20,
    padding: 10,
  },
  rangeToggleText: {
    color: '#6C5CE7',
    fontSize: 16,
    fontWeight: '600',
  },
  rangeInputs: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 24,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  inputContainer: {
    flex: 1,
    minWidth: 120,
    maxWidth: 200,
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#6C5CE7',
    borderRadius: 8,
    padding: 8,
    textAlign: 'center',
    fontSize: 16,
  },
  generateButton: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 50,
    marginBottom: 20,
    minWidth: 200,
    alignItems: 'center',
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
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    width: '100%',
    maxWidth: 400,
    textAlign: 'center',
    marginTop: 10,
  }
});