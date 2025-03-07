import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GAMES, GameConfig } from './gameConfig';
import { supabase } from './supabase';

interface GameSettingsContextType {
  games: GameConfig[];
  toggleGameEnabled: (gameId: string) => Promise<void>;
  isGameEnabled: (gameId: string) => boolean;
  isLoading: boolean;
}

const GameSettingsContext = createContext<GameSettingsContextType | undefined>(undefined);

// Storage key for game settings
const GAME_SETTINGS_KEY = 'game_settings';

export function GameSettingsProvider({ children }: { children: React.ReactNode }) {
  const [games, setGames] = useState<GameConfig[]>(GAMES);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved game settings on startup
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem(GAME_SETTINGS_KEY);
        
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings) as Record<string, boolean>;
          
          // Update games with saved enabled/disabled status
          setGames(GAMES.map(game => ({
            ...game,
            enabled: parsedSettings[game.id] !== undefined 
              ? parsedSettings[game.id] 
              : game.enabled
          })));
        }
      } catch (error) {
        console.error('Failed to load game settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Function to toggle a game's enabled status
  const toggleGameEnabled = async (gameId: string) => {
    try {
      const updatedGames = games.map(game => 
        game.id === gameId ? { ...game, enabled: !game.enabled } : game
      );
      
      setGames(updatedGames);
      
      // Save settings to persistent storage
      const settings = updatedGames.reduce((acc, game) => {
        acc[game.id] = game.enabled;
        return acc;
      }, {} as Record<string, boolean>);
      
      await AsyncStorage.setItem(GAME_SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save game settings:', error);
      // Revert state if save fails
      setGames(games);
    }
  };

  // Helper function to check if a game is enabled
  const isGameEnabled = (gameId: string) => {
    return games.find(game => game.id === gameId)?.enabled ?? false;
  };

  return (
    <GameSettingsContext.Provider value={{ 
      games, 
      toggleGameEnabled, 
      isGameEnabled,
      isLoading 
    }}>
      {children}
    </GameSettingsContext.Provider>
  );
}

// Custom hook to use game settings
export function useGameSettings() {
  const context = useContext(GameSettingsContext);
  if (context === undefined) {
    throw new Error('useGameSettings must be used within a GameSettingsProvider');
  }
  return context;
}