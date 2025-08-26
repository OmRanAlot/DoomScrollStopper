// App.tsx
import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import Home from './components/Home/home';
import Customize from './components/Customize/customize';
import Progress from './components/Progress/progress';
import VPNSwitch from './components/VPNSwitch/VPNSwitch';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Tab.Navigator 
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: { 
              backgroundColor: '#1D201F',
              height: 80,
              paddingBottom: 20,
              paddingTop: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
              borderTopWidth: 0,
            },
            tabBarLabelStyle: { 
              fontSize: 12, 
              fontWeight: '600',
              marginTop: 4,
            },
            tabBarActiveTintColor: '#A8C5F0',
            tabBarInactiveTintColor: '#6B7280',
            tabBarIcon: ({ focused, color }) => {
              let iconText;

              if (route.name === 'Home') {
                iconText = focused ? '🏠' : '🏠';
              } else if (route.name === 'Customize') {
                iconText = focused ? '⚙️' : '⚙️';
              } else if (route.name === 'Progress') {
                iconText = focused ? '📊' : '📊';
              } else if (route.name === 'VPN') {
                iconText = focused ? '🛡️' : '🛡️';
              }

              return <Text style={{ fontSize: 20, color: focused ? '#A8C5F0' : '#6B7280' }}>{iconText}</Text>;
            },
          })}
        >
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Customize" component={Customize} />
          <Tab.Screen name="Progress" component={Progress} />
          <Tab.Screen name="VPN" component={VPNSwitch} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D201F',
  },
});

export default App;