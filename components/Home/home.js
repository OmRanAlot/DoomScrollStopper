import React, { useState, useEffect, useCallback } from 'react';
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

    const checkUsagePermission = useCallback(async () => {
        try {
            const hasPermission = await VPNModule.isUsageAccessGranted();
            setHasUsagePermission(hasPermission);
            return hasPermission;
        } catch (error) {
            console.error('Error checking usage permission:', error);
            return false;
        }
    }, []);

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

    const loadScreenTimeStats = useCallback(async () => {
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
    }, [checkUsagePermission]);

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
    }, [isMonitoring, loadScreenTimeStats]);

    // Minimal stubs for functions that live in VPNSwitch; these are small passthroughs
    // kept here to avoid cross-file refactor during styling-only changes.
    const loadInstalledApps = async () => {
        try {
            const apps = await VPNModule.getInstalledApps();
            setInstalledApps(apps || []);
        } catch (e) {
            console.warn('loadInstalledApps stub failed', e);
        }
    };

    const addDetectedApp = (appInfo) => {
        setDetectedApps(prev => [appInfo, ...prev.slice(0, 9)]);
    };

    const restartMonitoring = async () => {
        try {
            await VPNModule.stopMonitoring();
            setTimeout(async () => {
                await VPNModule.startMonitoring();
            }, 800);
        } catch (e) {
            console.warn('restartMonitoring stub failed', e);
        }
    };

    // Render the Home screen matching the provided mock (styling/layout only)
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.appWrapper}>
                <View style={styles.topHeader}>
                    <Text style={styles.logo}>🍃</Text>
                    <Text style={styles.appTitle}>MindfulScroll</Text>
                </View>

                <View style={styles.content}>
                    {/* Daily Statistics Card */}
                    <View style={styles.cardLarge}>
                        <Text style={styles.cardTitle}>Daily Statistics</Text>
                        <View style={styles.statsRow}>
                            <View style={styles.statCol}>
                                <Text style={styles.statLabel}>Total Time Scrolled</Text>
                                <Text style={styles.statValue}>2h 30m</Text>
                            </View>
                            <View style={styles.statCol}>
                                <Text style={styles.statLabel}>Avg Session Length</Text>
                                <Text style={styles.statValue}>15m</Text>
                            </View>
                        </View>
                        <View style={styles.statsRow}>
                            <View style={styles.statCol}>
                                <Text style={styles.statLabel}>Sessions Respected</Text>
                                <Text style={styles.statValue}>8</Text>
                            </View>
                            <View style={styles.statCol}>
                                <Text style={styles.statLabel}>Sessions Ignored</Text>
                                <Text style={styles.statValue}>2</Text>
                            </View>
                        </View>
                    </View>

                    {/* Mood Trend */}
                    <View style={styles.cardLarge}>
                        <Text style={styles.cardTitle}>Mood Trend</Text>
                        <View style={styles.chartPlaceholder} />
                    </View>

                    {/* Streak Tracker */}
                    <View style={styles.cardSmall}>
                        <Text style={styles.cardTitle}>Streak Tracker</Text>
                        <Text style={styles.cardText}>3 days in a row you respected your session goals!</Text>
                    </View>

                    {/* Footer CTA */}
                    <TouchableOpacity style={styles.footerButton}>
                        <Text style={styles.footerText}>Keep up the great work!</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

export default Home;
