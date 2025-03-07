import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useLanguage } from '../utils/i18n';
import { Wheel } from 'react-custom-roulette';

// Predefined color scheme for wheel segments
const COLORS = [
  '#EE4040',
  '#F0CF50',
  '#815CD1',
  '#34A24F',
  '#FF9000',
  '#3DA8C6',
  '#FF4D4D',
  '#7B3BE5',
  '#FFA500',
  '#98FB98',
  '#DDA0DD',
  '#FF69B4',
  '#4169E1',
  '#8B4513',
  '#FA8072',
];

interface WheelItem {
  id: string;
  text: string;
  color: string;
  segment: number;
}

// Predefined presets
const PRESETS = {
  alphabet: Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map((letter, index) => ({
    id: `alphabet-${letter}`,
    text: letter,
    color: COLORS[index % COLORS.length],
    segment: 1
  })),
  numbers: Array.from({ length: 20 }, (_, i) => ({
    id: `number-${i + 1}`,
    text: `${i + 1}`,
    color: COLORS[i % COLORS.length],
    segment: 1
  })),
  drinkingDares: [
    { id: 'dare-1', text: 'Take a Shot', color: COLORS[0], segment: 1 },
    { id: 'dare-2', text: 'Give 2 Sips', color: COLORS[1], segment: 1 },
    { id: 'dare-3', text: 'Everyone Drinks', color: COLORS[2], segment: 1 },
    { id: 'dare-4', text: 'Waterfall', color: COLORS[3], segment: 1 },
    { id: 'dare-5', text: 'Truth or Drink', color: COLORS[4], segment: 1 },
    { id: 'dare-6', text: 'Categories', color: COLORS[5], segment: 1 },
    { id: 'dare-7', text: 'Never Have I Ever', color: COLORS[6], segment: 1 },
    { id: 'dare-8', text: 'Make a Rule', color: COLORS[7], segment: 1 },
  ]
};

