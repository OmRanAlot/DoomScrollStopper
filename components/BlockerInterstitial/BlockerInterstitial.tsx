import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  AppState,
  AppStateStatus,
  AccessibilityInfo,
  NativeEventSubscription,
  StyleSheet,
  Text,
  View,
  TextStyle,
} from 'react-native';
import tokens from '../../design/tokens';


type Props = {
  duration?: number; // seconds
  goals?: string[];
  onComplete?: () => void;
  variant?: 'standard' | 'breathing';
};

const BlockerInterstitial: React.FC<Props> = ({
  duration = 15,
  goals = [],
  onComplete,
  variant = 'standard',
}) => {
  const [secondsLeft, setSecondsLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(true);
  const progress = useRef(new Animated.Value(0)).current; // 0 -> 1
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Start the progress animation
    Animated.timing(progress, {
      toValue: 1,
      duration: duration * 1000,
      useNativeDriver: false,
    }).start();

    startTimer();

    const sub: NativeEventSubscription = AppState.addEventListener('change', handleAppState);

    return () => {
      stopTimer();
      sub.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) {
      // Complete
      Animated.timing(progress, { toValue: 1, duration: 250, useNativeDriver: false }).start();
      setIsRunning(false);
      onComplete && onComplete();
      // small fade/dismiss could be implemented by parent
    }
  }, [secondsLeft, onComplete, progress]);

  // Timer management
  function startTimer() {
    stopTimer();
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
      // per-tick scale animation (1 -> 1.05 -> 1)
      scaleAnim.setValue(1);
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.05, duration: 150, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1.0, duration: 150, useNativeDriver: true }),
      ]).start();
    }, 1000);
  }

  function stopTimer() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }

  function handleAppState(nextAppState: AppStateStatus) {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      // resumed
      startTimer();
      // resume progress animation: restart from current progress
      // Compute remaining and restart Animated.timing from current value
      progress.stopAnimation((val: number) => {
        const remaining = duration * (1 - val);
        Animated.timing(progress, { toValue: 1, duration: remaining * 1000, useNativeDriver: false }).start();
      });
    } else if (String(nextAppState).match(/inactive|background/)) {
      // backgrounded
      stopTimer();
      // pause progress animation
      progress.stopAnimation();
    }
    appState.current = nextAppState as AppStateStatus;
  }

  // Accessibility announcements: every 4 seconds and final 3 seconds verbatim
  useEffect(() => {
    if (!isRunning) return;
    if (secondsLeft <= 3) {
      announce(`${secondsLeft} seconds remaining`);
      return;
    }
    if (secondsLeft % 4 === 0) {
      announce(`${secondsLeft} seconds remaining`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  function announce(message: string) {
    // AccessibilityInfo.announceForAccessibility works on both platforms
    AccessibilityInfo.isScreenReaderEnabled().then((enabled) => {
      if (enabled) {
        AccessibilityInfo.announceForAccessibility(message);
      }
    });
  }

  // Derived animated styles
  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  // Styles
  const styles = makeStyles(tokens);

  return (
    <View style={styles.container}>
      {/* Background gradient is represented by colors.gradientPrimary[0] as a simple fallback background */}
      <View style={styles.content}>
        <View style={styles.spacerTop} />

        {/* Breathing icon placeholder / circle */}
        <View
          style={styles.breathingWrapper}
          accessible
          accessibilityRole="image"
          accessibilityLabel={variant === 'breathing' ? 'Breathing exercise' : 'Mindful breathing icon'}
        >
          <View style={styles.breathingOuter} />
          <View style={styles.breathingInner}>
            <Text style={styles.iconOverlay}>🌙</Text>
          </View>
        </View>

        <Text style={styles.primaryMessage} accessibilityRole="header">
          Take a breath. Do you really need this right now?
        </Text>

        <Text style={styles.secondaryMessage}>Taking a moment to pause...</Text>

        <Animated.Text style={[styles.countdown, { transform: [{ scale: scaleAnim }] }]} accessibilityLiveRegion="polite">
          {secondsLeft}
        </Animated.Text>

        <Text style={styles.timerLabel}>seconds</Text>

        {/* Goals card */}
        <View style={styles.goalsCard} accessibilityRole="summary">
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderIcon}>🎯</Text>
            <Text style={styles.cardHeaderText}>Remember your goals</Text>
          </View>

          <View style={styles.goalsList}>
            {goals.length === 0 ? (
              <Text style={styles.emptyState}>Set your goals to see them here</Text>
            ) : (
              goals.slice(0, 10).map((g, i) => (
                <View key={i} style={styles.goalItem}>
                  <View style={styles.goalBullet} />
                  <Text style={styles.goalText} numberOfLines={1} ellipsizeMode="tail">
                    {g}
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>

        <View style={styles.flexSpacer} />
      </View>

      {/* Progress bar fixed at bottom */}
      <View style={styles.progressTrack} pointerEvents="none">
        <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
      </View>
    </View>
  );
};

function makeStyles(t: typeof tokens) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: t.dark.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: t.spacing.md,
      paddingTop: t.spacing.lg,
      alignItems: 'center',
    },
    spacerTop: {
      height: 80,
    },
    breathingWrapper: {
      width: 132,
      height: 132,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 32,
    },
    breathingOuter: {
      position: 'absolute',
      width: 132,
      height: 132,
      borderRadius: 66,
      backgroundColor: t.colors.primary400,
      opacity: 0.2,
    },
    breathingInner: {
      width: 132,
      height: 132,
      borderRadius: 66,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: t.colors.primary300,
    },
    iconOverlay: {
      color: '#fff',
      fontSize: 48,
    },
    primaryMessage: {
      marginTop: 32,
      maxWidth: 320,
      textAlign: 'center',
      color: t.dark.textPrimary,
      fontSize: t.typography.h1.size,
      lineHeight: t.typography.h1.lineHeight,
      fontWeight: t.typography.h1.weight as TextStyle['fontWeight'],
    } as any,
    secondaryMessage: {
      marginTop: 16,
      color: t.dark.textSecondary,
      fontSize: t.typography.bodyLarge.size,
      lineHeight: t.typography.bodyLarge.lineHeight,
    },
    countdown: {
      marginTop: 32,
      fontSize: 64,
      lineHeight: 72,
      fontWeight: '200' as TextStyle['fontWeight'],
      color: t.colors.primary600,
    } as any,
    timerLabel: {
      marginTop: 8,
      fontSize: t.typography.caption.size,
      color: t.colors.gray500,
    },
    goalsCard: {
      marginTop: 40,
      width: '100%',
      maxWidth: 400,
      padding: 24,
      borderRadius: t.radii.xxl,
      backgroundColor: 'rgba(255,255,255,0.06)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.08)',
      shadowColor: 'rgba(0,0,0,0.1)',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 15,
      elevation: 6,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    cardHeaderIcon: {
      fontSize: 20,
      marginRight: 8,
      color: t.colors.primary600,
    },
    cardHeaderText: {
      fontSize: t.typography.bodySmall.size,
      fontWeight: '500' as TextStyle['fontWeight'],
      color: t.colors.gray700,
    } as any,
    goalsList: {
      marginTop: 16,
      maxHeight: 120,
    },
    goalItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      // gap is not supported in RN StyleSheet; use margin on children
    } as any,
    goalBullet: {
      width: 6,
      height: 6,
      borderRadius: 6,
      backgroundColor: t.colors.primary400,
      marginRight: 12,
    },
    goalText: {
      flex: 1,
      color: t.colors.gray600,
      fontSize: t.typography.bodySmall.size,
    },
    emptyState: {
      textAlign: 'center',
      color: t.colors.gray500,
      fontStyle: 'italic',
      paddingVertical: 16,
    },
    flexSpacer: {
      flex: 1,
    },
    progressTrack: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: 6,
      backgroundColor: 'rgba(255,255,255,0.08)',
    },
    progressBar: {
      height: 6,
      backgroundColor: t.colors.primary400,
    },
  });
}

export default BlockerInterstitial;
