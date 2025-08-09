// App.tsx
import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar, useColorScheme, Button } from 'react-native';
import VPNSwitch from './components/VPNSwitch';
import { Linking } from 'react-native';


const App = () => {
  const isDarkMode = useColorScheme() === 'dark';


  const openUsageAccessSettings = () => {
    Linking.openSettings(); // basic fallback

    // Or use native module to launch:
    // android.settings.USAGE_ACCESS_SETTINGS
  };
  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <VPNSwitch />
      {/* <Button title="Enable App Usage Access" onPress={openUsageAccessSettings} /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
});

export default App;