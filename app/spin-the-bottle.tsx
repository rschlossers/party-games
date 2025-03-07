import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Dimensions, ScrollView } from 'react-native';
import { useLanguage } from '../utils/i18n';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOTTLE_SIZE = Math.min(SCREEN_WIDTH * 0.8, 300); // Responsive bottle size

export default function SpinTheBottle() {
  const { t } = useLanguage();
  const [isSpinning, setIsSpinning] = React.useState(false);
  
  // Animation values
  const rotation = useSharedValue(0);
  
  // Function to handle spin completion
  const onSpinComplete = useCallback(() => {
    setIsSpinning(false);
  }, []);
  
  // Function to spin the bottle
  const spinBottle = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    
    // Calculate a random number of rotations (minimum 5 rotations + random extra)
    const minRotations = 5;
    const extraRotations = Math.random() * 3; // 0-3 extra rotations
    const totalRotations = minRotations + extraRotations;
    const targetRotation = rotation.value + (totalRotations * 360); // Convert rotations to degrees
    
    // Configure animation with fast start and slow finish
    rotation.value = withTiming(
      targetRotation,
      {
        duration: 3000 + Math.random() * 1000, // 3-4 seconds for the entire animation
        easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Cubic bezier for a natural slow-down
      },
      (finished) => {
        if (finished) {
          runOnJS(onSpinComplete)();
        }
      }
    );
  };
  
  // Animated styles for the bottle
  const bottleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` },
      ],
    };
  });

  return (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      bounces={true}
      showsVerticalScrollIndicator={true}>
      <View style={styles.container}>
        <Text style={styles.title}>{t('spinTheBottle.title')}</Text>
        <Text style={styles.description}>{t('spinTheBottle.description')}</Text>
        
        <View style={styles.gameArea}>
          <View style={styles.bottleContainer}>
            <Animated.View style={[styles.bottle, bottleStyle]}>
              <Image
                source={require('../assets/images/spin-the-bottle/bottle.png')}
                style={styles.bottleImage}
                resizeMode="contain"
              />
            </Animated.View>
          </View>
          
          <Text style={styles.instructions}>
            {isSpinning 
              ? t('spinTheBottle.spinningInstructions')
              : t('spinTheBottle.tapToSpin')}
          </Text>
        </View>
        
        <Pressable
          style={[styles.spinButton, isSpinning && styles.disabledButton]}
          onPress={spinBottle}
          disabled={isSpinning}>
          <Text style={styles.spinButtonText}>
            {isSpinning ? t('spinTheBottle.spinningInstructions') : t('spinTheBottle.spin')}
          </Text>
        </Pressable>
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
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 22,
  },
  gameArea: {
    width: '100%',
    aspectRatio: 1,
    maxWidth: BOTTLE_SIZE,
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottleContainer: {
    width: '100%',
    height: '100%',
    borderRadius: BOTTLE_SIZE / 2,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  bottle: {
    width: '80%',
    height: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottleImage: {
    width: '100%',
    height: '100%',
  },
  instructions: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
    textAlign: 'center',
  },
  spinButton: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    marginTop: 20,
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
  spinButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});