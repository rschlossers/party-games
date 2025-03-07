import { useEffect } from 'react';
import { Drawer } from 'expo-router/drawer';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LanguageProvider, useLanguage } from '../utils/i18n';
import { GameSettingsProvider, useGameSettings } from '../utils/gameSettings';
import { AdBanner } from '../components/AdBanner';
import { View } from 'react-native'
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export default function RootLayout() {
  useFrameworkReady();
  return (
    <LanguageProvider>
      <GameSettingsProvider>
        <DrawerNavigator />
      </GameSettingsProvider>
    </LanguageProvider>
  );
}

function DrawerNavigator() {
  const { t, language } = useLanguage();
  const { games, isLoading } = useGameSettings();

  useEffect(() => {
    window.frameworkReady?.();
  }, []);

  // Get all game paths for keeping routes but hiding from drawer
  const allGamePaths = games.map(game => game.path);

  return (
    <>
      <Drawer
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FFFFFF',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: '#333333',
          headerTitleStyle: {
            fontWeight: '600',
          },
          drawerStyle: {
            backgroundColor: '#FFFFFF',
            width: 280,
          },
          drawerActiveTintColor: '#6C5CE7',
          drawerInactiveTintColor: '#666',
          drawerLabelStyle: {
            marginLeft: -8,
            fontSize: 16,
            fontWeight: '500',
          },
          drawerItemStyle: {
            borderRadius: 8,
            marginHorizontal: 8,
            marginVertical: 4,
          },
          headerShown: true,
        }}>
        {/* Dashboard */}
        <Drawer.Screen
          name="index"
          options={{
            title: t('dashboard.word'),
            headerTitle: t('dashboard.title'),
            drawerIcon: ({ size, color }) => (
              <MaterialCommunityIcons 
                name="view-dashboard-outline" 
                size={size} 
                color={color} 
              />
            ),
          }}
        />
        
        {/* Party Games Dashboard */}
        <Drawer.Screen
          name="party-games"
          options={{
            title: t('index.page'),
            headerTitle: t('index.page'),
            drawerIcon: ({ size, color }) => (
              <MaterialCommunityIcons 
                name="cards-playing-outline" 
                size={size} 
                color={color} 
              />
            ),
          }}
        />
        
        {/* Drinking Games */}
        <Drawer.Screen
          name="drinking-games"
          options={{
            title: t('drinkingGames.title'),
            headerTitle: t('drinkingGames.title'),
            drawerIcon: ({ size, color }) => (
              <MaterialCommunityIcons 
                name="glass-mug-variant" 
                size={size} 
                color={color} 
              />
            ),
          }}
        />
        
        {/* Fun Stuff Dashboard */}
        <Drawer.Screen
          name="fun-stuff"
          options={{
            title: t('funStuff.title'),
            headerTitle: t('funStuff.title'),
            drawerIcon: ({ size, color }) => (
              <MaterialCommunityIcons 
                name="party-popper" 
                size={size} 
                color={color} 
              />
            ),
          }}
        />
        
        {/* Party Tools Dashboard */}
        <Drawer.Screen
          name="party-tools"
          options={{
            title: t('partyTools.title'),
            headerTitle: t('partyTools.title'),
            drawerIcon: ({ size, color }) => (
              <MaterialCommunityIcons 
                name="toolbox-outline" 
                size={size} 
                color={color} 
              />
            ),
          }}
        />
        
        {/* Hide all game screens from drawer but keep the routes */}
        {allGamePaths.map(path => (
          <Drawer.Screen
            key={path}
            name={path}
            options={{
              title: '',
              headerTitle: '',
              drawerItemStyle: { height: 0, display: 'none' },
              drawerLabel: () => null,
              drawerIcon: () => null,
            }}
          />
        ))}

        {/* Hide drinking game detail route */}
        <Drawer.Screen
          name="drinking-game/[id]"
          options={{
            title: '',
            headerTitle: '',
            drawerItemStyle: { height: 0, display: 'none' },
            drawerLabel: () => null,
            drawerIcon: () => null,
          }}
        />
        
        {/* Settings - Always Last */}
        <Drawer.Screen
          name="settings"
          options={{
            title: t('settings.title'),
            headerTitle: t('settings.title'),
            headerTintColor: '#333', 
            drawerIcon: ({ size, color }) => (
              <MaterialCommunityIcons 
                name="cog-outline" 
                size={size} 
                color={color} 
              />
            ),
            drawerItemStyle: {
              borderRadius: 8,
              marginHorizontal: 8,
              marginTop: 'auto',
              borderTopWidth: 1,
              borderTopColor: '#F0F0F0',
              paddingTop: 16,
              marginBottom: 8,
            },
          }}
        />
      </Drawer>
      {Platform.OS !== 'web' && <AdBanner />}
      <StatusBar style="auto" />
    </> 
  );
}