import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Platform, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../utils/i18n';

interface Player {
  id: string;
  name: string;
  score: number;
  roundScores: number[];
  total: number; // Add total score across all rounds
}

interface ScoreboardData {
  id: string;
  name: string;
  players: Player[];
  currentRound: number;
}

export default function Scoreboard() {
  const { t } = useLanguage();
  const [scoreboards, setScoreboards] = useState<ScoreboardData[]>([]);
  const [activeScoreboard, setActiveScoreboard] = useState<ScoreboardData | null>(null);
  const [newBoardName, setNewBoardName] = useState('');
  const [newPlayerName, setNewPlayerName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const formatMessage = (template: string, values: Record<string, any>) => {
    return template.replace(/%\{(\w+)\}/g, (_, key) => values[key]?.toString() || '');
  };

  useEffect(() => {
    loadScoreboards();
  }, []);

  useEffect(() => {
    if (scoreboards.length > 0) {
      AsyncStorage.setItem('scoreboards', JSON.stringify(scoreboards));
    }
  }, [scoreboards]);

  const loadScoreboards = async () => {
    try {
      const stored = await AsyncStorage.getItem('scoreboards');
      if (stored) {
        setScoreboards(JSON.parse(stored));
      }
    } catch (err) {
      setError(t('scoreboard.errorLoading'));
    }
  };

  const createScoreboard = () => {
    if (!newBoardName.trim()) {
      setError(t('scoreboard.errorEmptyName'));
      return;
    }

    const newBoard: ScoreboardData = {
      id: Date.now().toString(),
      name: newBoardName.trim(),
      players: [],
      currentRound: 1
    };

    setScoreboards(prev => [...prev, newBoard]);
    setActiveScoreboard(newBoard);
    setNewBoardName('');
    setError(null);
  };

  const addPlayer = () => {
    if (!activeScoreboard) return;
    if (!newPlayerName.trim()) {
      setError(t('scoreboard.errorEmptyPlayerName'));
      return;
    }

    const newPlayer: Player = {
      id: Date.now().toString(),
      name: newPlayerName.trim(),
      score: 0,
      roundScores: [],
      total: 0
    };

    const updatedBoard = {
      ...activeScoreboard,
      players: [...activeScoreboard.players, newPlayer]
    };

    setScoreboards(prev => 
      prev.map(board => 
        board.id === activeScoreboard.id ? updatedBoard : board
      )
    );
    setActiveScoreboard(updatedBoard);
    setNewPlayerName('');
    setError(null);
  };

  const updateScore = (playerId: string, increment: number) => {
    if (!activeScoreboard) return;

    const updatedBoard = {
      ...activeScoreboard,
      players: activeScoreboard.players.map(player => {
        if (player.id === playerId) {
          const newScore = Math.max(0, player.score + increment);
          return {
            ...player,
            score: newScore,
            total: player.roundScores.reduce((sum, score) => sum + score, 0) + newScore
          };
        }
        return player;
      })
    };

    setScoreboards(prev => 
      prev.map(board => 
        board.id === activeScoreboard.id ? updatedBoard : board
      )
    );
    setActiveScoreboard(updatedBoard);
  };

  const startNewRound = () => {
    if (!activeScoreboard) return;

    const updatedBoard = {
      ...activeScoreboard,
      currentRound: activeScoreboard.currentRound + 1,
      players: activeScoreboard.players.map(player => ({
        ...player,
        roundScores: [...player.roundScores, player.score],
        total: player.roundScores.reduce((sum, score) => sum + score, 0) + player.score,
        score: 0 // Reset current round score
      }))
    };

    setScoreboards(prev => 
      prev.map(board => 
        board.id === activeScoreboard.id ? updatedBoard : board
      )
    );
    setActiveScoreboard(updatedBoard);
  };

  const resetScoreboard = () => {
    if (!activeScoreboard) return;

    const updatedBoard = {
      ...activeScoreboard,
      currentRound: 1,
      players: activeScoreboard.players.map(player => ({
        ...player,
        score: 0,
        roundScores: [],
        total: 0
      }))
    };

    setScoreboards(prev => 
      prev.map(board => 
        board.id === activeScoreboard.id ? updatedBoard : board
      )
    );
    setActiveScoreboard(updatedBoard);
  };

  const deleteScoreboard = (id: string) => {
    setScoreboards(prev => prev.filter(board => board.id !== id));
    if (activeScoreboard?.id === id) {
      setActiveScoreboard(null);
    }
  };

  if (!activeScoreboard) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{t('scoreboard.title')}</Text>
        <Text style={styles.description}>{t('scoreboard.description')}</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newBoardName}
            onChangeText={setNewBoardName}
            placeholder={t('scoreboard.newBoardPlaceholder')}
            onSubmitEditing={createScoreboard}
          />
          <Pressable
            style={styles.createButton}
            onPress={createScoreboard}>
            <Text style={styles.buttonText}>{t('scoreboard.create')}</Text>
          </Pressable>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.boardsList}>
          {scoreboards.map(board => (
            <View key={board.id} style={styles.boardItem}>
              <Pressable
                style={styles.boardButton}
                onPress={() => setActiveScoreboard(board)}>
                <Text style={styles.boardName}>{board.name}</Text>
                <Text style={styles.boardStats}>
                  {formatMessage(t('scoreboard.players'), { count: board.players.length })}
                </Text>
              </Pressable>
              <Pressable
                style={styles.deleteButton}
                onPress={() => deleteScoreboard(board.id)}>
                <MaterialCommunityIcons name="delete" size={24} color="#FF3B30" />
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      bounces={true}
      showsVerticalScrollIndicator={true}>
      <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => setActiveScoreboard(null)}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
          <Text style={styles.backButtonText}>{t('scoreboard.back')}</Text>
        </Pressable>
        <Text style={styles.boardTitle}>{activeScoreboard.name}</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newPlayerName}
          onChangeText={setNewPlayerName}
          placeholder={t('scoreboard.newPlayerPlaceholder')}
          onSubmitEditing={addPlayer}
        />
        <Pressable
          style={styles.addButton}
          onPress={addPlayer}>
          <Text style={styles.buttonText}>{t('scoreboard.addPlayer')}</Text>
        </Pressable>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <ScrollView style={styles.playersList}>
        {activeScoreboard.players.map(player => (
          <View key={player.id} style={styles.playerItem}>
            <View style={styles.playerInfo}>
              <View style={styles.playerNameContainer}>
                <Text style={styles.playerName}>{player.name}</Text>
                <Pressable
                  onPress={() => {
                    const updatedBoard = {
                      ...activeScoreboard,
                      players: activeScoreboard.players.filter(p => p.id !== player.id)
                    };
                    setScoreboards(prev => 
                      prev.map(board => 
                        board.id === activeScoreboard.id ? updatedBoard : board
                      )
                    );
                    setActiveScoreboard(updatedBoard);
                  }}>
                  <MaterialCommunityIcons name="close" size={20} color="#FF3B30" />
                </Pressable>
              </View>
              <Text style={styles.totalScore}>Total: {player.total}</Text>
            </View>

            <View style={styles.scoreControls}>
              <Pressable
                style={styles.scoreButton}
                onPress={() => updateScore(player.id, -1)}>
                <Text style={styles.scoreButtonText}>-</Text>
              </Pressable>
              <Text style={styles.score}>{player.score}</Text>
              <Pressable
                style={styles.scoreButton}
                onPress={() => updateScore(player.id, 1)}>
                <Text style={styles.scoreButtonText}>+</Text>
              </Pressable>
            </View>
            {player.roundScores.length > 0 && (
              <View style={styles.roundScores}>
                {player.roundScores.map((score, index) => (
                  <Text key={index} style={styles.roundScore}>
                    R{index + 1}: {score}
                  </Text>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.roundControls}>
        <Text style={styles.roundText}>
          {formatMessage(t('scoreboard.round'), { number: activeScoreboard.currentRound })}
        </Text>
        <View style={styles.roundButtons}>
          <Pressable
            style={[styles.roundButton, styles.newRoundButton]}
            onPress={startNewRound}>
            <Text style={styles.buttonText}>{t('scoreboard.newRound')}</Text>
          </Pressable>
          <Pressable
            style={[styles.roundButton, styles.resetButton]}
            onPress={resetScoreboard}>
            <Text style={styles.buttonText}>{t('scoreboard.reset')}</Text>
          </Pressable>
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
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#6C5CE7',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#FF3B30',
    marginBottom: 16,
    textAlign: 'center',
  },
  boardsList: {
    gap: 12,
    marginBottom: 20,
  },
  boardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    overflow: 'hidden',
  },
  boardButton: {
    flex: 1,
    padding: 16,
  },
  boardName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  boardStats: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#000',
  },
  boardTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginRight: 40,
  },
  playersList: {
    flex: 1,
    marginBottom: 20,
  },
  playerItem: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  playerInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  playerName: {
    fontSize: 18,
    color: '#000',
  },
  playerNameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  totalScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
  scoreControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  scoreButton: {
    backgroundColor: '#6C5CE7',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    minWidth: 40,
    textAlign: 'center',
  },
  roundScores: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  roundScore: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#E8E4FF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  roundControls: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingVertical: 16,
    marginTop: 'auto',
    backgroundColor: '#FFFFFF',
  },
  roundText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  roundButtons: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  roundButton: {
    flex: 1,
    minWidth: 150,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  newRoundButton: {
    backgroundColor: '#6C5CE7',
  },
  resetButton: {
    backgroundColor: '#FF3B30',
  },
});