import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import styles from './homeStyle';

const Home = () => {
    // Hard-coded data for display
    const dailyStats = {
        screenTime: '2h 34m',
        sessionsBlocked: 12,
        timeSaved: '1h 18m',
        currentStreak: 5,
        focusScore: 87
    };

    const topApps = [
        { name: 'Instagram', icon: '📷', time: '45m', percentage: 30 },
        { name: 'TikTok', icon: '🎵', time: '38m', percentage: 25 },
        { name: 'Twitter', icon: '🐦', time: '32m', percentage: 21 },
        { name: 'Reddit', icon: '🤖', time: '24m', percentage: 16 },
        { name: 'YouTube', icon: '▶️', time: '15m', percentage: 8 }
    ];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.appWrapper}>
                {/* Header */}
                <View style={styles.topHeader}>
                    <Text style={styles.logo}>🍃</Text>
                    <Text style={styles.appTitle}>MindfulScroll</Text>
                </View>

                <View style={styles.content}>
                    {/* Daily Statistics Card */}
                    <View style={styles.cardLarge}>
                        <Text style={styles.cardTitle}>Today's Overview</Text>
                        
                        <View style={styles.statsGrid}>
                            <View style={styles.statBox}>
                                <Text style={styles.statIcon}>⏱️</Text>
                                <Text style={styles.statValue}>{dailyStats.screenTime}</Text>
                                <Text style={styles.statLabel}>Screen Time</Text>
                            </View>
                            
                            <View style={styles.statBox}>
                                <Text style={styles.statIcon}>🚫</Text>
                                <Text style={styles.statValue}>{dailyStats.sessionsBlocked}</Text>
                                <Text style={styles.statLabel}>Sessions Blocked</Text>
                            </View>
                        </View>

                        <View style={styles.statsGrid}>
                            <View style={styles.statBox}>
                                <Text style={styles.statIcon}>✨</Text>
                                <Text style={styles.statValue}>{dailyStats.timeSaved}</Text>
                                <Text style={styles.statLabel}>Time Saved</Text>
                            </View>
                            
                            <View style={styles.statBox}>
                                <Text style={styles.statIcon}>🔥</Text>
                                <Text style={styles.statValue}>{dailyStats.currentStreak}</Text>
                                <Text style={styles.statLabel}>Day Streak</Text>
                            </View>
                        </View>

                        {/* Focus Score */}
                        <View style={styles.focusScoreContainer}>
                            <Text style={styles.focusScoreLabel}>Focus Score</Text>
                            <View style={styles.focusScoreBar}>
                                <View style={[styles.focusScoreFill, { width: `${dailyStats.focusScore}%` }]} />
                            </View>
                            <Text style={styles.focusScoreValue}>{dailyStats.focusScore}%</Text>
                        </View>
                    </View>

                    {/* Top Apps Card */}
                    <View style={styles.cardLarge}>
                        <Text style={styles.cardTitle}>Most Used Apps</Text>
                        {topApps.map((app, index) => (
                            <View key={index} style={styles.appUsageItem}>
                                <View style={styles.appUsageLeft}>
                                    <Text style={styles.appUsageIcon}>{app.icon}</Text>
                                    <Text style={styles.appUsageName}>{app.name}</Text>
                                </View>
                                <View style={styles.appUsageRight}>
                                    <Text style={styles.appUsageTime}>{app.time}</Text>
                                    <View style={styles.appUsageBarContainer}>
                                        <View style={[styles.appUsageBar, { width: `${app.percentage}%` }]} />
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Quick Tip Card */}
                    <View style={styles.tipCard}>
                        <Text style={styles.tipIcon}>💡</Text>
                        <Text style={styles.tipTitle}>Daily Tip</Text>
                        <Text style={styles.tipText}>
                            Try the "Study Mode" when you need deep focus. It blocks all social media and entertainment apps automatically.
                        </Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default Home;
