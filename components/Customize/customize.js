import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, TextInput } from 'react-native';

const Customize = () => {
    const [delayTime, setDelayTime] = useState(15);
    const [selectedFocusMode, setSelectedFocusMode] = useState('study');
    const [delayMessage, setDelayMessage] = useState('Take a moment to consider if you really need this app right now');
    const [blockedApps, setBlockedApps] = useState({
        'com.instagram.android': true,
        'com.zhiliaoapp.musically': true,
        'com.facebook.katana': true,
        'com.twitter.android': true,
        'com.snapchat.android': false,
        'com.whatsapp': false,
    });

    const focusModes = [
        {
            id: 'study',
            name: 'Study Mode',
            description: 'Blocks social media and entertainment apps',
            icon: '📚',
            color: '#A8C5F0'
        },
        {
            id: 'work',
            name: 'Work Mode',
            description: 'Blocks gaming and social apps during work hours',
            icon: '💼',
            color: '#A8C5F0'
        },
        {
            id: 'sleep',
            name: 'Sleep Mode',
            description: 'Blocks all non-essential apps after 10 PM',
            icon: '🌙',
            color: '#A8C5F0'
        },
        {
            id: 'custom',
            name: 'Custom Mode',
            description: 'Create your own blocking rules',
            icon: '⚙️',
            color: '#A8C5F0'
        }
    ];

    const appList = [
        { packageName: 'com.instagram.android', name: 'Instagram', icon: '📷' },
        { packageName: 'com.zhiliaoapp.musically', name: 'TikTok', icon: '🎵' },
        { packageName: 'com.facebook.katana', name: 'Facebook', icon: '📘' },
        { packageName: 'com.twitter.android', name: 'Twitter', icon: '🐦' },
        { packageName: 'com.snapchat.android', name: 'Snapchat', icon: '👻' },
        { packageName: 'com.whatsapp', name: 'WhatsApp', icon: '💬' },
        { packageName: 'com.reddit.frontpage', name: 'Reddit', icon: '🤖' },
        { packageName: 'com.spotify.music', name: 'Spotify', icon: '🎵' },
    ];

    const toggleAppBlock = (packageName) => {
        setBlockedApps(prev => ({
            ...prev,
            [packageName]: !prev[packageName]
        }));
    };

    const handleSaveChanges = () => {
        // Here you would typically save the settings to storage
        console.log('Saving changes:', { delayTime, selectedFocusMode, delayMessage, blockedApps });
    };

    const handleDelayTimeChange = (text) => {
        const value = parseInt(text) || 15;
        setDelayTime(Math.max(5, Math.min(120, value)));
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Customize Settings</Text>
                <Text style={styles.subtitle}>Personalize your focus experience</Text>
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
                                trackColor={{ false: '#3A3F3E', true: '#A8C5F0' }}
                                thumbColor={blockedApps[app.packageName] ? '#DDE8F9' : '#9CA3AF'}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1D201F',
        paddingHorizontal: 16,
    },
    header: {
        paddingTop: 24,
        paddingBottom: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#DDE8F9',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#9CA3AF',
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#DDE8F9',
        marginBottom: 16,
    },
    appsContainer: {
        backgroundColor: '#2A2F2E',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#3A3F3E',
    },
    appItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#3A3F3E',
    },
    appInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    appIcon: {
        fontSize: 24,
        marginRight: 16,
    },
    appName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#DDE8F9',
    },
    sliderContainer: {
        backgroundColor: '#2A2F2E',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#3A3F3E',
    },
    delayValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#A8C5F0',
        marginBottom: 16,
    },
    inputContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        color: '#9CA3AF',
        marginBottom: 8,
    },
    delayInput: {
        borderWidth: 1,
        borderColor: '#3A3F3E',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        textAlign: 'center',
        minWidth: 80,
        backgroundColor: '#1D201F',
        color: '#DDE8F9',
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 8,
    },
    sliderLabel: {
        fontSize: 14,
        color: '#9CA3AF',
    },
    focusModesContainer: {
        gap: 12,
    },
    focusModeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2A2F2E',
        borderRadius: 16,
        padding: 16,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedFocusMode: {
        borderColor: '#A8C5F0',
        backgroundColor: '#2A2F2E',
    },
    modeIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    modeIconText: {
        fontSize: 24,
    },
    modeContent: {
        flex: 1,
    },
    modeName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#DDE8F9',
        marginBottom: 4,
    },
    selectedModeName: {
        color: '#A8C5F0',
    },
    modeDescription: {
        fontSize: 14,
        color: '#9CA3AF',
        lineHeight: 20,
    },
    checkmark: {
        fontSize: 24,
    },
    messageContainer: {
        backgroundColor: '#2A2F2E',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#3A3F3E',
    },
    messageInput: {
        fontSize: 16,
        color: '#DDE8F9',
        textAlignVertical: 'top',
        minHeight: 80,
        padding: 0,
    },
    characterCount: {
        fontSize: 12,
        color: '#9CA3AF',
        textAlign: 'right',
        marginTop: 8,
    },
    saveButton: {
        backgroundColor: '#A8C5F0',
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        shadowColor: '#A8C5F0',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    saveButtonText: {
        color: '#1D201F',
        fontSize: 16,
        fontWeight: '600',
        marginRight: 8,
    },
    saveButtonIcon: {
        fontSize: 20,
    },
});

export default Customize; 