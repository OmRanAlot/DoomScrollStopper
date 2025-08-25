// App.tsx
import React from 'react';
import { SafeAreaView, StyleSheet, useColorScheme } from 'react-native';
import VPNSwitch from './components/VPNSwitch/VPNSwitch';
import Home from './components/Home/home';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    
      <SafeAreaView style={[styles.container]}>
        <NavigationContainer>
          <Tab.Navigator 
            screenOptions={{
              headerShown: false,
              tabBarStyle: { backgroundColor: '#fff', height: 60 },
              tabBarLabelStyle: { fontSize: 14 }
            }}
          >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="VPNSwitch" component={VPNSwitch} />
          </Tab.Navigator>
        </NavigationContainer>
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