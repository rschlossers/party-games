import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../utils/i18n';

// Type for lap times
interface LapTime {
  id: number;
  time: number;
  formattedTime: string;
  lapDuration: number;
  formattedLapDuration: string;
}

export default function Stopwatch() {
  const { t } = useLanguage();
  
  // State for time tracking
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<LapTime[]>([]);
  
  // Refs for interval and previous time
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number>(0);
  const lapCounterRef = useRef(0);

  // Format milliseconds to MM:SS.ms format
  const formatTime = (timeInMs: number) => {
    const minutes = Math.floor(timeInMs / 60000);
    const seconds = Math.floor((timeInMs % 60000) / 1000);
    const ms = Math.floor((timeInMs % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  // Start the stopwatch
  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      
      const startTime = Date.now() - previousTimeRef.current;
      startTimeRef.current = startTime;
      
      intervalRef.current = setInterval(() => {
        const currentTime = Date.now() - (startTimeRef.current || 0);
        setTime(currentTime);
        previousTimeRef.current = currentTime;
      }, 10); // Update every 10ms for centiseconds precision
    }
  };

  // Stop the stopwatch
  const stopTimer = () => {
    if (isRunning) {
      clearInterval(intervalRef.current!);
      setIsRunning(false);
    }
  };

  // Reset the stopwatch
  const resetTimer = () => {
    stopTimer();
    setTime(0);
    setLaps([]);
    previousTimeRef.current = 0;
    lapCounterRef.current = 0;
  };

  // Record a lap time
  const recordLap = () => {
    if (isRunning) {
      lapCounterRef.current += 1;
      const lapId = lapCounterRef.current;
      const previousLap = laps[0]?.time || 0;
      const lapDuration = time - previousLap;
      
      const newLap: LapTime = {
        id: lapId,
        time,
        formattedTime: formatTime(time),
        lapDuration,
        formattedLapDuration: formatTime(lapDuration)
      };
      
      setLaps(prevLaps => [newLap, ...prevLaps]);
    }
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      bounces={true}
      showsVerticalScrollIndicator={true}>
      <View style={styles.container}>
        <Text style={styles.title}>{t('stopwatch.title')}</Text>
        <Text style={styles.description}>{t('stopwatch.description')}</Text>
        
        {/* Main Stopwatch Display */}
        <View style={styles.timerContainer}>
          <Text style={styles.timeDisplay}>{formatTime(time)}</Text>
        </View>
        
        {/* Controls */}
        <View style={styles.controlsContainer}>
          {!isRunning ? (
            <Pressable
              style={[styles.button, styles.startButton]}
              onPress={startTimer}>
              <Text style={styles.buttonText}>{t('stopwatch.start')}</Text>
            </Pressable>
          ) : (
            <Pressable
              style={[styles.button, styles.stopButton]}
              onPress={stopTimer}>
              <Text style={styles.buttonText}>{t('stopwatch.stop')}</Text>
            </Pressable>
          )}
          
          <Pressable
            style={[styles.button, styles.lapButton, !isRunning && styles.disabledButton]}
            onPress={recordLap}
            disabled={!isRunning}>
            <Text style={styles.buttonText}>{t('stopwatch.lap')}</Text>
          </Pressable>
          
          <Pressable
            style={[styles.button, styles.resetButton, (isRunning || time === 0) && styles.disabledButton]}
            onPress={resetTimer}
            disabled={isRunning || time === 0}>
            <Text style={styles.buttonText}>{t('stopwatch.reset')}</Text>
          </Pressable>
        </View>
        
        {/* Lap Times Section */}
        <View style={styles.lapsContainer}>
          <Text style={styles.lapsTitle}>{t('stopwatch.lapTimes')}</Text>
          
          {laps.length === 0 ? (
            <Text style={styles.noLapsText}>{t('stopwatch.noLaps')}</Text>
          ) : (
            <View style={styles.lapsContent}>
              <View style={styles.lapsHeader}>
                <Text style={styles.lapNumberHeader}>{t('stopwatch.lapNumber')}</Text>
                <Text style={styles.lapTimeHeader}>{t('stopwatch.lap')}</Text>
                <Text style={styles.totalTimeHeader}>{t('stopwatch.totalTime')}</Text>
              </View>
              
              {laps.map((lap) => (
                <View key={lap.id} style={styles.lapItem}>
                  <Text style={styles.lapNumber}>{lap.id}</Text>
                  <Text style={styles.lapTime}>{lap.formattedLapDuration}</Text>
                  <Text style={styles.totalTime}>{lap.formattedTime}</Text>
                </View>
              ))}
            </View>
          )}
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
    marginBottom: 30,
    textAlign: 'center',
  },
  timerContainer: {
    backgroundColor: '#2A2A2A',
    borderRadius: 20,
    padding: 30,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  timeDisplay: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#FF5252',
  },
  lapButton: {
    backgroundColor: '#6C5CE7',
  },
  resetButton: {
    backgroundColor: '#FFC107',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lapsContainer: {
    flex: 1,
    width: '100%',
    maxHeight: 400,
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 16,
  },
  lapsContent: {
    flex: 1,
  },
  lapsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  noLapsText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  lapsList: {
    flex: 1,
  },
  lapsHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 8,
  },
  lapNumberHeader: {
    width: 50,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  lapTimeHeader: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
  },
  totalTimeHeader: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'right',
  },
  lapItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    alignItems: 'center',
  },
  lapNumber: {
    width: 50,
    fontSize: 16,
    color: '#333',
  },
  lapTime: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  totalTime: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});