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
} from 'react-native';
const { VPNModule } = NativeModules;

const { AppBlocker } = NativeModules;
const appBlockerEmitter = new NativeEventEmitter(AppBlocker);

console.log('VPNModule:', NativeModules.VPNModule);
console.log('AppBlocker:', NativeModules.AppBlocker);
VPNModule.getInstalledApps()
  .then(apps => console.log(apps))
  .catch(err => console.error(err));


const VPNSwitch = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [installedApps, setInstalledApps] = useState([]);
  const [blockedApps, setBlockedApps] = useState(new Set());
  const [detectedApps, setDetectedApps] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load installed apps
    loadInstalledApps();

    // Set up event listeners
    const detectionListener = appBlockerEmitter.addListener(
      'onAppDetected',
      (event) => {
        console.log('App detected:', event);
        addDetectedApp(event);
      }
    );

    const blockedListener = appBlockerEmitter.addListener(
      'onBlockedAppOpened',
      (event) => {
        console.log('Blocked app opened:', event);
      }
    );

    return () => {
      detectionListener.remove();
      blockedListener.remove();
    };
  }, []);

  const loadInstalledApps = async () => {
    try {
      const apps = await VPNModule.getInstalledApps();
      setInstalledApps(apps);
    } catch (error) {
      console.error('Failed to load apps:', error);
    }
  };

  const requestPermissions = async () => {
    try {
      await VPNModule.requestPermissions();
      // After user grants permission, they need to return to the app
      Alert.alert(
        'Permission Required',
        'Please grant Usage Access permission and return to the app',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Permission request failed:', error);
    }
  };

  const requestOverlayPermission = async () => {
    try {
      await VPNModule.requestOverlayPermission();
      Alert.alert(
        'Permission Required',
        'Please grant Display Over Other Apps permission and return to the app',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Overlay permission request failed:', error);
    }
  };

  const toggleMonitoring = async () => {
    try {
      if (!isMonitoring) {
        // Request permissions first
        await requestPermissions();
        setTimeout(async () => {
          await requestOverlayPermission();
          setTimeout(async () => {
            await VPNModule.startMonitoring();
            setIsMonitoring(true);
          }, 1000);
        }, 1000);
      } else {
        await VPNModule.stopMonitoring();
        setIsMonitoring(false);
      }
    } catch (error) {
      console.error('Failed to toggle monitoring:', error);
      Alert.alert('Error', 'Failed to toggle monitoring: ' + error.message);
    }
  };

  const toggleAppBlock = async (packageName) => {
    const newBlockedApps = new Set(blockedApps);
    if (newBlockedApps.has(packageName)) {
      newBlockedApps.delete(packageName);
    } else {
      newBlockedApps.add(packageName);
    }
    setBlockedApps(newBlockedApps);

    try {
      await VPNModule.setBlockedApps(Array.from(newBlockedApps));
    } catch (error) {
      console.error('Failed to update blocked apps:', error);
    }
  };

  const addDetectedApp = (appInfo) => {
    setDetectedApps((prev) => {
      const newList = [appInfo, ...prev.slice(0, 19)]; // Keep last 20
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

  const renderDetectedApp = ({ item }) => (
    <View style={styles.detectedItem}>
      <Text style={styles.detectedAppName}>{item.appName}</Text>
      <Text style={styles.detectedTime}>
        {new Date(item.timestamp).toLocaleTimeString()}
      </Text>
    </View>
  );

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
            onValueChange={toggleMonitoring}
            trackColor={{ false: '#767577', true: '#4CAF50' }}
            thumbColor={isMonitoring ? '#fff' : '#f4f3f4'}
          />
        </View>
        
        {isMonitoring && (
          <View style={styles.statusBox}>
            <Text style={styles.statusText}>✓ Monitoring apps in background</Text>
            <Text style={styles.statusSubtext}>
              Blocked apps will show a 15-second delay screen
            </Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recently Detected Apps</Text>
        {detectedApps.length > 0 ? (
          <FlatList
            data={detectedApps.slice(0, 5)}
            renderItem={renderDetectedApp}
            keyExtractor={(item, index) => `${item.packageName}-${index}`}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.emptyText}>No apps detected yet</Text>
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
          5. You can choose to continue or go back
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  controlSection: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlLabel: {
    fontSize: 18,
    fontWeight: '500',
  },
  statusBox: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#E8F5E9',
    borderRadius: 5,
  },
  statusText: {
    color: '#2E7D32',
    fontWeight: '500',
  },
  statusSubtext: {
    color: '#1B5E20',
    fontSize: 12,
    marginTop: 3,
  },
  section: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 0,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  appsList: {
    maxHeight: 300,
  },
  flatList: {
    maxHeight: 250,
  },
  appItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  appInfo: {
    flex: 1,
  },
  appName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  packageName: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  detectedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detectedAppName: {
    fontSize: 14,
    color: '#333',
  },
  detectedTime: {
    fontSize: 12,
    color: '#999',
  },
  emptyText: {
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 10,
  },
  reloadButton: {
    padding: 20,
    alignItems: 'center',
  },
  reloadText: {
    color: '#4CAF50',
    fontSize: 16,
  },
  infoSection: {
    backgroundColor: '#E3F2FD',
    margin: 15,
    marginTop: 0,
    padding: 15,
    borderRadius: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1976D2',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#424242',
  },
});

export default VPNSwitch;