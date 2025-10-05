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
        fontWeight: '700',
        color: dark.textPrimary,
        marginBottom: spacing.xs,
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
    progressCard: {
        backgroundColor: dark.surface,
        borderRadius: radii.lg,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: dark.divider,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    progressLabel: {
        fontSize: typography.body.size,
        fontWeight: '500',
        color: dark.textPrimary,
    },
    progressValue: {
        fontSize: typography.body.size,
        fontWeight: '600',
        color: colors.primary300,
    },
    progressBar: {
        height: 8,
        backgroundColor: dark.divider,
        borderRadius: 4,
        marginBottom: spacing.sm,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.primary300,
        borderRadius: 4,
    },
    progressPercentage: {
        fontSize: typography.bodySmall.size,
        color: dark.textSecondary,
        textAlign: 'center',
    },
    streakCard: {
        backgroundColor: dark.surface,
        borderRadius: radii.lg,
        padding: spacing.xl,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: dark.divider,
    },
    streakIcon: {
        fontSize: 48,
        marginBottom: spacing.md,
    },
    streakNumber: {
        fontSize: 48,
        fontWeight: '700',
        color: colors.primary300,
        marginBottom: spacing.sm,
    },
    streakLabel: {
        fontSize: typography.h3.size,
        fontWeight: '600',
        color: dark.textPrimary,
        marginBottom: spacing.sm,
    },
    streakSubtext: {
        fontSize: typography.bodySmall.size,
        color: dark.textSecondary,
        textAlign: 'center',
    },
    graphCard: {
        backgroundColor: dark.surface,
        borderRadius: radii.lg,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: dark.divider,
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
        marginBottom: spacing.md,
        minHeight: 4,
    },
    barLabel: {
        fontSize: typography.caption.size,
        color: dark.textSecondary,
        marginBottom: spacing.sm,
    },
    barValue: {
        fontSize: typography.overline.size,
        color: colors.gray500,
    },
    achievementsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        // spacing via child margins
    },
    achievementCard: {
        backgroundColor: dark.surface,
        borderRadius: radii.lg,
        padding: spacing.md,
        alignItems: 'center',
        width: '48%',
        borderWidth: 1,
        borderColor: dark.divider,
    },
    achievementIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    achievementIconText: {
        fontSize: 24,
    },
    achievementName: {
        fontSize: typography.bodySmall.size,
        fontWeight: '600',
        marginBottom: spacing.xs,
        textAlign: 'center',
        color: dark.textPrimary,
    },
    achievementDescription: {
        fontSize: typography.caption.size,
        textAlign: 'center',
        lineHeight: typography.caption.lineHeight || 16,
        color: dark.textSecondary,
    },
    summaryCard: {
        backgroundColor: dark.surface,
        borderRadius: radii.lg,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: dark.divider,
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
        color: colors.primary300,
        marginBottom: spacing.xs,
    },
    summaryLabel: {
        fontSize: typography.caption.size,
        color: dark.textSecondary,
        textAlign: 'center',
    },
    summaryDivider: {
        width: 1,
        height: 40,
        backgroundColor: dark.divider,
        marginHorizontal: spacing.md,
    },
});

export default Progress; 