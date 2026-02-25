import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    AppState,
    NativeModules,
    SafeAreaView,
    Animated,
} from 'react-native';

const { VPNModule, SettingsModule } = NativeModules;

const STEPS = [
    {
        id: 'usage',
        permKey: 'usage',
        icon: '👁️',
        title: 'Track what you open',
        subtitle: 'Usage Access',
        description:
            'So we know when you open a distracting app — Instagram, TikTok, YouTube — and can pause you before you fall down a rabbit hole.',
        bullets: [
            'Detects when a blocked app opens',
            'Only reads app names, never your content',
            'No data leaves your device',
        ],
        buttonLabel: 'Grant Usage Access →',
        open: () => VPNModule.requestPermissions(),
    },
    {
        id: 'overlay',
        permKey: 'overlay',
        icon: '🛡️',
        title: 'Show the pause screen',
        subtitle: 'Draw Over Apps',
        description:
            'So we can show the 15-second pause countdown on top of the app. Without this, the screen can\'t appear and blocking won\'t work.',
        bullets: [
            'Shows a countdown before the app opens',
            'Gives you a moment to reconsider',
            'You choose to continue or go back',
        ],
        buttonLabel: 'Grant Overlay Access →',
        open: () => VPNModule.requestOverlayPermission(),
    },
];

