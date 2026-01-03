import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, TextInput, NativeModules, Alert } from 'react-native';

const { VPNModule, SettingsModule } = NativeModules;

const Customize = () => {
    const [delayTime, setDelayTime] = useState(15);
    const [selectedFocusMode, setSelectedFocusMode] = useState('study');
    const [delayMessage, setDelayMessage] = useState('Take a moment to consider if you really need this app right now');
    
    // CRITICAL: This state controls whether app monitoring is active
    // When true, the AppUsageMonitor polls foreground apps and shows overlay for blocked apps
    const [isMonitoringEnabled, setIsMonitoringEnabled] = useState(false);
    
    const [blockedApps, setBlockedApps] = useState({
        'com.instagram.android': true,
        'com.google.android.youtube': true,
        'com.zhiliaoapp.musically': true,
        'com.facebook.katana': true,
        'com.twitter.android': true,
        'com.snapchat.android': false,
        'com.whatsapp': false,
        'com.google.android.youtube': true,
    });

    // Load blocked apps from native storage on mount
    useEffect(() => {
        const loadBlockedApps = async () => {
            console.log('[Customize] useEffect: loading blocked apps from native storage');
            try {
                const savedApps = await new Promise((resolve, reject) => {
                    SettingsModule.getBlockedApps((apps) => {
                        console.log('[Customize] getBlockedApps callback apps=', apps);
                        if (apps) {
                            resolve(apps);
                        } else {
                            reject('No apps returned');
                        }
                    });
                });
                
                if (savedApps && savedApps.length > 0) {
                    const appMap = {};
                    savedApps.forEach(packageName => {
                        appMap[packageName] = true;
                    });
                    console.log('[Customize] loaded', Object.keys(appMap).length, 'blocked apps from storage');
                    setBlockedApps(appMap);
                } else {
                    console.log('[Customize] no saved blocked apps found');
                }
            } catch (error) {
                console.log('[Customize] loadBlockedApps failed:', error);
            }
        };
        
        loadBlockedApps();
    }, []);

    const focusModes = [
        {
            id: 'study',
            name: 'Study Mode',
            description: 'Blocks social media and entertainment apps',
            icon: '📚',
            color: '#5B9A8B'
        },
        {
            id: 'work',
            name: 'Work Mode',
            description: 'Blocks gaming and social apps during work hours',
            icon: '💼',
            color: '#5B9A8B'
        },
        {
            id: 'sleep',
            name: 'Sleep Mode',
            description: 'Blocks all non-essential apps after 10 PM',
            icon: '🌙',
            color: '#5B9A8B'
        },
        {
            id: 'custom',
            name: 'Custom Mode',
            description: 'Create your own blocking rules',
            icon: '⚙️',
            color: '#5B9A8B'
        }
    ];

    const appList = [
        { packageName: 'com.instagram.android', name: 'Instagram', icon: '📷' },
        { packageName: 'com.google.android.youtube', name: 'YouTube', icon: '▶️' },
        { packageName: 'com.zhiliaoapp.musically', name: 'TikTok', icon: '🎵' },
        { packageName: 'com.facebook.katana', name: 'Facebook', icon: '📘' },
        { packageName: 'com.twitter.android', name: 'Twitter', icon: '🐦' },
        { packageName: 'com.snapchat.android', name: 'Snapchat', icon: '👻' },
        { packageName: 'com.whatsapp', name: 'WhatsApp', icon: '💬' },
        { packageName: 'com.reddit.frontpage', name: 'Reddit', icon: '🤖' },
        { packageName: 'com.spotify.music', name: 'Spotify', icon: '🎵' },
        { packageName: 'com.google.android.youtube', name: 'YouTube', icon: '▶️' },
    ];

    const toggleAppBlock = async (packageName) => {
        console.log('[Customize] toggleAppBlock package=', packageName, 'current=', !!blockedApps[packageName]);
        const newBlockedApps = {
            ...blockedApps,
            [packageName]: !blockedApps[packageName]
        };
        setBlockedApps(newBlockedApps);
        
        // Get the list of blocked apps
        const blockedAppsList = Object.keys(newBlockedApps).filter(pkg => newBlockedApps[pkg]);
        console.log('[Customize] blockedAppsList after toggle:', blockedAppsList);
        
        try {
            console.log('[Customize] saving to SettingsModule...');
            SettingsModule.saveBlockedApps(blockedAppsList);
            console.log('[Customize] calling VPNModule.setBlockedApps...');
            await VPNModule.setBlockedApps(blockedAppsList);
            console.log('[Customize] updated blocked apps OK');
        } catch (error) {
            console.error('[Customize] Failed to update blocked apps:', error);
        }
    };

    const handleSaveChanges = async () => {
        console.log('[Customize] handleSaveChanges start');
        const blockedAppsList = Object.keys(blockedApps).filter(pkg => blockedApps[pkg]);
        console.log('[Customize] handleSaveChanges blockedAppsList=', blockedAppsList);
        
        try {
            SettingsModule.saveBlockedApps(blockedAppsList);
            console.log('[Customize] SettingsModule.saveBlockedApps done');
            await VPNModule.setBlockedApps(blockedAppsList);
            console.log('[Customize] VPNModule.setBlockedApps done');
            console.log('[Customize] settings saved:', { delayTime, selectedFocusMode, delayMessage, blockedApps: blockedAppsList });
            Alert.alert('Success', 'Settings saved successfully!');
        } catch (error) {
            console.error('[Customize] Failed to save settings:', error);
            Alert.alert('Error', 'Failed to save settings: ' + error.message);
        }
    };

    const handleDelayTimeChange = (text) => {
        const value = parseInt(text, 10) || 15;
        setDelayTime(Math.max(5, Math.min(120, value)));
    };

    /**
     * CRITICAL: Toggle monitoring on/off
     * This starts/stops the AppUsageMonitor which:
     * 1. Polls foreground app every 1 second
     * 2. Detects when a blocked app is opened
     * 3. Shows the delay overlay popup
     * 
     * Without calling startMonitoring(), no overlay will ever appear!
     */
    const toggleMonitoring = async () => {
        console.log('[Customize] toggleMonitoring called, current state:', isMonitoringEnabled);
        
        if (!isMonitoringEnabled) {
            // Starting monitoring - check permissions first
            try {
                console.log('[Customize] Checking permissions...');
                const perms = await VPNModule.checkPermissions();
                console.log('[Customize] Permissions:', perms);
                
                if (!perms.usage) {
                    console.log('[Customize] Missing usage permission, requesting...');
                    Alert.alert(
                        'Permission Required',
                        'Usage Access permission is needed to detect which apps you open. Please grant this permission.',
                        [{ text: 'Open Settings', onPress: () => VPNModule.requestPermissions() }]
                    );
                    return;
                }
                
                if (!perms.overlay) {
                    console.log('[Customize] Missing overlay permission, requesting...');
                    Alert.alert(
                        'Permission Required', 
                        'Overlay permission is needed to show the delay popup. Please grant this permission.',
                        [{ text: 'Open Settings', onPress: () => VPNModule.requestOverlayPermission() }]
                    );
                    return;
                }
                
                // Both permissions granted, start monitoring
                console.log('[Customize] Starting monitoring...');
                await VPNModule.startMonitoring();
                setIsMonitoringEnabled(true);
                console.log('[Customize] Monitoring started successfully!');
                Alert.alert('Success', 'App blocking is now active! When you open a blocked app, a delay screen will appear.');
                
            } catch (error) {
                console.error('[Customize] Failed to start monitoring:', error);
                Alert.alert('Error', 'Failed to start monitoring: ' + error.message);
            }
        } else {
            // Stopping monitoring
            try {
                console.log('[Customize] Stopping monitoring...');
                await VPNModule.stopMonitoring();
                setIsMonitoringEnabled(false);
                console.log('[Customize] Monitoring stopped');
                Alert.alert('Info', 'App blocking is now disabled.');
            } catch (error) {
                console.error('[Customize] Failed to stop monitoring:', error);
                Alert.alert('Error', 'Failed to stop monitoring: ' + error.message);
            }
        }
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Customize Settings</Text>
                <Text style={styles.subtitle}>Personalize your focus experience</Text>
            </View>

            {/* CRITICAL: Monitoring Toggle - Must be ON for blocking to work! */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>🛡️ App Blocking</Text>
                <View style={styles.monitoringToggle}>
                    <View style={styles.monitoringInfo}>
                        <Text style={styles.monitoringTitle}>
                            {isMonitoringEnabled ? '✅ Blocking Active' : '⚠️ Blocking Inactive'}
                        </Text>
                        <Text style={styles.monitoringSubtitle}>
                            {isMonitoringEnabled 
                                ? 'Opening blocked apps will show a delay screen' 
                                : 'Turn on to start blocking selected apps'}
                        </Text>
                    </View>
                    <Switch
                        value={isMonitoringEnabled}
                        onValueChange={toggleMonitoring}
                        trackColor={{ false: '#3A3F3E', true: '#5B9A8B' }}
                        thumbColor={isMonitoringEnabled ? '#8DBBA3' : '#9CA3AF'}
                    />
                </View>
            </View>

            {/* App Selector */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Select Apps to Block</Text>
                <View style={styles.appsContainer}>
                    {appList.map((app) => (
                        <View key={app.packageName} style={styles.appItem}>
                            <View style={styles.appInfo}>
                                <Text style={styles.appIcon}>{app.icon}</Text>
                                <Text style={styles.appName}>{app.name}</Text>
                            </View>
                            <Switch
                                value={blockedApps[app.packageName] || false}
                                onValueChange={() => toggleAppBlock(app.packageName)}
                                trackColor={{ false: '#3A3F3E', true: '#5B9A8B' }}
                                thumbColor={blockedApps[app.packageName] ? '#8DBBA3' : '#9CA3AF'}
                            />
                        </View>
                    ))}
                </View>
            </View>

            {/* Delay Time Input */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Delay Time</Text>
                <View style={styles.sliderContainer}>
                    <Text style={styles.delayValue}>{delayTime} seconds</Text>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Enter delay time (5-120 seconds):</Text>
                        <TextInput
                            style={styles.delayInput}
                            value={delayTime.toString()}
                            onChangeText={handleDelayTimeChange}
                            keyboardType="numeric"
                            placeholder="15"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                    <View style={styles.sliderLabels}>
                        <Text style={styles.sliderLabel}>5s</Text>
                        <Text style={styles.sliderLabel}>120s</Text>
                    </View>
                </View>
            </View>

            {/* Focus Modes */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Focus Modes</Text>
                <View style={styles.focusModesContainer}>
                    {focusModes.map((mode) => (
                        <TouchableOpacity
                            key={mode.id}
                            style={[
                                styles.focusModeCard,
                                selectedFocusMode === mode.id && styles.selectedFocusMode
                            ]}
                            onPress={() => setSelectedFocusMode(mode.id)}
                        >
                            <View style={[styles.modeIcon, { backgroundColor: mode.color + '20' }]}>
                                <Text style={styles.modeIconText}>{mode.icon}</Text>
                            </View>
                            <View style={styles.modeContent}>
                                <Text style={[
                                    styles.modeName,
                                    selectedFocusMode === mode.id && styles.selectedModeName
                                ]}>
                                    {mode.name}
                                </Text>
                                <Text style={styles.modeDescription}>{mode.description}</Text>
                            </View>
                            {selectedFocusMode === mode.id && (
                                <Text style={styles.checkmark}>✅</Text>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Delay Screen Message Editor */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Delay Screen Message</Text>
                <View style={styles.messageContainer}>
                    <TextInput
                        style={styles.messageInput}
                        value={delayMessage}
                        onChangeText={setDelayMessage}
                        placeholder="Enter your custom message..."
                        placeholderTextColor="#9CA3AF"
                        multiline
                        numberOfLines={3}
                        maxLength={200}
                    />
                    <Text style={styles.characterCount}>{delayMessage.length}/200</Text>
                </View>
            </View>

            {/* Save Changes Button */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
                <Text style={styles.saveButtonIcon}>✅</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

// Tokenized styles
const tokens = require('../../design/tokens').default;
const { dark, spacing, radii, typography, colors, shadows } = tokens;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: dark.background,
        paddingHorizontal: spacing.md,
    },
    header: {
        paddingTop: spacing.lg,
        paddingBottom: spacing.xl,
    },
    title: {
        fontSize: typography.h2.size,
        fontWeight: '600',
        color: dark.textPrimary,
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: typography.body.size,
        color: dark.textSecondary,
    },
    section: {
        marginBottom: spacing.xxl,
    },
    sectionTitle: {
        fontSize: typography.h3.size,
        fontWeight: '600',
        color: dark.textPrimary,
        marginBottom: spacing.md,
    },
    // Monitoring toggle styles - CRITICAL UI element!
    monitoringToggle: {
        backgroundColor: dark.surface,
        borderRadius: radii.lg,
        padding: spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 2,
        borderColor: colors.primary,
    },
    monitoringInfo: {
        flex: 1,
        marginRight: spacing.md,
    },
    monitoringTitle: {
        fontSize: typography.h3.size,
        fontWeight: '600',
        color: dark.textPrimary,
        marginBottom: spacing.xs,
    },
    monitoringSubtitle: {
        fontSize: typography.caption.size,
        color: dark.textSecondary,
    },
    appsContainer: {
        backgroundColor: dark.surface,
        borderRadius: radii.lg,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: dark.divider,
    },
    appItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: dark.divider,
    },
    appInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    appIcon: {
        fontSize: 24,
        marginRight: spacing.lg,
    },
    appName: {
        fontSize: typography.body.size,
        fontWeight: '500',
        color: dark.textPrimary,
    },
    sliderContainer: {
        backgroundColor: dark.surface,
        borderRadius: radii.lg,
        padding: spacing.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: dark.divider,
    },
    delayValue: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.primary500,
        marginBottom: spacing.md,
    },
    inputContainer: {
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    inputLabel: {
        fontSize: typography.bodySmall.size,
        color: dark.textSecondary,
        marginBottom: spacing.sm,
    },
    delayInput: {
        borderWidth: 1,
        borderColor: dark.divider,
        borderRadius: radii.sm,
        padding: spacing.md,
        fontSize: typography.body.size,
        textAlign: 'center',
        minWidth: 80,
        backgroundColor: dark.background,
        color: dark.textPrimary,
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: spacing.sm,
    },
    sliderLabel: {
        fontSize: typography.bodySmall.size,
        color: dark.textSecondary,
    },
    focusModesContainer: {
        // spacing handled by child margins
    },
    focusModeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: dark.surface,
        borderRadius: radii.lg,
        padding: spacing.md,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedFocusMode: {
        borderColor: colors.primary500,
        backgroundColor: dark.surface,
    },
    modeIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.lg,
    },
    modeIconText: {
        fontSize: 24,
    },
    modeContent: {
        flex: 1,
    },
    modeName: {
        fontSize: typography.body.size,
        fontWeight: '600',
        color: dark.textPrimary,
        marginBottom: spacing.xs,
    },
    selectedModeName: {
        color: colors.primary500,
    },
    modeDescription: {
        fontSize: typography.bodySmall.size,
        color: dark.textSecondary,
        lineHeight: typography.bodySmall.lineHeight,
    },
    checkmark: {
        fontSize: 24,
    },
    messageContainer: {
        backgroundColor: dark.surface,
        borderRadius: radii.lg,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: dark.divider,
    },
    messageInput: {
        fontSize: typography.body.size,
        color: dark.textPrimary,
        textAlignVertical: 'top',
        minHeight: 80,
        padding: 0,
    },
    characterCount: {
        fontSize: typography.caption.size,
        color: dark.textSecondary,
        textAlign: 'right',
        marginTop: spacing.sm,
    },
    saveButton: {
        backgroundColor: colors.primary500,
        borderRadius: radii.lg,
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.xl,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xxl,
        ...shadows.lg,
    },
    saveButtonText: {
        color: dark.background,
        fontSize: typography.body.size,
        fontWeight: '600',
        marginRight: spacing.sm,
    },
    saveButtonIcon: {
        fontSize: 20,
    },
});

export default Customize; 