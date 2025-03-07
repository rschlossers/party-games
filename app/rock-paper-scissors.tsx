import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Switch, ScrollView, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../utils/i18n';

// Define types for choices
type StandardChoice = 'rock' | 'paper' | 'scissors';
type ExtendedChoice = StandardChoice | 'lizard' | 'spock';
type GameChoice = StandardChoice | ExtendedChoice;
type GameMode = 'standard' | 'extended';

// Map choices to image paths
const choiceImages: Record<GameChoice, any> = {
  rock: require('../assets/images/rock-paper-scissor/rock.png'),
  paper: require('../assets/images/rock-paper-scissor/paper.png'),
  scissors: require('../assets/images/rock-paper-scissor/scissor.png'),
  lizard: require('../assets/images/rock-paper-scissor/lizard.png'),
  spock: require('../assets/images/rock-paper-scissor/spock.png'),
};

export default function RockPaperScissors() {
  const { t } = useLanguage();
  const [gameMode, setGameMode] = useState<GameMode>('standard');
  const [result, setResult] = useState<GameChoice | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  
  // Animation refs
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Get available choices based on game mode
  const getChoices = (): GameChoice[] => {
    return gameMode === 'standard' 
      ? ['rock', 'paper', 'scissors'] 
      : ['rock', 'paper', 'scissors', 'lizard', 'spock'];
  };
  
  // Generate random choice
  const generateRandomChoice = () => {
    // Start animation
    setIsRolling(true);
    
    // Reset animations
    rotateAnim.setValue(0);
    scaleAnim.setValue(0.8);
    
    // Create animation sequence
    Animated.sequence([
      Animated.parallel([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setIsRolling(false);
    });
    
    // Get random choice from available choices
    const choices = getChoices();
    const randomIndex = Math.floor(Math.random() * choices.length);
    setResult(choices[randomIndex]);
  };
  
  // Reset the selection
  const resetSelection = () => {
    setResult(null);
  };

  // Map rotation to interpolated values
  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      bounces={true}
      showsVerticalScrollIndicator={true}>
      <View style={styles.container}>
        <Text style={styles.title}>{t('rockPaperScissors.title')}</Text>
        <Text style={styles.description}>{t('rockPaperScissors.description')}</Text>
        
        {/* Mode Switch */}
        <View style={styles.modeSwitchContainer}>
          <Text style={[styles.modeLabel, gameMode === 'standard' ? styles.activeModeLabel : null]}>
            {t('rockPaperScissors.standard')}
          </Text>
          <Switch
            value={gameMode === 'extended'}
            onValueChange={(value) => setGameMode(value ? 'extended' : 'standard')}
            trackColor={{ false: '#E0E0E0', true: '#D1CFFF' }}
            thumbColor={gameMode === 'extended' ? '#6C5CE7' : '#FFF'}
            style={styles.modeSwitch}
          />
          <Text style={[styles.modeLabel, gameMode === 'extended' ? styles.activeModeLabel : null]}>
            {t('rockPaperScissors.extended')}
          </Text>
        </View>
        
        {/* Result Display */}
        <View style={styles.resultContainer}>
          {result ? (
            <Animated.View 
              style={[
                styles.resultIconContainer,
                {
                  transform: [
                    { rotate: rotation },
                    { scale: scaleAnim }
                  ]
                }
              ]}>
              <Image
                source={choiceImages[result]}
                style={styles.resultImage}
                resizeMode="contain"
              />
              <Text style={styles.resultText}>
                {t(`rockPaperScissors.${result}`)}
              </Text>
            </Animated.View>
          ) : (
            <View style={styles.placeholderContainer}>
              <MaterialCommunityIcons 
                name="help-circle-outline" 
                size={100} 
                color="#CCCCCC"
              />
              <Text style={styles.placeholderText}>{t('rockPaperScissors.result')}</Text>
            </View>
          )}
        </View>
        
        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.generateButton, isRolling && styles.disabledButton]}
            onPress={generateRandomChoice}
            disabled={isRolling}>
            <Text style={styles.buttonText}>{t('rockPaperScissors.generate')}</Text>
          </Pressable>
          
          {result && (
            <Pressable
              style={styles.resetButton}
              onPress={resetSelection}>
              <Text style={styles.buttonText}>{t('rockPaperScissors.reset')}</Text>
            </Pressable>
          )}
        </View>
        
        {/* Options List */}
        <View style={styles.optionsContainer}>
          <Text style={styles.optionsTitle}>{t('rockPaperScissors.availableOptions')}</Text>
          <View style={styles.optionsList}>
            {getChoices().map((choice) => (
              <View key={choice} style={styles.optionItem}>
                <Image
                  source={choiceImages[choice]}
                  style={styles.optionImage}
                  resizeMode="contain"
                />
                <Text style={styles.optionText}>
                  {t(`rockPaperScissors.${choice}`)}
                </Text>
              </View>
            ))}
          </View>
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
    marginBottom: 24,
    textAlign: 'center',
  },
  modeSwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#F8F8F8',
    padding: 12,
    borderRadius: 12,
  },
  modeLabel: {
    fontSize: 16,
    color: '#666',
    marginHorizontal: 8,
  },
  activeModeLabel: {
    color: '#6C5CE7',
    fontWeight: 'bold',
  },
  modeSwitch: {
    marginHorizontal: 8,
  },
  resultContainer: {
    width: '100%',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0EEFF',
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  resultIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultImage: {
    width: 160,
    height: 160,
    marginBottom: 10,
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    width: '100%',
    justifyContent: 'center',
    gap: 16,
  },
  generateButton: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    minWidth: 150,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#FF5252',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    shadowColor: '#FF5252',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    minWidth: 150,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionsContainer: {
    width: '100%',
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
  },
  optionsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  optionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 12,
    marginTop: 12,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    minWidth: 120,
    maxWidth: '45%',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionImage: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  optionText: {
    fontSize: 14,
    color: '#333',
    flexShrink: 1,
  },
});