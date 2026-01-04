import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import TopBar from '../TopBar/TopBar';
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
        { day: 'Mon', hours: 2.5, color: '#5B9A8B' },
        { day: 'Tue', hours: 3.2, color: '#5B9A8B' },
        { day: 'Wed', hours: 1.8, color: '#5B9A8B' },
        { day: 'Thu', hours: 5.1, color: '#5B9A8B' },
        { day: 'Fri', hours: 2.9, color: '#5B9A8B' },
        { day: 'Sat', hours: 1.5, color: '#5B9A8B' },
        { day: 'Sun', hours: 2.3, color: '#5B9A8B' },
    ];

    const maxHours = Math.max(...weeklyData.map(d => d.hours));

    return (
        <><TopBar />
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
                                            height: `${(data.hours / maxHours) * 50}%`,
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
        </>
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
        color: colors.primary500,
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
        backgroundColor: colors.primary500,
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
        color: colors.primary500,
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
        height: 200,
    },
    graphBar: {
        alignItems: 'center',
        flex: 1,
    },
    barFill: {
        width: 20,
        borderRadius: 10,
        marginBottom: spacing.md,
        minHeight: 1,
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
        color: colors.primary500,
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