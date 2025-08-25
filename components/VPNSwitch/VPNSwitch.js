import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  NativeModules,
  NativeEventEmitter,
  FlatList,
  TextInput,
  AppState,
} from 'react-native';
import styles from './VPNSwitch.styles';
const { VPNModule, SettingsModule } = NativeModules;
const appBlockerEmitter = new NativeEventEmitter(VPNModule);


const VPNSwitch = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [installedApps, setInstalledApps] = useState([]);
  const [blockedApps, setBlockedApps] = useState(new Set());
  const [detectedApps, setDetectedApps] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Load blocked apps from persistent storage
        const savedBlockedApps = await new Promise((resolve, reject) => {
          SettingsModule.getBlockedApps((apps) => resolve(apps));
        });
        if (savedBlockedApps) {
          setBlockedApps(new Set(savedBlockedApps));
        }
  
        // Load installed apps
        await loadInstalledApps();
      } catch (error) {
        console.error('Failed to load blocked apps or installed apps:', error);
      }
    };

    initialize();

    // Set up event listeners
    const detectionListener = appBlockerEmitter.addListener(
      'onAppDetected',
      (event) => {
        console.log('App detected event received:', event);
        if (event && event.packageName) {
          addDetectedApp(event);
        }
      }
    );

    const blockedListener = appBlockerEmitter.addListener(
      'onBlockedAppOpened',
      (event) => {
        console.log('Blocked app opened:', event);
      }
    );

    // Monitor app state changes
    const appStateListener = AppState.addEventListener('change', (nextAppState) => {
      setAppState(prevState => {
        if (prevState.match(/inactive|background/) && nextAppState === 'active' && isMonitoring) {
          console.log('Restarting monitoring after app resume');
          restartMonitoring();
        }
        return nextAppState;
      });
    });

    return () => {
      detectionListener.remove();
      blockedListener.remove();
      appStateListener?.remove();
    };
  }, []);
 
  const restartMonitoring = async () => {
    try {
      await VPNModule.stopMonitoring();
      setTimeout(async () => {
        await VPNModule.startMonitoring();
        console.log('Monitoring restarted successfully');
      }, 1000);
    } catch (error) {
      console.error('Failed to restart monitoring:', error);
    }
  };

  const loadInstalledApps = async () => {
    try {
      const apps = await VPNModule.getInstalledApps();
      // console.log('Loaded apps count:', apps.length);
      setInstalledApps(apps);
    } catch (error) {
      console.error('Failed to load apps:', error);
      Alert.alert('Error', 'Failed to load installed apps');

    }
  };

  const requestPermissions = async () => {
    try {
      await VPNModule.requestPermissions();
      // After user grants permission, they need to return to the app
      Alert.alert(
        'Permission Required',
        'Please grant Usage Access permission and return to the app',
        [
          { 
            text: 'OK', 
            onPress: () => {
              // Give user time to grant permission
              setTimeout(checkPermissionsAndStart, 3000);
            }
          }
        ]
      );
    } catch (error) {
      console.error('Permission request failed:', error);
    }
  };

  const checkPermissionsAndStart = async () => {
    const perms = await VPNModule.checkPermissions();
    if (!perms.usage) {
      await VPNModule.requestPermissions();
      return;
    }
    if (!perms.overlay) {
      await VPNModule.requestOverlayPermission();
      return;
    }
    await startMonitoringAfterPermissions();
  };

  const startMonitoringAfterPermissions = async () => {
    console.log('DEBUG: startMonitoringAfterPermissions triggered');
    try {
      console.log('Starting monitoring with blocked apps:', Array.from(blockedApps));
      
      // Set blocked apps first
      if (blockedApps.size > 0) {
        await VPNModule.setBlockedApps(Array.from(blockedApps));
      }
      
      console.log('Calling VPNModule.startMonitoring()...');
      // Then start monitoring
      await VPNModule.startMonitoring();
      console.log('startMonitoring promise resolved');

      setIsMonitoring(true);
      
      Alert.alert('Success', 'Monitoring started successfully!');
      console.log('Monitoring started successfully');
    } catch (error) {
      console.error('Failed to start monitoring:', error);
      Alert.alert('Error', 'Failed to start monitoring: ' + error.message);
    }
  };

  const stopMonitoring = async () => {
    try {
      await VPNModule.stopMonitoring();
      setIsMonitoring(false);
      console.log("Monitoring stopped successfully");
    } catch (error) {
      console.error("Failed to stop monitoring:", error);
      Alert.alert("Error", "Failed to stop monitoring: " + error.message);
    }
  };

  const toggleAppBlock = async (packageName) => {
    const newBlockedApps = new Set(blockedApps);
    console.log('Toggling app block for:', packageName);
    if (newBlockedApps.has(packageName)) {
      newBlockedApps.delete(packageName);
    } else {
      newBlockedApps.add(packageName);
    }
    setBlockedApps(newBlockedApps);

    SettingsModule.saveBlockedApps(Array.from(newBlockedApps));

    try {
      await VPNModule.setBlockedApps(Array.from(newBlockedApps));
    } catch (error) {
      console.error('Failed to update blocked apps:', error);
    }


    console.log('Updated blocked apps:', Array.from(newBlockedApps));
  };

  const addDetectedApp = (appInfo) => {
    console.log('Adding detected app:', appInfo);
    setDetectedApps((prev) => {
      // Keep last 10 detected apps
      const newList = [appInfo, ...prev.slice(0, 9)];
      console.log('Updated detected apps:', newList);

      return newList;
    });
  };

  const filteredApps = installedApps.filter((app) =>
    app.appName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.packageName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderAppItem = ({ item }) => (
    <View style={styles.appItem}>
      <View style={styles.appInfo}>
        <Text style={styles.appName}>{item.appName}</Text>
        <Text style={styles.packageName}>{item.packageName}</Text>
      </View>
      <Switch
        value={blockedApps.has(item.packageName)}
        onValueChange={() => toggleAppBlock(item.packageName)}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={blockedApps.has(item.packageName) ? '#f5dd4b' : '#f4f3f4'}
      />
    </View>
  );

  const renderDetectedApp = ({ item }) => {
    return <View style={styles.detectedItem}>
            <View style={styles.detectedInfo}>
              <Text style={styles.detectedAppName}>{item.appName || 'Unknown App'}</Text>
              <Text style={styles.detectedPackage}>{item.packageName}</Text>
            </View>
            <Text style={styles.detectedTime}>
              {new Date(item.timestamp).toLocaleTimeString()}
            </Text>
          </View>
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>App Blocker</Text>
        <Text style={styles.subtitle}>
          Monitor and block distracting apps with a delay screen
        </Text>
      </View>

      <View style={styles.controlSection}>
        <View style={styles.controlRow}>
          <Text style={styles.controlLabel}>Monitoring Active</Text>
          <Switch
            value={isMonitoring}
            onValueChange={(value) => {
              if (value) {
                startMonitoringAfterPermissions();
              } else {
                stopMonitoring();
              }
            }}
            trackColor={{ false: '#767577', true: '#4CAF50' }}
            thumbColor={isMonitoring ? '#fff' : '#f4f3f4'}
          />
        </View>
        
        {isMonitoring && (
          <View style={styles.statusBox}>
            <Text style={styles.statusText}>✓ Monitoring apps in background</Text>
            <Text style={styles.statusSubtext}>
              Blocked apps: {blockedApps.size} • Will show 15-second delay screen
            </Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recently Detected Apps ({detectedApps.length})</Text>
        {detectedApps.length > 0 ? (
          <FlatList
            data={detectedApps.slice(0, 10)}
            renderItem={renderDetectedApp}
            keyExtractor={(item, index) => `${item.packageName}-${index}`}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.emptyText}>
            No apps detected yet. {isMonitoring ? 'Switch between apps to test detection.' : 'Start monitoring first.'}
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Apps to Block</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search apps..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        
        <View style={styles.appsList}>
          {filteredApps.length > 0 ? (
            <FlatList
              data={filteredApps}
              renderItem={renderAppItem}
              keyExtractor={(item) => item.packageName}
              style={styles.flatList}
              nestedScrollEnabled={true}
            />
          ) : (
            <TouchableOpacity onPress={loadInstalledApps} style={styles.reloadButton}>
              <Text style={styles.reloadText}>Tap to load apps</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>How it works:</Text>
        <Text style={styles.infoText}>
          1. Grant Usage Access and Overlay permissions{'\n'}
          2. Select apps you want to block or delay{'\n'}
          3. Turn on monitoring{'\n'}
          4. When you open a blocked app, you'll see a 15-second delay screen{'\n'}
          5. You can choose to continue or go back{'\n\n'}
          Debug: App state is {appState}
        </Text>
      </View>
    </ScrollView>
  );
};



export default VPNSwitch;