export default function PermissionsScreen({ onComplete }) {
    const [stepIndex, setStepIndex] = useState(0);
    const [grantedSteps, setGrantedSteps] = useState(new Set());
    const appStateRef = useRef(AppState.currentState);

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    const animateIn = () => {
        fadeAnim.setValue(0);
        slideAnim.setValue(30);
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 350,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 350,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const advance = async () => {
        try {
            const perms = await VPNModule.checkPermissions();

            // Track which are granted
            const newGranted = new Set(grantedSteps);
            STEPS.forEach((s, i) => {
                if (perms[s.permKey]) newGranted.add(i);
            });
            setGrantedSteps(newGranted);

            // Find first missing step
            for (let i = 0; i < STEPS.length; i++) {
                if (!perms[STEPS[i].permKey]) {
                    if (i !== stepIndex) {
                        setStepIndex(i);
                        animateIn();
                    }
                    return;
                }
            }

            // All permissions granted — start blocker automatically before entering app
            try {
                // Load saved blocked apps
                const savedBlockedApps = await new Promise((resolve) => {
                    SettingsModule.getBlockedApps((apps) => resolve(apps));
                });
                const blockedList = (savedBlockedApps && savedBlockedApps.length > 0)
                    ? savedBlockedApps
                    : ['com.instagram.android', 'com.google.android.youtube'];

                await VPNModule.setBlockedApps(blockedList);
                await VPNModule.startMonitoring();
                // Mark monitoring as enabled so Customize screen reads ON by default
                SettingsModule.saveMonitoringEnabled(true);
            } catch (e) {
                // If auto-start fails, we still proceed — blocker can be enabled from Customize
                console.warn('[Permissions] Auto-start failed:', e);
            }

            onComplete();
        } catch (_) {}
    };

    useEffect(() => {
        animateIn();
        advance();
    }, []);

    useEffect(() => {
        const sub = AppState.addEventListener('change', next => {
            if (appStateRef.current.match(/inactive|background/) && next === 'active') {
                advance();
            }
            appStateRef.current = next;
        });
        return () => sub.remove();
    }, [stepIndex, grantedSteps]);

    useEffect(() => {
        animateIn();
    }, [stepIndex]);

    const step = STEPS[stepIndex];
    if (!step) return null;

    const totalSteps = STEPS.length;

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.container}>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.appName}>DoomScrollStopper</Text>
                    {/* Step pills */}
                    <View style={styles.pills}>
                        {STEPS.map((s, i) => {
                            const isGranted = grantedSteps.has(i);
                            const isActive = i === stepIndex;
                            return (
                                <View
                                    key={i}
                                    style={[
                                        styles.pill,
                                        isActive && styles.pillActive,
                                        isGranted && styles.pillGranted,
                                    ]}
                                >
                                    {isGranted
                                        ? <Text style={styles.pillCheck}>✓</Text>
                                        : <Text style={[styles.pillNum, isActive && styles.pillNumActive]}>{i + 1}</Text>
                                    }
                                </View>
                            );
                        })}
                    </View>
                </View>

                {/* Body — animated on step change */}
                <Animated.View
                    style={[
                        styles.body,
                        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                    ]}
                >
                    <View style={styles.iconWrapper}>
                        <Text style={styles.icon}>{step.icon}</Text>
                    </View>

                    <Text style={styles.stepLabel}>
                        Step {stepIndex + 1} of {totalSteps}
                    </Text>
                    <Text style={styles.title}>{step.title}</Text>
                    <Text style={styles.subtitle}>{step.subtitle}</Text>
                    <Text style={styles.description}>{step.description}</Text>

                    {/* Benefit bullets */}
                    <View style={styles.bullets}>
                        {step.bullets.map((b, i) => (
                            <View key={i} style={styles.bulletRow}>
                                <View style={styles.bulletDot} />
                                <Text style={styles.bulletText}>{b}</Text>
                            </View>
                        ))}
                    </View>
                </Animated.View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.hint}>
                        Tap below → grant access in Settings → return here automatically.
                    </Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={step.open}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.buttonText}>{step.buttonLabel}</Text>
                    </TouchableOpacity>
                    <Text style={styles.privacy}>
                        🔒 All data stays on your device
                    </Text>
                </View>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#111211',
    },
    container: {
        flex: 1,
        paddingHorizontal: 28,
        paddingTop: 24,
        paddingBottom: 36,
        justifyContent: 'space-between',
    },

    // Header
    header: {
        alignItems: 'center',
        gap: 16,
    },
    appName: {
        fontSize: 13,
        fontWeight: '700',
        color: '#5B9A8B',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    pills: {
        flexDirection: 'row',
        gap: 10,
    },
    pill: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#252822',
        borderWidth: 2,
        borderColor: '#2E332E',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pillActive: {
        borderColor: '#5B9A8B',
        backgroundColor: '#1C2822',
    },
    pillGranted: {
        borderColor: '#5B9A8B',
        backgroundColor: '#5B9A8B',
    },
    pillNum: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
    },
    pillNumActive: {
        color: '#5B9A8B',
    },
    pillCheck: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111211',
    },

    // Body
    body: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 24,
    },
    iconWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#1C2822',
        borderWidth: 2,
        borderColor: '#2E4A3E',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        // Subtle glow
        shadowColor: '#5B9A8B',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    icon: {
        fontSize: 44,
    },
    stepLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#5B9A8B',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: '#F9FAFB',
        textAlign: 'center',
        letterSpacing: -0.5,
        lineHeight: 32,
    },
    subtitle: {
        fontSize: 13,
        fontWeight: '500',
        color: '#6B7280',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    description: {
        fontSize: 15,
        color: '#9CA3AF',
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 4,
        marginTop: 4,
    },
    bullets: {
        alignSelf: 'stretch',
        backgroundColor: '#171A17',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#252822',
        paddingVertical: 14,
        paddingHorizontal: 18,
        gap: 10,
        marginTop: 8,
    },
    bulletRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    bulletDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#5B9A8B',
    },
    bulletText: {
        fontSize: 14,
        color: '#D1D5DB',
        flex: 1,
        lineHeight: 20,
    },

    // Footer
    footer: {
        gap: 12,
    },
    hint: {
        fontSize: 12,
        color: '#4B5563',
        textAlign: 'center',
        lineHeight: 18,
    },
    button: {
        backgroundColor: '#5B9A8B',
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        shadowColor: '#5B9A8B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 6,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0D1210',
        letterSpacing: 0.3,
    },
    privacy: {
        fontSize: 12,
        color: '#4B5563',
        textAlign: 'center',
    },
});
