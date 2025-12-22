import React, { useState, useEffect, useCallback, useRef } from 'react';
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

    // Lightweight cache with TTL for native data to reduce redundant calls
    const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
    const cacheRef = useRef({
        installedApps: { data: [], timestamp: 0 },
        screenTimeStats: { data: null, timestamp: 0 },
        blockedUsage: { data: [], timestamp: 0 },
        topApps: { data: [], timestamp: 0 },
    });

    // Debounce restartMonitoring on app resume to avoid rapid stop/start
    const restartDebounceRef = useRef(null);

    // Preset apps that users commonly want to block
    const presetApps = [
        { packageName: 'com.instagram.android', name: 'Instagram', icon: '📷', description: 'Social media platform' },
        { packageName: 'com.google.android.youtube', name: 'YouTube', icon: '▶️', description: 'Video streaming' },
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
            const now = Date.now();
            // Screen time stats with TTL cache
            let stats = null;
            if (cacheRef.current.screenTimeStats.data && (now - cacheRef.current.screenTimeStats.timestamp) < CACHE_TTL_MS) {
                stats = cacheRef.current.screenTimeStats.data;
            } else {
                stats = await VPNModule.getScreenTimeStats();
                cacheRef.current.screenTimeStats = { data: stats, timestamp: now };
            }
            if (stats) {
                setScreenTime(stats.totalScreenTime || 0);
            }

            // Load blocked apps usage with TTL cache
            let blockedUsage = null;
            if (cacheRef.current.blockedUsage.data && (now - cacheRef.current.blockedUsage.timestamp) < CACHE_TTL_MS) {
                blockedUsage = cacheRef.current.blockedUsage.data;
            } else {
                blockedUsage = await VPNModule.getBlockedAppsUsageStats();
                cacheRef.current.blockedUsage = { data: blockedUsage, timestamp: now };
            }
            if (blockedUsage) {
                setBlockedAppsUsage(blockedUsage);
            }

            // Load top apps usage with TTL cache
            const endTime = now;
            const startTime = endTime - (24 * 60 * 60 * 1000); // Last 24 hours
            let topApps = null;
            if (cacheRef.current.topApps.data && (now - cacheRef.current.topApps.timestamp) < CACHE_TTL_MS) {
                topApps = cacheRef.current.topApps.data;
            } else {
                topApps = await VPNModule.getTopAppsByUsage(startTime, endTime, 5);
                cacheRef.current.topApps = { data: topApps, timestamp: now };
            }
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
                
                let blockedSet = new Set(savedBlockedApps || []);

                // Ensure core defaults are present for quick testing coverage
                let hasUpdates = false;
                ['com.instagram.android', 'com.google.android.youtube'].forEach((pkg) => {
                    if (!blockedSet.has(pkg)) {
                        blockedSet.add(pkg);
                        hasUpdates = true;
                    }
                });

                if (hasUpdates) {
                    SettingsModule.saveBlockedApps(Array.from(blockedSet));
                }
                
                setBlockedApps(blockedSet);
        
                // Load installed apps and screen time stats
                await Promise.all([
                    loadInstalledApps(),
                    loadScreenTimeStats()
                ]);
                
                // Auto-start monitoring
                startMonitoringWithApps(blockedSet);
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

        // POPUP_MARKER_FRONTEND: popup/overlay event surfaced from native
        const blockedListener = appBlockerEmitter.addListener(
            'onBlockedAppOpened',
            (event) => {
                console.log('POPUP_MARKER_FRONTEND blocked app overlay event', event);
            }
        );

        // Monitor app state changes
        const appStateListener = AppState.addEventListener('change', (nextAppState) => {
            setAppState(prevState => {
                if (prevState.match(/inactive|background/) && nextAppState === 'active' && isMonitoring) {
                    console.log('Restarting monitoring after app resume (debounced)');
                    debouncedRestartMonitoring();
                }
                return nextAppState;
            });
        });

        return () => {
            detectionListener.remove();
            blockedListener.remove();
            appStateListener?.remove();
            if (restartDebounceRef.current) {
                clearTimeout(restartDebounceRef.current);
            }
        };
    }, [isMonitoring, loadScreenTimeStats]);

    // Minimal stubs for functions that live in VPNSwitch; these are small passthroughs
    // kept here to avoid cross-file refactor during styling-only changes.
    const loadInstalledApps = async () => {
        try {
            const now = Date.now();
            if (cacheRef.current.installedApps.data.length > 0 && (now - cacheRef.current.installedApps.timestamp) < CACHE_TTL_MS) {
                setInstalledApps(cacheRef.current.installedApps.data);
                return;
            }
            const apps = await VPNModule.getInstalledApps();
            const list = apps || [];
            cacheRef.current.installedApps = { data: list, timestamp: now };
            setInstalledApps(list);
        } catch (e) {
            console.warn('loadInstalledApps failed', e);
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
            console.warn('restartMonitoring failed', e);
        }
    };

    const debouncedRestartMonitoring = useCallback(() => {
        if (restartDebounceRef.current) {
            clearTimeout(restartDebounceRef.current);
        }
        restartDebounceRef.current = setTimeout(() => {
            restartMonitoring();
        }, 1000);
    }, [restartMonitoring]);

    const startMonitoringWithApps = async (apps) => {
        try {
            if (apps && apps.size > 0) {
                await VPNModule.setBlockedApps(Array.from(apps));
                await VPNModule.startMonitoring();
                setIsMonitoring(true);
                console.log('Monitoring started with apps:', Array.from(apps));
            }
        } catch (error) {
            console.error('Failed to start monitoring:', error);
        }
    };

    const openPermissionsSettings = async () => {
        try {
            if (Platform.OS === 'android') {
                await VPNModule.openPermissionsSettings();
            }
        } catch (error) {
            console.error('Error opening permissions settings:', error);
            Alert.alert('Error', 'Could not open permissions settings');
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

                    {/* Permissions Button */}
                    <TouchableOpacity style={styles.permissionsButton} onPress={openPermissionsSettings}>
                        <Text style={styles.permissionsIcon}>🔐</Text>
                        <View style={styles.permissionsContent}>
                            <Text style={styles.permissionsTitle}>Grant Permissions</Text>
                            <Text style={styles.permissionsSubtitle}>Enable Usage Access & Overlay permissions</Text>
                        </View>
                        <Text style={styles.permissionsArrow}>›</Text>
                    </TouchableOpacity>

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

// 


// TO-DO : Implement missing functionalities such as actual data fetching, event handling, and navigation as needed.
