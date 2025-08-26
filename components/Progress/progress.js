import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const Progress = () => {
    const achievements = [
        { id: 1, name: 'First Focus', description: 'Complete your first focus session', icon: '🎯', unlocked: true },
        { id: 2, name: 'Week Warrior', description: 'Complete 7 days in a row', icon: '🔥', unlocked: true },
        { id: 3, name: 'Time Master', description: 'Save 10 hours of screen time', icon: '⏰', unlocked: false },
        { id: 4, name: 'Social Detox', description: 'Block 5 social media apps', icon: '🚫', unlocked: true },
        { id: 5, name: 'Focus Legend', description: 'Complete 30 focus sessions', icon: '👑', unlocked: false },
        { id: 6, name: 'Night Owl', description: 'Maintain focus after 10 PM', icon: '🦉', unlocked: false },
    ];

    const weeklyData = [
        { day: 'Mon', hours: 2.5, color: '#A8C5F0' },
        { day: 'Tue', hours: 3.2, color: '#A8C5F0' },
        { day: 'Wed', hours: 1.8, color: '#A8C5F0' },
        { day: 'Thu', hours: 4.1, color: '#A8C5F0' },
        { day: 'Fri', hours: 2.9, color: '#A8C5F0' },
        { day: 'Sat', hours: 1.5, color: '#A8C5F0' },
        { day: 'Sun', hours: 2.3, color: '#A8C5F0' },
    ];

    const maxHours = Math.max(...weeklyData.map(d => d.hours));

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Progress & Achievements</Text>
                <Text style={styles.subtitle}>Track your focus journey</Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Weekly Goal Progress</Text>
                <View style={styles.progressCard}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressLabel}>Focus Time Goal</Text>
                        <Text style={styles.progressValue}>18.3 / 20 hours</Text>
                    </View>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: '91.5%' }]} />
                    </View>
                    <Text style={styles.progressPercentage}>91.5% Complete</Text>
                </View>
            </View>

            {/* Streak Counter */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Current Streak</Text>
                <View style={styles.streakCard}>
                    <Text style={styles.streakIcon}>🔥</Text>
                    <Text style={styles.streakNumber}>12</Text>
                    <Text style={styles.streakLabel}>Days in a row</Text>
                    <Text style={styles.streakSubtext}>Keep it up! You're doing great!</Text>
                </View>
            </View>

            {/* Weekly Graph */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Weekly Focus Hours</Text>
                <View style={styles.graphCard}>
                    <View style={styles.graphContainer}>
                        {weeklyData.map((data, index) => (
                            <View key={index} style={styles.graphBar}>
                                <View 
                                    style={[
                                        styles.barFill, 
                                        { 
                                            height: `${(data.hours / maxHours) * 100}%`,
                                            backgroundColor: data.color
                                        }
                                    ]} 
                                />
                                <Text style={styles.barLabel}>{data.day}</Text>
                                <Text style={styles.barValue}>{data.hours}h</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>

            {/* Achievements Grid */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Achievements</Text>
                <View style={styles.achievementsGrid}>
                    {achievements.map((achievement) => (
                        <View key={achievement.id} style={styles.achievementCard}>
                            <View style={[
                                styles.achievementIcon,
                                { backgroundColor: achievement.unlocked ? '#A8C5F0' : '#3A3F3E' }
                            ]}>
                                <Text style={styles.achievementIconText}>{achievement.icon}</Text>
                            </View>
                            <Text style={[
                                styles.achievementName,
                                { color: achievement.unlocked ? '#DDE8F9' : '#9CA3AF' }
                            ]}>
                                {achievement.name}
                            </Text>
                            <Text style={[
                                styles.achievementDescription,
                                { color: achievement.unlocked ? '#9CA3AF' : '#6B7280' }
                            ]}>
                                {achievement.description}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Monthly Summary */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Monthly Summary</Text>
                <View style={styles.summaryCard}>
                    <View style={styles.summaryRow}>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryNumber}>67.2</Text>
                            <Text style={styles.summaryLabel}>Total Hours</Text>
                        </View>
                        <View style={styles.summaryDivider} />
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryNumber}>28</Text>
                            <Text style={styles.summaryLabel}>Sessions</Text>
                        </View>
                        <View style={styles.summaryDivider} />
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryNumber}>4.2</Text>
                            <Text style={styles.summaryLabel}>Avg. Daily</Text>
                        </View>
                    </View>
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
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#DDE8F9',
        marginBottom: 16,
    },
    progressCard: {
        backgroundColor: '#2A2F2E',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#3A3F3E',
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    progressLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#DDE8F9',
    },
    progressValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#A8C5F0',
    },
    progressBar: {
        height: 8,
        backgroundColor: '#3A3F3E',
        borderRadius: 4,
        marginBottom: 12,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#A8C5F0',
        borderRadius: 4,
    },
    progressPercentage: {
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
    },
    streakCard: {
        backgroundColor: '#2A2F2E',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#3A3F3E',
    },
    streakIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    streakNumber: {
        fontSize: 48,
        fontWeight: '700',
        color: '#A8C5F0',
        marginBottom: 8,
    },
    streakLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#DDE8F9',
        marginBottom: 8,
    },
    streakSubtext: {
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
    },
    graphCard: {
        backgroundColor: '#2A2F2E',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#3A3F3E',
    },
    graphContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 120,
    },
    graphBar: {
        alignItems: 'center',
        flex: 1,
    },
    barFill: {
        width: 20,
        borderRadius: 10,
        marginBottom: 8,
        minHeight: 4,
    },
    barLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 4,
    },
    barValue: {
        fontSize: 10,
        color: '#6B7280',
    },
    achievementsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    achievementCard: {
        backgroundColor: '#2A2F2E',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        width: '48%',
        borderWidth: 1,
        borderColor: '#3A3F3E',
    },
    achievementIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    achievementIconText: {
        fontSize: 24,
    },
    achievementName: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
        textAlign: 'center',
    },
    achievementDescription: {
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 16,
    },
    summaryCard: {
        backgroundColor: '#2A2F2E',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#3A3F3E',
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    summaryItem: {
        flex: 1,
        alignItems: 'center',
    },
    summaryNumber: {
        fontSize: 24,
        fontWeight: '700',
        color: '#A8C5F0',
        marginBottom: 4,
    },
    summaryLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        textAlign: 'center',
    },
    summaryDivider: {
        width: 1,
        height: 40,
        backgroundColor: '#3A3F3E',
        marginHorizontal: 16,
    },
});

export default Progress; 