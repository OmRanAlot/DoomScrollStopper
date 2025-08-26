import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const Home = () => {
    const blockedApps = [
        { name: 'Instagram', icon: '📷', blocked: true },
        { name: 'TikTok', icon: '🎵', blocked: true },
        { name: 'Facebook', icon: '📘', blocked: true },
        { name: 'Twitter', icon: '🐦', blocked: false },
        { name: 'Snapchat', icon: '👻', blocked: false },
    ];

    const quickActions = [
        { title: 'Start Focus Session', icon: '🎯', action: 'focus' },
        { title: 'View Statistics', icon: '📊', action: 'stats' },
        { title: 'Emergency Override', icon: '🚨', action: 'override' },
    ];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Focus Dashboard</Text>
                <Text style={styles.subtitle}>Stay productive, stay focused</Text>
            </View>

            {/* Daily Overview Card */}
            <View style={styles.overviewCard}>
                <View style={styles.overviewHeader}>
                    <Text style={styles.overviewIcon}>⏰</Text>
                    <Text style={styles.overviewTitle}>Daily Overview</Text>
                </View>
                <View style={styles.overviewStats}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>3</Text>
                        <Text style={styles.statLabel}>Apps Blocked</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>2h 15m</Text>
                        <Text style={styles.statLabel}>Focus Time</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>8</Text>
                        <Text style={styles.statLabel}>Interruptions</Text>
                    </View>
                </View>
            </View>

            {/* Blocked Apps List */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Currently Blocked</Text>
                <View style={styles.appsContainer}>
                    {blockedApps.map((app, index) => (
                        <View key={index} style={[
                            styles.appChip,
                            app.blocked && styles.blockedAppChip
                        ]}>
                            <Text style={styles.appIcon}>{app.icon}</Text>
                            <Text style={[
                                styles.appName,
                                app.blocked && styles.blockedAppName
                            ]}>
                                {app.name}
                            </Text>
                            {app.blocked && (
                                <Text style={styles.blockedBadge}>🚫</Text>
                            )}
                        </View>
                    ))}
                </View>
            </View>

            {/* Delay Settings Preview */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Current Delay Settings</Text>
                <View style={styles.delayCard}>
                    <View style={styles.delayInfo}>
                        <Text style={styles.delayIcon}>⏱️</Text>
                        <View style={styles.delayText}>
                            <Text style={styles.delayTitle}>Delay Time</Text>
                            <Text style={styles.delayValue}>15 seconds</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.adjustButton}>
                        <Text style={styles.adjustButtonText}>Adjust</Text>
                    </TouchableOpacity>
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
        fontSize: 28,
        fontWeight: '700',
        color: '#DDE8F9',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#9CA3AF',
    },
    overviewCard: {
        backgroundColor: '#2A2F2E',
        borderRadius: 20,
        padding: 24,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: '#3A3F3E',
    },
    overviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    overviewIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    overviewTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#DDE8F9',
    },
    overviewStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '700',
        color: '#A8C5F0',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        textAlign: 'center',
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
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    appChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2A2F2E',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#3A3F3E',
    },
    blockedAppChip: {
        backgroundColor: '#3A2F2E',
        borderColor: '#A8C5F0',
    },
    appIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    appName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#9CA3AF',
    },
    blockedAppName: {
        color: '#DDE8F9',
    },
    blockedBadge: {
        fontSize: 12,
        marginLeft: 8,
    },
    delayCard: {
        backgroundColor: '#2A2F2E',
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#3A3F3E',
    },
    delayInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    delayIcon: {
        fontSize: 24,
        marginRight: 16,
    },
    delayText: {
        flex: 1,
    },
    delayTitle: {
        fontSize: 14,
        color: '#9CA3AF',
        marginBottom: 4,
    },
    delayValue: {
        fontSize: 18,
        fontWeight: '600',
        color: '#DDE8F9',
    },
    adjustButton: {
        backgroundColor: '#A8C5F0',
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    adjustButtonText: {
        color: '#1D201F',
        fontSize: 14,
        fontWeight: '600',
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    actionCard: {
        backgroundColor: '#2A2F2E',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        flex: 1,
        borderWidth: 1,
        borderColor: '#3A3F3E',
    },
    actionIcon: {
        fontSize: 32,
        marginBottom: 12,
    },
    actionTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#DDE8F9',
        textAlign: 'center',
    },
});

export default Home;
