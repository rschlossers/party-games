import { View, StyleSheet, Platform } from 'react-native';
import { AdMobBanner } from 'expo-ads-admob';

const BANNER_ID = Platform.select({
  ios: 'ca-app-pub-6111181835010052/6762336581',
  android: 'ca-app-pub-6111181835010052/6762336581',
  default: 'ca-app-pub-6111181835010052/6762336581',
});

export function AdBanner() {
  return (
    <View style={styles.container}>
      <AdMobBanner
        bannerSize="fullBanner"
        adUnitID={BANNER_ID}
        servePersonalizedAds
        onDidFailToReceiveAdWithError={(error) => console.error(error)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});