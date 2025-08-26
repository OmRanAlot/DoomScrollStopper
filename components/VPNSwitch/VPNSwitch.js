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
        trackColor={{ false: '#3A3F3E', true: '#A8C5F0' }}
        thumbColor={blockedApps.has(item.packageName) ? '#DDE8F9' : '#9CA3AF'}
      />
    </View>
  );

  const renderDetectedApp = ({ item }) => {
    return (
      <View style={styles.detectedItem}>
        <View style={styles.detectedInfo}>
          <Text style={styles.detectedAppName}>{item.appName || 'Unknown App'}</Text>
          <Text style={styles.detectedPackage}>{item.packageName}</Text>
        </View>
        <View style={styles.detectedTimeContainer}>
          <Text style={styles.detectedTimeIcon}>⏰</Text>
          <Text style={styles.detectedTime}>
            {new Date(item.timestamp).toLocaleTimeString()}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerIcon}>🛡️</Text>
          <Text style={styles.title}>App Blocker</Text>
          <Text style={styles.subtitle}>
            Monitor and block distracting apps with intelligent delay screens
          </Text>
        </View>
      </View>

      {/* Main Control Section */}
      <View style={styles.controlSection}>
        <View style={styles.controlHeader}>
          <Text style={styles.controlTitle}>Monitoring Status</Text>
          <View style={styles.controlToggle}>
            <Text style={styles.controlLabel}>
              {isMonitoring ? 'Active' : 'Inactive'}
            </Text>
            <Switch
              value={isMonitoring}
              onValueChange={(value) => {
                if (value) {
                  startMonitoringAfterPermissions();
                } else {
                  stopMonitoring();
                }
              }}
              trackColor={{ false: '#3A3F3E', true: '#A8C5F0' }}
              thumbColor={isMonitoring ? '#DDE8F9' : '#9CA3AF'}
            />
          </View>
        </View>
        
        {isMonitoring && (
          <View style={styles.statusBox}>
            <View style={styles.statusHeader}>
              <Text style={styles.statusIcon}>✅</Text>
              <Text style={styles.statusText}>Monitoring Active</Text>
            </View>
            <View style={styles.statusDetails}>
              <View style={styles.statusDetail}>
                <Text style={styles.statusDetailIcon}>🚫</Text>
                <Text style={styles.statusDetailText}>
                  {blockedApps.size} apps blocked
                </Text>
              </View>
              <View style={styles.statusDetail}>
                <Text style={styles.statusDetailIcon}>⏱️</Text>
                <Text style={styles.statusDetailText}>
                  15-second delay screen
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Recently Detected Apps */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recently Detected</Text>
          <View style={styles.sectionBadge}>
            <Text style={styles.sectionBadgeText}>{detectedApps.length}</Text>
          </View>
        </View>
        
        {detectedApps.length > 0 ? (
          <View style={styles.detectedAppsContainer}>
            <FlatList
              data={detectedApps.slice(0, 5)}
              renderItem={renderDetectedApp}
              keyExtractor={(item, index) => `${item.packageName}-${index}`}
              scrollEnabled={false}
            />
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>
              {isMonitoring 
                ? 'No apps detected yet. Switch between apps to test detection.' 
                : 'Start monitoring first to detect app usage.'
              }
            </Text>
          </View>
        )}
      </View>

      {/* App Selection */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Select Apps to Block</Text>
          <Text style={styles.sectionSubtitle}>
            Choose which apps should trigger delay screens
          </Text>
        </View>
        
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for apps..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        
        <View style={styles.appsList}>
          {filteredApps.length > 0 ? (
            <FlatList
              data={filteredApps}
              renderItem={renderAppItem}
              keyExtractor={(item) => item.packageName}
              style={styles.flatList}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <TouchableOpacity onPress={loadInstalledApps} style={styles.reloadButton}>
              <Text style={styles.reloadIcon}>🔄</Text>
              <Text style={styles.reloadText}>Tap to load apps</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <View style={styles.infoHeader}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoTitle}>How it works</Text>
        </View>
        <View style={styles.infoSteps}>
          <View style={styles.infoStep}>
            <Text style={styles.stepNumber}>1</Text>
            <Text style={styles.stepText}>Grant Usage Access and Overlay permissions</Text>
          </View>
          <View style={styles.infoStep}>
            <Text style={styles.stepNumber}>2</Text>
            <Text style={styles.stepText}>Select apps you want to block or delay</Text>
          </View>
          <View style={styles.infoStep}>
            <Text style={styles.stepNumber}>3</Text>
            <Text style={styles.stepText}>Turn on monitoring</Text>
          </View>
          <View style={styles.infoStep}>
            <Text style={styles.stepNumber}>4</Text>
            <Text style={styles.stepText}>When you open a blocked app, you'll see a 15-second delay screen</Text>
          </View>
          <View style={styles.infoStep}>
            <Text style={styles.stepNumber}>5</Text>
            <Text style={styles.stepText}>You can choose to continue or go back</Text>
          </View>
        </View>
        <View style={styles.debugInfo}>
          <Text style={styles.debugText}>Debug: App state is {appState}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D201F',
  },
  header: {
    backgroundColor: '#2A2F2E',
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3F3E',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#DDE8F9',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 22,
  },
  controlSection: {
    backgroundColor: '#2A2F2E',
    margin: 16,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#3A3F3E',
  },
  controlHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  controlTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#DDE8F9',
  },
  controlToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  statusBox: {
    backgroundColor: '#1D201F',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#A8C5F0',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#A8C5F0',
  },
  statusDetails: {
    gap: 12,
  },
  statusDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDetailIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  statusDetailText: {
    fontSize: 14,
    color: '#DDE8F9',
  },
  section: {
    backgroundColor: '#2A2F2E',
    margin: 16,
    marginTop: 0,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#3A3F3E',
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#DDE8F9',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  sectionBadge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#A8C5F0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  sectionBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1D201F',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1D201F',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#3A3F3E',
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
    color: '#9CA3AF',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#DDE8F9',
    paddingVertical: 16,
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3F3E',
  },
  appInfo: {
    flex: 1,
  },
  appName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#DDE8F9',
    marginBottom: 4,
  },
  packageName: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  detectedAppsContainer: {
    backgroundColor: '#1D201F',
    borderRadius: 12,
    padding: 16,
  },
  detectedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3F3E',
  },
  detectedInfo: {
    flex: 1,
  },
  detectedAppName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#DDE8F9',
    marginBottom: 4,
  },
  detectedPackage: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  detectedTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detectedTimeIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  detectedTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 250,
  },
  reloadButton: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#1D201F',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3A3F3E',
  },
  reloadIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  reloadText: {
    color: '#A8C5F0',
    fontSize: 16,
    fontWeight: '500',
  },
  infoSection: {
    backgroundColor: '#2A2F2E',
    margin: 16,
    marginTop: 0,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#3A3F3E',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#DDE8F9',
  },
  infoSteps: {
    gap: 16,
    marginBottom: 20,
  },
  infoStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#A8C5F0',
    color: '#1D201F',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
    marginTop: 2,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#DDE8F9',
  },
  debugInfo: {
    backgroundColor: '#1D201F',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#3A3F3E',
  },
  debugText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'monospace',
  },
});

export default VPNSwitch;