export default function WheelOfFortune() {
  const { t } = useLanguage();
  const [items, setItems] = React.useState<WheelItem[]>([]);
  const [newItemText, setNewItemText] = React.useState('');
  const [selectedPreset, setSelectedPreset] = React.useState<keyof typeof PRESETS | null>(null);
  const [result, setResult] = React.useState<string | null>(null);
  const [mustSpin, setMustSpin] = React.useState(false);
  const [prizeNumber, setPrizeNumber] = React.useState(0);
  const [showOptions, setShowOptions] = React.useState(false);
  
  // Animation values
  const rotation = useSharedValue(0);

  const addItem = () => {
    if (!newItemText.trim()) return;
    
    const newItem: WheelItem = {
      id: Date.now().toString(),
      text: newItemText.trim(),
      color: COLORS[items.length % COLORS.length],
      segment: 1
    };
    
    setItems(prev => [...prev, newItem]);
    setNewItemText('');
  };
  
  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };
  
  const loadPreset = (preset: keyof typeof PRESETS) => {
    setSelectedPreset(preset);
    setItems(PRESETS[preset]);
    setResult(null);
    rotation.value = 0;
  };
  
  const resetWheel = () => {
    setItems([]);
    setResult(null);
    setSelectedPreset(null);
    rotation.value = 0;
  };
  
  const handleSpinClick = () => {
    if (!mustSpin && items.length >= 2) {
      const newPrizeNumber = Math.floor(Math.random() * items.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  const handleSpinStop = () => {
    setMustSpin(false);
    setResult(items[prizeNumber].text);
  };

  return (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: result ? 120 : 20 } // Extra padding when result shows
      ]}
      bounces={true}
      showsVerticalScrollIndicator={true}>
      <View style={styles.container}>
        <Text style={styles.title}>{t('wheelOfFortune.title')}</Text>
        <Text style={styles.description}>{t('wheelOfFortune.description')}</Text>
        
        {/* Result Display - Moved above wheel */}
        {result && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>
              {t('wheelOfFortune.winner')}
            </Text>
            <Text style={styles.resultText}>{result}</Text>
          </View>
        )}
        
        {/* Wheel Container - Moved up for better visibility */}
        <View style={styles.wheelContainer}>
          {items.length > 0 ? (
            <View style={styles.wheel}>
              <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                data={items.map(item => ({
                  option: item.text,
                  style: { backgroundColor: item.color }
                }))}
                textColors={['#ffffff']}
                fontSize={16}
                textDistance={60}
                outerBorderColor="#6C5CE7"
                outerBorderWidth={3}
                radiusLineColor="#6C5CE7"
                radiusLineWidth={1}
                spinDuration={0.5}
                startingOptionIndex={0}
                backgroundColors={COLORS}
                pieColors={COLORS}
                onStopSpinning={handleSpinStop}
              />
            </View>
          ) : (
            <View style={styles.emptyWheel}>
              <MaterialCommunityIcons
                name="rotate-360"
                size={80}
                color="#CCCCCC"
              />
              <Text style={styles.emptyWheelText}>
                {t('wheelOfFortune.empty')}
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons - Moved up */}
        <View style={styles.actionButtons}>
          <Pressable
            style={[
              styles.spinButton,
              (mustSpin || items.length < 2) && styles.disabledButton
            ]}
            onPress={handleSpinClick}
            disabled={mustSpin || items.length < 2}>
            <Text style={styles.buttonText}>
              {mustSpin 
                ? t('wheelOfFortune.spinning')
                : t('wheelOfFortune.spin')}
            </Text>
          </Pressable>
          
          <Pressable
            style={[styles.resetButton, items.length === 0 && styles.disabledButton]}
            onPress={resetWheel}
            disabled={items.length === 0}>
            <Text style={styles.buttonText}>
              {t('wheelOfFortune.reset')}
            </Text>
          </Pressable>
        </View>
        
        {/* Presets Section */}
        <Pressable
          style={styles.collapsibleHeader}
          onPress={() => setShowOptions(!showOptions)}>
          <Text style={styles.collapsibleTitle}>{t('wheelOfFortune.customizeWheel')}</Text>
          <MaterialCommunityIcons
            name={showOptions ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="#333"
          />
        </Pressable>

        {showOptions && (
        <View style={styles.optionsContainer}>
          <View style={styles.presetsContainer}>
            <Text style={styles.sectionTitle}>{t('wheelOfFortune.presets')}</Text>
            <View style={styles.presetButtons}>
              <Pressable
                style={[
                  styles.presetButton,
                  selectedPreset === 'alphabet' && styles.selectedPreset
                ]}
                onPress={() => loadPreset('alphabet')}>
                <Text style={styles.presetButtonText}>
                  {t('wheelOfFortune.alphabetPreset')}
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.presetButton,
                  selectedPreset === 'numbers' && styles.selectedPreset
                ]}
                onPress={() => loadPreset('numbers')}>
                <Text style={styles.presetButtonText}>
                  {t('wheelOfFortune.numbersPreset')}
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.presetButton,
                  selectedPreset === 'drinkingDares' && styles.selectedPreset
                ]}
                onPress={() => loadPreset('drinkingDares')}>
                <Text style={styles.presetButtonText}>
                  {t('wheelOfFortune.daresPreset')}
                </Text>
              </Pressable>
            </View>
          </View>
          
          {/* Add Custom Item Section */}
          <View style={styles.addItemContainer}>
            <TextInput
              style={styles.input}
              value={newItemText}
              onChangeText={setNewItemText}
              placeholder={t('wheelOfFortune.addItemPlaceholder')}
              onSubmitEditing={addItem}
            />
            <Pressable
              style={styles.addButton}
              onPress={addItem}>
              <Text style={styles.buttonText}>
                {t('wheelOfFortune.addItem')}
              </Text>
            </Pressable>
          </View>
          
          {/* Items List */}
          {items.length > 0 && (
            <View style={styles.itemsList}>
              <Text style={styles.itemsTitle}>
                {t('wheelOfFortune.items')}
              </Text>
              {items.map(item => (
                <View key={item.id} style={styles.itemRow}>
                  <View style={[styles.itemColor, { backgroundColor: item.color }]} />
                  <Text style={styles.itemText}>{item.text}</Text>
                  <Pressable
                    style={styles.removeButton}
                    onPress={() => removeItem(item.id)}>
                    <MaterialCommunityIcons
                      name="close"
                      size={20}
                      color="#FF3B30"
                    />
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View>
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
  presetsContainer: {
    width: '100%',
    maxWidth: 500,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  presetButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  presetButton: {
    backgroundColor: '#F8F8F8',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    minWidth: 120,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedPreset: {
    backgroundColor: '#6C5CE7',
    borderColor: '#6C5CE7',
  },
  presetButtonText: {
    color: '#333',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '500',
  },
  addItemContainer: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 16,
    width: '100%',
    maxWidth: 500,
  },
  input: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  addButton: {
    backgroundColor: '#6C5CE7',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    minWidth: 80,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  wheelContainer: {
    width: '100%',
    aspectRatio: 1,
    maxWidth: 500,
    marginVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  wheel: {
    width: '100%',
    height: '100%',
    position: 'relative'
  },
  emptyWheel: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#EEEEEE',
    borderStyle: 'dashed',
  },
  emptyWheelText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 20,
    width: '100%',
    maxWidth: 500,
    justifyContent: 'center',
  },
  spinButton: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    minWidth: 180,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  resetButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    minWidth: 180,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.5,
  },
  itemsList: {
    width: '100%',
    maxWidth: 500,
    marginTop: 20,
  },
  itemsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  itemColor: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  removeButton: {
    padding: 4,
  },
  resultContainer: {
    marginBottom: 20,
    backgroundColor: '#F0EEFF',
    padding: 20,
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
  collapsibleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    width: '100%',
    maxWidth: 500,
  },
  collapsibleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  optionsContainer: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
});