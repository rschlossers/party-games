import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, ScrollView, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../utils/i18n';

// Define the Die component with animation and locking functionality
interface DieProps {
  value: number;
  isLocked: boolean;
  index: number;
  onToggleLock: (index: number) => void;
  isRolling: boolean;
}

const Die = ({ value, isLocked, index, onToggleLock, isRolling }: DieProps) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Only trigger animation when explicitly rolling and the die is not locked
  useEffect(() => {
    if (isRolling && !isLocked) {
      // Reset rotation
      rotateAnim.setValue(0);
      
      // Create a sequence of animations
      Animated.sequence([
        // First scale down slightly
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
        // Then scale up and rotate
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [isRolling, isLocked]);

  // Map rotation to interpolated values
  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Render different die faces based on value
  const renderDieFace = (val: number) => {
    switch (val) {
      case 1:
        return (
          <View style={styles.dieFace}>
            <View style={styles.dotCenter} />
          </View>
        );
      case 2:
        return (
          <View style={styles.dieFace}>
            <View style={styles.dotTopLeft} />
            <View style={styles.dotBottomRight} />
          </View>
        );
      case 3:
        return (
          <View style={styles.dieFace}>
            <View style={styles.dotTopLeft} />
            <View style={styles.dotCenter} />
            <View style={styles.dotBottomRight} />
          </View>
        );
      case 4:
        return (
          <View style={styles.dieFace}>
            <View style={styles.dotTopLeft} />
            <View style={styles.dotTopRight} />
            <View style={styles.dotBottomLeft} />
            <View style={styles.dotBottomRight} />
          </View>
        );
      case 5:
        return (
          <View style={styles.dieFace}>
            <View style={styles.dotTopLeft} />
            <View style={styles.dotTopRight} />
            <View style={styles.dotCenter} />
            <View style={styles.dotBottomLeft} />
            <View style={styles.dotBottomRight} />
          </View>
        );
      case 6:
        return (
          <View style={styles.dieFace}>
            <View style={styles.dotTopLeft} />
            <View style={styles.dotTopRight} />
            <View style={styles.dotMiddleLeft} />
            <View style={styles.dotMiddleRight} />
            <View style={styles.dotBottomLeft} />
            <View style={styles.dotBottomRight} />
          </View>
        );
      default:
        return <View />;
    }
  };

  return (
    <Pressable
      onPress={() => onToggleLock(index)}
      style={({ pressed }) => [
        styles.dieContainer,
        isLocked ? styles.lockedDie : null,
        pressed ? { opacity: 0.8 } : null,
      ]}>
      <Animated.View
        style={[
          styles.die,
          {
            transform: [
              { rotate: rotation },
              { scale: scaleAnim },
            ],
          },
        ]}>
        {renderDieFace(value)}
      </Animated.View>
      {isLocked && (
        <View style={styles.lockIconContainer}>
          <MaterialCommunityIcons name="lock" size={16} color="#FFF" />
        </View>
      )}
    </Pressable>
  );
};

export default function Dice() {
  const { t } = useLanguage();
  const [diceCount, setDiceCount] = useState(1);
  const [diceValues, setDiceValues] = useState<number[]>([1]);
  const [lockedDice, setLockedDice] = useState<boolean[]>([false]);
  const [hasRolled, setHasRolled] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [total, setTotal] = useState(1);

  // Effect to handle changes in dice count
  useEffect(() => {
    // Preserve existing dice values and only add/remove as needed
    let newValues = [...diceValues];
    let newLocked = [...lockedDice];
    
    if (diceCount > diceValues.length) {
      // Add new dice
      const additionalDice = diceCount - diceValues.length;
      const newDice = Array(additionalDice).fill(0).map(() => Math.floor(Math.random() * 6) + 1);
      const newLockStates = Array(additionalDice).fill(false);
      
      newValues = [...newValues, ...newDice];
      newLocked = [...newLocked, ...newLockStates];
    } else if (diceCount < diceValues.length) {
      // Remove excess dice
      newValues = newValues.slice(0, diceCount);
      newLocked = newLocked.slice(0, diceCount);
    }
    
    setDiceValues(newValues);
    setLockedDice(newLocked);
    calculateTotal(newValues);
  }, [diceCount]);

  // Calculate the total of all dice
  const calculateTotal = (values: number[]) => {
    setTotal(values.reduce((sum, val) => sum + val, 0));
  };

  // Function to roll the dice
  const rollDice = () => {
    // Set rolling state to trigger animations
    setIsRolling(true);
    
    const newValues = [...diceValues];
    
    // Only roll dice that aren't locked
    for (let i = 0; i < diceCount; i++) {
      if (!lockedDice[i]) {
        newValues[i] = Math.floor(Math.random() * 6) + 1;
      }
    }
    
    setDiceValues(newValues);
    setHasRolled(true);
    calculateTotal(newValues);
    
    // Reset rolling state after animation completes
    setTimeout(() => {
      setIsRolling(false);
    }, 450); // Slightly longer than animation duration
  };

  // Function to toggle dice lock state
  const toggleLock = (index: number) => {
    // Only allow locking after first roll and if we have more than 1 die
    if (!hasRolled || diceCount === 1) return;
    
    const newLockedDice = [...lockedDice];
    newLockedDice[index] = !newLockedDice[index];
    setLockedDice(newLockedDice);
  };

  // Function to reset dice
  const resetDice = () => {
    // Generate new initial values
    const initialValues = Array(diceCount).fill(0).map(() => Math.floor(Math.random() * 6) + 1);
    
    setDiceValues(initialValues);
    setLockedDice(Array(diceCount).fill(false));
    setHasRolled(false);
    calculateTotal(initialValues);
    
    // No animation for reset
    setIsRolling(false);
  };

  // Function to increase dice count
  const increaseDiceCount = () => {
    if (diceCount < 6) {
      setDiceCount(diceCount + 1);
    }
  };

  // Function to decrease dice count
  const decreaseDiceCount = () => {
    if (diceCount > 1) {
      setDiceCount(diceCount - 1);
    }
  };

  return (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      bounces={true}
      showsVerticalScrollIndicator={true}>
      <View style={styles.container}>
      <Text style={styles.title}>{t('dice.title')}</Text>
      <Text style={styles.description}>{t('dice.description')}</Text>
      
      {/* Dice count selector */}
      <View style={styles.countSelector}>
        <Text style={styles.countLabel}>{t('dice.numberOfDice')}</Text>
        <View style={styles.countControls}>
          <Pressable
            style={[styles.countButton, diceCount <= 1 ? styles.disabledButton : null]}
            onPress={decreaseDiceCount}
            disabled={diceCount <= 1}>
            <MaterialCommunityIcons name="minus" size={24} color={diceCount <= 1 ? "#999" : "#FFF"} />
          </Pressable>
          <Text style={styles.countText}>{diceCount}</Text>
          <Pressable
            style={[styles.countButton, diceCount >= 6 ? styles.disabledButton : null]}
            onPress={increaseDiceCount}
            disabled={diceCount >= 6}>
            <MaterialCommunityIcons name="plus" size={24} color={diceCount >= 6 ? "#999" : "#FFF"} />
          </Pressable>
        </View>
      </View>
      
      {/* Dice display */}
      <View style={styles.diceContainer}>
        {diceValues.map((value, index) => (
          <Die
            key={index}
            value={value}
            isLocked={lockedDice[index]}
            index={index}
            onToggleLock={toggleLock}
            isRolling={isRolling}
          />
        ))}
      </View>
      
      {/* Total score */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>{t('dice.total')}</Text>
        <Text style={styles.totalValue}>{total}</Text>
      </View>
      
      {/* Action buttons */}
      <View style={styles.actionButtons}>
        <Pressable
          style={styles.rollButton}
          onPress={rollDice}>
          <Text style={styles.buttonText}>{t('dice.roll')}</Text>
        </Pressable>
        
        <Pressable
          style={styles.resetButton}
          onPress={resetDice}>
          <Text style={styles.buttonText}>{t('dice.reset')}</Text>
        </Pressable>
      </View>
      
      {/* Instructions */}
      {diceCount > 1 && hasRolled && (
        <Text style={styles.instructions}>{t('dice.lockInstructions')}</Text>
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
    backgroundColor: '#FFFFFF',
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
  countSelector: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 24,
  },
  countLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: '#333',
  },
  countControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countButton: {
    backgroundColor: '#6C5CE7',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
  },
  countText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 20,
    color: '#333',
    width: 30,
    textAlign: 'center',
  },
  diceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginVertical: 24,
    width: '100%',
    maxWidth: 400,
  },
  dieContainer: {
    position: 'relative',
  },
  die: {
    width: 60,
    height: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  lockedDie: {
    opacity: 0.9,
  },
  lockIconContainer: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF5252',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  dieFace: {
    width: '100%',
    height: '100%',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#333',
    position: 'absolute',
  },
  dotCenter: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#333',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -6,
    marginTop: -6,
  },
  dotTopLeft: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#333',
    position: 'absolute',
    top: '20%',
    left: '20%',
    marginLeft: -6,
    marginTop: -6,
  },
  dotTopRight: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#333',
    position: 'absolute',
    top: '20%',
    right: '20%',
    marginRight: -6,
    marginTop: -6,
  },
  dotMiddleLeft: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#333',
    position: 'absolute',
    top: '50%',
    left: '20%',
    marginLeft: -6,
    marginTop: -6,
  },
  dotMiddleRight: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#333',
    position: 'absolute',
    top: '50%',
    right: '20%',
    marginRight: -6,
    marginTop: -6,
  },
  dotBottomLeft: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#333',
    position: 'absolute',
    bottom: '20%',
    left: '20%',
    marginLeft: -6,
    marginBottom: -6,
  },
  dotBottomRight: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#333',
    position: 'absolute',
    bottom: '20%',
    right: '20%',
    marginRight: -6,
    marginBottom: -6,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 24,
    width: '100%',
    justifyContent: 'center',
  },
  rollButton: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 50,
    minWidth: 150,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  resetButton: {
    backgroundColor: '#FF5252',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 50,
    minWidth: 150,
    shadowColor: '#FF5252',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  totalContainer: {
    alignItems: 'center',
    marginVertical: 16,
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#F8F8F8',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginRight: 12,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
  instructions: {
    fontSize: 14,
    color: '#666',
    marginTop: 24,
    textAlign: 'center',
    width: '100%',
    maxWidth: 400,
    fontStyle: 'italic',
  },
});