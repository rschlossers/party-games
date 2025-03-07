import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useLanguage } from '../utils/i18n';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function BloodAlcoholCalculator() {
  const { t } = useLanguage();
  
  // Standard drinks inputs
  const [beer, setBeer] = useState('0');
  const [strongBeer, setStrongBeer] = useState('0');
  const [wine, setWine] = useState('0');
  const [spirits, setSpirits] = useState('0');
  const [standardDrinks, setStandardDrinks] = useState(0);
  
  // Personal info inputs
  const [drinkingDuration, setDrinkingDuration] = useState('0');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('male');
  
  // Results
  const [showResults, setShowResults] = useState(false);
  const [bloodAlcoholContent, setBloodAlcoholContent] = useState(0);
  const [timeToSober, setTimeToSober] = useState({ hours: 0, minutes: 0 });
  const [calories, setCalories] = useState(0);
  const [runningDistance, setRunningDistance] = useState(0);

  // Calculate standard drinks whenever drink inputs change
  useEffect(() => {
    const beerValue = parseFloat(beer) || 0;
    const strongBeerValue = parseFloat(strongBeer) || 0;
    const wineValue = parseFloat(wine) || 0;
    const spiritsValue = parseFloat(spirits) || 0;

    const totalStandardDrinks = 
      beerValue * 1 + 
      strongBeerValue * 1.5 + 
      wineValue * 1 + 
      spiritsValue * 1;
    
    setStandardDrinks(parseFloat(totalStandardDrinks.toFixed(1)));
  }, [beer, strongBeer, wine, spirits]);

  const calculateBloodAlcohol = () => {
    if (!weight || parseFloat(weight) <= 0) {
      return;
    }

    const weightValue = parseFloat(weight);
    const hoursValue = parseFloat(drinkingDuration) || 0;
    
    // Distribution factor based on gender (Widmark formula)
    const distributionFactor = gender === 'male' ? 0.68 : 0.55;
    
    // Metabolism rate (alcohol elimination per hour)
    const metabolismRate = 0.15;
    
    // Calculate BAC (Blood Alcohol Content) in permille (‰)
    let bac = (standardDrinks * 12 * 0.8) / (weightValue * distributionFactor) - (metabolismRate * hoursValue);
    
    // Ensure BAC is not negative
    bac = Math.max(0, bac);
    
    // Round to 2 decimal places
    const roundedBac = parseFloat(bac.toFixed(2));
    setBloodAlcoholContent(roundedBac);
    
    // Calculate time until sober
    const timeToSoberHours = roundedBac > 0 ? roundedBac / metabolismRate : 0;
    const hours = Math.floor(timeToSoberHours);
    const minutes = Math.round((timeToSoberHours - hours) * 60);
    setTimeToSober({ hours, minutes });
    
    // Calculate calories (90 calories per standard drink)
    const caloriesValue = Math.round(standardDrinks * 90);
    setCalories(caloriesValue);
    
    // Calculate running distance to burn calories (60 calories per km)
    const runningDistanceValue = caloriesValue / 60;
    setRunningDistance(parseFloat(runningDistanceValue.toFixed(1)));
    
    setShowResults(true);
  };

  return (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      bounces={true}
      showsVerticalScrollIndicator={true}>
      <View style={styles.container}>
      <Text style={styles.title}>{t('bloodAlcoholCalculator.title')}</Text>
      <Text style={styles.description}>{t('bloodAlcoholCalculator.description')}</Text>
      
      {/* Drinks Input Section */}
      <View style={styles.inputSection}>
        <Text style={styles.sectionTitle}>{t('bloodAlcoholCalculator.drinksTitle')}</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('bloodAlcoholCalculator.beer')} (33 cl, 4.5%):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={beer}
            onChangeText={setBeer}
            placeholder="0"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('bloodAlcoholCalculator.strongBeer')} (33 cl, 7.5%):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={strongBeer}
            onChangeText={setStrongBeer}
            placeholder="0"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('bloodAlcoholCalculator.wine')} (12 cl, 12%):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={wine}
            onChangeText={setWine}
            placeholder="0"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('bloodAlcoholCalculator.spirits')} (4 cl, 40%):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={spirits}
            onChangeText={setSpirits}
            placeholder="0"
          />
        </View>
        
        <View style={styles.standardDrinksContainer}>
          <Text style={styles.standardDrinksLabel}>
            {t('bloodAlcoholCalculator.standardDrinks')}:
          </Text>
          <Text style={styles.standardDrinksValue}>{standardDrinks}</Text>
        </View>
      </View>
      
      {/* Personal Info Section */}
      <View style={styles.inputSection}>
        <Text style={styles.sectionTitle}>{t('bloodAlcoholCalculator.personalInfoTitle')}</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('bloodAlcoholCalculator.drinkingDuration')}:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={drinkingDuration}
            onChangeText={setDrinkingDuration}
            placeholder="0"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('bloodAlcoholCalculator.weight')} (kg):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
            placeholder="0"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('bloodAlcoholCalculator.gender')}:</Text>
          {Platform.OS === 'web' ? (
            <View style={styles.webSelectContainer}>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                style={{
                  width: '100%',
                  height: '48px',
                  padding: '0 16px',
                  fontSize: '16px',
                  border: '1px solid #E0E0E0',
                  borderRadius: '8px',
                  backgroundColor: '#FFFFFF',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  zIndex: 1
                }}>
                <option value="male">{t('bloodAlcoholCalculator.male')}</option>
                <option value="female">{t('bloodAlcoholCalculator.female')}</option>
              </select>
              <View style={styles.webSelectArrow}>
                <MaterialCommunityIcons name="chevron-down" size={24} color="#333333" />
              </View>
            </View>
          ) : (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={gender}
                onValueChange={(itemValue) => setGender(itemValue)}
                style={styles.picker}>
                <Picker.Item label={t('bloodAlcoholCalculator.male')} value="male" />
                <Picker.Item label={t('bloodAlcoholCalculator.female')} value="female" />
              </Picker>
            </View>
          )}
        </View>
      </View>
      
      {/* Calculate Button */}
      <Pressable
        style={styles.calculateButton}
        onPress={calculateBloodAlcohol}>
        <Text style={styles.calculateButtonText}>
          {t('bloodAlcoholCalculator.calculate')}
        </Text>
      </Pressable>
      
      {/* Results Section */}
      {showResults && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsSectionTitle}>
            {t('bloodAlcoholCalculator.resultsTitle')}
          </Text>
          
          <Text style={styles.resultText}>
            {t('bloodAlcoholCalculator.yourBAC')}: <Text style={styles.resultValue}>{bloodAlcoholContent}</Text>
          </Text>
          
          {bloodAlcoholContent > 0 ? (
            <Text style={styles.resultText}>
              {t('bloodAlcoholCalculator.timeToSober')}:{' '}
              <Text style={styles.resultValue}>
                {timeToSober.hours} {t('bloodAlcoholCalculator.hours')} {timeToSober.minutes} {t('bloodAlcoholCalculator.minutes')}
              </Text>
            </Text>
          ) : (
            <Text style={styles.resultText}>
              {t('bloodAlcoholCalculator.youAreSober')}
            </Text>
          )}
          
          <Text style={styles.resultText}>
            {t('bloodAlcoholCalculator.calories')}: <Text style={styles.resultValue}>{calories} kcal</Text>
          </Text>
          
          <Text style={styles.resultText}>
            {t('bloodAlcoholCalculator.runningDistance')}: <Text style={styles.resultValue}>{runningDistance} km</Text>
          </Text>
          
          <Text style={styles.disclaimerText}>
            {t('bloodAlcoholCalculator.disclaimer')}
          </Text>
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
  },
  container: {
    width: '100%',
    maxWidth: 800,
    marginHorizontal: 'auto',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  inputSection: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    height: 48,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  webSelectContainer: {
    position: 'relative',
    width: '100%',
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'visible',
  },
  webSelectArrow: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -12 }],
    pointerEvents: 'none',
    zIndex: 2
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    height: 48,
    overflow: 'hidden',
  },
  picker: {
    backgroundColor: '#FFFFFF',
    height: 48,
    width: '100%',
  },
  standardDrinksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E8E4FF',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  standardDrinksLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  standardDrinksValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
  calculateButton: {
    backgroundColor: '#6C5CE7',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  calculateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultsContainer: {
    backgroundColor: '#F0EEFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#6C5CE7',
  },
  resultsSectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
    textAlign: 'center',
  },
  resultText: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 12,
  },
  resultValue: {
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
  disclaimerText: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
    marginTop: 16,
    textAlign: 'center',
  },
});