import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useLanguage } from '../utils/i18n';

const NumberPicker = ({ value, onChange, max, label, disabled }: {
  value: string;
  onChange: (value: string) => void;
  max: number;
  label: string;
  disabled: boolean;
}) => {
  const numbers = Array.from({ length: max + 1 }, (_, i) => i.toString().padStart(2, '0'));
  const currentIndex = numbers.indexOf(value);

  const increment = () => {
    if (disabled) return;
    const nextIndex = currentIndex < max ? currentIndex + 1 : 0;
    onChange(numbers[nextIndex]);
  };

  const decrement = () => {
    if (disabled) return;
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : max;
    onChange(numbers[prevIndex]);
  };

  return (
    <View style={styles.pickerContainer}>
      <Pressable
        style={styles.arrowButton}
        onPress={increment}
        disabled={disabled}>
        <MaterialCommunityIcons
          name="chevron-up"
          size={24}
          color={disabled ? '#999' : '#6C5CE7'}
        />
      </Pressable>
      
      <View style={styles.timeBox}>
        <Text style={styles.timeText}>{value}</Text>
      </View>
      
      <Pressable
        style={styles.arrowButton}
        onPress={decrement}
        disabled={disabled}>
        <MaterialCommunityIcons
          name="chevron-down"
          size={24}
          color={disabled ? '#999' : '#6C5CE7'}
        />
      </Pressable>
      
      <Text style={styles.pickerLabel}>{label}</Text>
    </View>
  );
};

export default function Countdown() {
  const { t } = useLanguage();
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('02');
  const [seconds, setSeconds] = useState('00');
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  
  const totalSecondsRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout>();
  const soundRef = useRef<Audio.Sound>();

  // Clean up all resources when component unmounts
  useEffect(() => {
    return () => {
      // Cleanup interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Cleanup sound
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const formatTime = (value: number): string => {
    return value.toString().padStart(2, '0');
  };

  const startCountdown = async () => {
    if (!isRunning && !isPaused) {
      // Calculate total seconds
      const hrs = parseInt(hours) || 0;
      const mins = parseInt(minutes) || 0;
      const secs = parseInt(seconds) || 0;
      totalSecondsRef.current = (hrs * 3600) + (mins * 60) + secs;
      
      if (totalSecondsRef.current === 0) return;
    }

    setIsRunning(true);
    setIsPaused(false);
    setTimeUp(false);

    intervalRef.current = setInterval(() => {
      if (totalSecondsRef.current > 0) {
        totalSecondsRef.current--;
        
        const h = Math.floor(totalSecondsRef.current / 3600);
        const m = Math.floor((totalSecondsRef.current % 3600) / 60);
        const s = totalSecondsRef.current % 60;
        
        setHours(formatTime(h));
        setMinutes(formatTime(m));
        setSeconds(formatTime(s));
      } else {
        clearInterval(intervalRef.current);
        setIsRunning(false);
        setTimeUp(true);
        playAlarm();
      }
    }, 1000);
  };

  const pauseCountdown = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsPaused(true);
    setIsRunning(false);
  };

  const resetCountdown = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Unload any previous sounds
    if (soundRef.current) {
      soundRef.current.unloadAsync();
    }
    
    setHours('00');
    setMinutes('02');
    setSeconds('00');
    setIsRunning(false);
    setIsPaused(false);
    setTimeUp(false);
    totalSecondsRef.current = 0;
  };

  const playAlarm = async () => {
    try {
      // Only create a new sound if we don't have one already
      if (!soundRef.current) {
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/sounds/alarm.mp3'),
          { shouldPlay: false } // Don't auto-play yet to prevent race conditions
        );
        soundRef.current = sound;
      }
      
      // First stop and reset the sound if it's already playing
      await soundRef.current.stopAsync().catch(() => {});
      await soundRef.current.setPositionAsync(0).catch(() => {});
      
      // Now play it
      await soundRef.current.playAsync().catch(() => {
        // If playback fails, just clean up to prevent memory leaks
        if (soundRef.current) {
          soundRef.current.unloadAsync();
          soundRef.current = undefined;
        }
      });
    } catch (error) {
      // Silently handle errors
      console.warn('Error playing sound:', error);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      bounces={true}
      showsVerticalScrollIndicator={true}>
      <Text style={styles.title}>{t('countdown.title')}</Text>
      <Text style={styles.description}>{t('countdown.description')}</Text>
      
      <View style={styles.timerContainer}>
        <View style={styles.timeInputs}>
          <NumberPicker
            value={hours}
            onChange={setHours}
            max={99}
            label={t('countdown.hoursLabel')}
            disabled={isRunning || isPaused}
          />
          <Text style={styles.timeSeparator}>:</Text>
          <NumberPicker
            value={minutes}
            onChange={setMinutes}
            max={59}
            label={t('countdown.minutesLabel')}
            disabled={isRunning || isPaused}
          />
          <Text style={styles.timeSeparator}>:</Text>
          <NumberPicker
            value={seconds}
            onChange={setSeconds}
            max={59}
            label={t('countdown.secondsLabel')}
            disabled={isRunning || isPaused}
          />
        </View>
      </View>

      {timeUp && (
        <Text style={styles.timeUpText}>{t('countdown.timeUp')}</Text>
      )}
      
      <View style={styles.buttonContainer}>
        {!isRunning && !isPaused ? (
          <Pressable
            style={styles.startButton}
            onPress={startCountdown}>
            <Text style={styles.buttonText}>{t('countdown.start')}</Text>
          </Pressable>
        ) : (
          <>
            <Pressable
              style={[styles.controlButton, isPaused && styles.resumeButton]}
              onPress={isPaused ? startCountdown : pauseCountdown}>
              <Text style={styles.buttonText}>
                {isPaused ? t('countdown.resume') : t('countdown.pause')}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.controlButton, styles.resetButton]}
              onPress={resetCountdown}>
              <Text style={styles.buttonText}>{t('countdown.reset')}</Text>
            </Pressable>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: '100%',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  timerContainer: {
    backgroundColor: '#2A2A2A',
    borderRadius: 20,
    padding: 30,
    marginBottom: 30,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  timeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 340,
    margin: 'auto',
  },
  pickerContainer: {
    width: '30%',
    alignItems: 'center',
  },
  timeSeparator: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    width: '5%',
    textAlign: 'center',
  },
  timeBox: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#333',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  timeText: {
    fontSize: '8vw',
    maxFontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
  },
  arrowButton: {
    width: '100%',
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerLabel: {
    fontSize: 14,
    color: '#AAA',
    marginTop: 5,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 400,
    padding: 16,
  },
  startButton: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    flex: 1,
    minWidth: 150,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  controlButton: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    flex: 1,
    minWidth: 150,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  resumeButton: {
    backgroundColor: '#4CAF50',
  },
  resetButton: {
    backgroundColor: '#FF5252',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timeUpText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF5252',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});