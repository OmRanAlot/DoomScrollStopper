import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, TextInput, FlatList, Alert, NativeModules, NativeEventEmitter, AppState, Platform, PermissionsAndroid } from 'react-native';
import styles from './homeStyle';

const { VPNModule, SettingsModule } = NativeModules;
const appBlockerEmitter = new NativeEventEmitter(VPNModule);

const Home = () => {
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [blockedApps, setBlockedApps] = useState(new Set());
    const [detectedApps, setDetectedApps] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [installedApps, setInstalledApps] = useState([]);
    const [appState, setAppState] = useState(AppState.currentState);
    const [todayScreenTime, setTodayScreenTime] = useState(0);
    const [blockedAppsUsage, setBlockedAppsUsage] = useState([]);
    const [topAppsUsage, setTopAppsUsage] = useState([]);
    const [isLoadingStats, setIsLoadingStats] = useState(false);
    const [screenTime, setScreenTime] = useState(0);
    const [hasUsagePermission, setHasUsagePermission] = useState(false);

    // Preset apps that users commonly want to block
    const presetApps = [
        { packageName: 'com.instagram.android', name: 'Instagram', icon: '📷', description: 'Social media platform' },
        { packageName: 'com.snapchat.android', name: 'Snapchat', icon: '👻', description: 'Photo sharing app' },
        { packageName: 'com.zhiliaoapp.musically', name: 'TikTok', icon: '🎵', description: 'Short video app' },
        { packageName: 'com.twitter.android', name: 'Twitter', icon: '🐦', description: 'Microblogging platform' },
        { packageName: 'com.reddit.frontpage', name: 'Reddit', icon: '🤖', description: 'Discussion platform' },
    ];

    const quickActions = [
        { title: 'Start Focus Session', icon: '🎯', action: 'focus' },
        { title: 'View Statistics', icon: '📊', action: 'stats' },
        { title: 'Emergency Override', icon: '🚨', action: 'override' },
    ];

    const checkUsagePermission = async () => {
        try {
            const hasPermission = await VPNModule.isUsageAccessGranted();
            setHasUsagePermission(hasPermission);
            return hasPermission;
        } catch (error) {
            console.error('Error checking usage permission:', error);
            return false;
        }
    };

    const requestUsagePermission = async () => {
        try {
            if (Platform.OS === 'android') {
                await VPNModule.openUsageAccessSettings();
                // Check again after user returns from settings
                const hasPermission = await checkUsagePermission();
                if (hasPermission) {
                    loadScreenTimeStats();
                }
                return hasPermission;
            }
            return false;
        } catch (error) {
            console.error('Error requesting usage permission:', error);
            return false;
        }
    };

    const loadScreenTimeStats = async () => {
        try {
            const hasPermission = await checkUsagePermission();
            if (!hasPermission) {
                console.log('No usage access permission');
                return;
            }

            setIsLoadingStats(true);
            const stats = await VPNModule.getScreenTimeStats();
            if (stats) {
                setScreenTime(stats.totalScreenTime || 0);
            }

            // Load blocked apps usage
            const blockedUsage = await VPNModule.getBlockedAppsUsageStats();
            if (blockedUsage) {
                setBlockedAppsUsage(blockedUsage);
            }

            // Load top apps usage
            const endTime = Date.now();
            const startTime = endTime - (24 * 60 * 60 * 1000); // Last 24 hours
            const topApps = await VPNModule.getTopAppsByUsage(startTime, endTime, 5);
            if (topApps) {
                setTopAppsUsage(topApps);
            }
        } catch (error) {
            console.error('Error loading screen time stats:', error);
        } finally {
            setIsLoadingStats(false);
        }
    };

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
        
                // Load installed apps and screen time stats
                await Promise.all([
                    loadInstalledApps(),
                    loadScreenTimeStats()
                ]);
            } catch (error) {
                console.error('Failed to initialize:', error);
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
            setInstalledApps(apps);
        } catch (error) {
            console.error('Failed to load apps:', error);
            Alert.alert('Error', 'Failed to load installed apps');
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
        try {
            if (blockedApps.size > 0) {
                await VPNModule.setBlockedApps(Array.from(blockedApps));
            }
            
            await VPNModule.startMonitoring();
            setIsMonitoring(true);
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
    };

    const addDetectedApp = (appInfo) => {
        setDetectedApps((prev) => {
            const newList = [appInfo, ...prev.slice(0, 9)];
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

    const formatScreenTime = (minutes) => {
        if (!minutes) return '0m';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    const renderScreenTimeCard = () => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>📱 Screen Time</Text>
                {!hasUsagePermission && (
                    <TouchableOpacity 
                        onPress={requestUsagePermission}
                        style={styles.grantButton}
                    >
                        <Text style={styles.grantButtonText}>Grant Access</Text>
                    </TouchableOpacity>
                )}
            </View>
            
            {hasUsagePermission ? (
                <View style={styles.screenTimeContent}>
                    <Text style={styles.screenTimeText}>
                        {formatScreenTime(screenTime)} today
                    </Text>
                    <Text style={styles.screenTimeSubtext}>
                        {blockedAppsUsage.length > 0 
                            ? `${blockedAppsUsage.length} blocked apps used`
                            : 'No blocked apps used today'}
                    </Text>
                </View>
            ) : (
                <Text style={styles.permissionText}>
                    Grant usage access to track your screen time and app usage.
                </Text>
            )}
        </View>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.container}> 
                <Text style={styles.header}>DoomScroll Stopper</Text>
                {renderScreenTimeCard()}
                <Text style={styles.subtitle}>Stay productive, stay focused</Text>

                {/* Daily Overview Card */}
                <View style={styles.overviewCard}>
                    <View style={styles.overviewHeader}>
                        <Text style={styles.overviewIcon}>⏰</Text>
                        <Text style={styles.overviewTitle}>Daily Overview</Text>
                    </View>
                    <View style={styles.overviewStats}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{blockedApps.size}</Text>
                            <Text style={styles.statLabel}>Apps Blocked</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>2h 15m</Text>
                            <Text style={styles.statLabel}>Focus Time</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{detectedApps.length}</Text>
                            <Text style={styles.statLabel}>Interruptions</Text>
                        </View>
                    </View>
                </View>

                {/* Monitoring Control Section */}
                <View style={styles.controlSection}>
                    <View style={styles.controlHeader}>
                        <Text style={styles.controlTitle}>VPN Monitoring</Text>
                    <View style={styles.controlToggle}>
                        <Text style={styles.controlLabel}>
                            {isMonitoring ? 'Active' : 'Inactive'}
                        </Text>
                        <Switch
                            value={isMonitoring}
                            onValueChange={(value) => {
                                if (value) {
                                    checkPermissionsAndStart();
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
           </View>

            {/* Preset App Selection */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Block Apps</Text>
                <Text style={styles.sectionSubtitle}>
                    Common apps that users often want to block
                </Text>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.presetAppsContainer}
                >
                    {presetApps.map((app) => (
                        <TouchableOpacity
                            key={app.packageName}
                            style={[
                                styles.presetAppCard,
                                blockedApps.has(app.packageName) && styles.blockedPresetApp
                            ]}
                            onPress={() => {
                                toggleAppBlock(app.packageName)
                                console.log(app.packageName)
                                console.log(blockedApps)
                                console.log(blockedApps.has(app.packageName))
                            
                            }}
                        >
                            <View style={styles.presetAppIcon}>
                                <Text style={styles.presetAppIconText}>{app.icon}</Text>
                            </View>
                            <Text style={[
                                styles.presetAppName,
                                blockedApps.has(app.packageName) && styles.blockedPresetAppName
                            ]}>
                                {app.name}
                            </Text>
                            <View style={[
                                styles.presetAppStatus,
                                blockedApps.has(app.packageName) && styles.blockedPresetAppStatus
                            ]}>
                                <Text style={styles.presetAppStatusText}>
                                    {blockedApps.has(app.packageName) ? '🚫' : '✅'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Search and Add Apps */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Add More Apps</Text>
                <Text style={styles.sectionSubtitle}>
                    Search for additional apps to block
                </Text>
                
                <View style={styles.searchContainer}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for apps to block..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
                
                <View style={styles.appsList}>
                    {searchQuery.length > 0 && filteredApps.length > 0 ? (
                        <FlatList
                            data={filteredApps.slice(0, 10)}
                            renderItem={renderAppItem}
                            keyExtractor={(item) => item.packageName}
                            style={styles.flatList}
                            nestedScrollEnabled={true}
                            showsVerticalScrollIndicator={false}
                        />
                    ) : searchQuery.length > 0 && filteredApps.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyIcon}>🔍</Text>
                            <Text style={styles.emptyText}>
                                No apps found matching "{searchQuery}"
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyIcon}>💡</Text>
                            <Text style={styles.emptyText}>
                                Start typing to search for apps to block
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionsContainer}>
                    {quickActions.map((action, index) => (
                        <TouchableOpacity key={index} style={styles.actionCard}>
                            <Text style={styles.actionIcon}>{action.icon}</Text>
                            <Text style={styles.actionTitle}>{action.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Screen Time Statistics */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Screen Time Statistics</Text>
                    <TouchableOpacity 
                        style={styles.refreshButton}
                        onPress={loadScreenTimeStats}
                        disabled={isLoadingStats}
                    >
                        <Text style={styles.refreshButtonText}>
                            {isLoadingStats ? '🔄' : '🔄'}
                        </Text>
                    </TouchableOpacity>
                </View>
                
                {/* Today's Total Screen Time */}
                <View style={styles.screenTimeCard}>
                    <Text style={styles.screenTimeTitle}>Today's Total Screen Time</Text>
                    <Text style={styles.screenTimeValue}>
                        {formatScreenTime(todayScreenTime)}
                    </Text>
                </View>

                {/* Blocked Apps Usage */}
                {blockedAppsUsage.length > 0 && (
                    <View style={styles.usageSection}>
                        <Text style={styles.usageSectionTitle}>Blocked Apps Usage (Today)</Text>
                        {blockedAppsUsage.map((app, index) => (
                            <View key={index} style={styles.usageItem}>
                                <Text style={styles.usageAppName}>{app.appName}</Text>
                                <Text style={styles.usageTime}>
                                    {formatScreenTime(app.usageTime)}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Top Apps by Usage */}
                {topAppsUsage.length > 0 && (
                    <View style={styles.usageSection}>
                        <Text style={styles.usageSectionTitle}>Top Apps by Usage (24h)</Text>
                        {topAppsUsage.slice(0, 5).map((app, index) => (
                            <View key={index} style={styles.usageItem}>
                                <View style={styles.usageAppInfo}>
                                    <Text style={styles.usageAppName}>{app.appName}</Text>
                                    <Text style={styles.usagePackageName}>{app.packageName}</Text>
                                </View>
                                <Text style={styles.usageTime}>
                                    {formatScreenTime(app.usageTime)}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {!isLoadingStats && blockedAppsUsage.length === 0 && topAppsUsage.length === 0 && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>📱</Text>
                        <Text style={styles.emptyText}>
                            No usage statistics available yet
                        </Text>
                        <Text style={styles.emptySubtext}>
                            Make sure you have granted usage access permissions
                        </Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

export default Home;
