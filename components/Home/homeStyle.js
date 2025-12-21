import { StyleSheet, Platform } from 'react-native';
// Import tokens; keep import JS-friendly
const tokens = require('../../design/tokens').default;

const { dark, spacing, radii, typography, colors, shadows } = tokens;

const styles = StyleSheet.create({
    // Container
    container: {
        flex: 1,
        backgroundColor: dark.background,
    },

    // App wrapper (inner content padding)
    appWrapper: {
        paddingHorizontal: spacing.md,
        paddingTop: spacing.lg,
        paddingBottom: spacing.xl,
        backgroundColor: dark.background,
        flex: 1,
    },

    // Top header (logo + title)
    topHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    logo: {
        fontSize: 42,
        marginRight: spacing.md,
        lineHeight: 42,
    },
    appTitle: {
        fontSize: typography.h1.size,
        lineHeight: typography.h1.lineHeight,
        fontWeight: '700',
        color: dark.textPrimary,
        ...(Platform.OS === 'ios' ? { fontFamily: typography.fontFamilyIOSDisplay } : { fontFamily: typography.fontFamilyAndroid }),
    },

    // Content stack
    content: {
        marginTop: spacing.sm,
    },

    // Large card used for stats and mood chart
    cardLarge: {
        backgroundColor: dark.surface,
        borderRadius: radii.xxl,
        padding: spacing.xl,
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: dark.divider,
        ...shadows.md,
    },
    cardTitle: {
        fontSize: typography.h2.size,
        fontWeight: '700',
        color: dark.textPrimary,
        marginBottom: spacing.sm,
    },

    // Stats layout
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    statCol: {
        flex: 1,
        paddingRight: spacing.md,
    },
    statLabel: {
        fontSize: typography.caption.size,
        color: dark.textSecondary,
    },
    statValue: {
        fontSize: 28,
        fontWeight: '800',
        color: colors.primary500,
        marginTop: spacing.xs,
    },

    // Chart placeholder
    chartPlaceholder: {
        height: 140,
        borderRadius: radii.md,
        backgroundColor: dark.background,
        borderWidth: 1,
        borderColor: dark.divider,
    },

    // Small card
    cardSmall: {
        backgroundColor: dark.surface,
        borderRadius: radii.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: dark.divider,
    },
    cardText: {
        fontSize: typography.bodySmall.size,
        color: dark.textSecondary,
    },

    // Footer call-to-action
    footerButton: {
        marginTop: spacing.lg,
        backgroundColor: colors.primary500,
        paddingVertical: spacing.md,
        borderRadius: radii.xxl,
        alignItems: 'center',
    },
    footerText: {
        color: dark.background,
        fontSize: typography.body.size,
        fontWeight: '700',
    },

    // Header bar (legacy small header)
    headerBar: {
        height: 50,
        width: '100%',
        backgroundColor: dark.surface,
        marginHorizontal: 0,
        paddingHorizontal: 0,
        borderRadius: 0,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },
    headerBarText: {
        fontSize: typography.body.size,
        color: dark.textSecondary,
        fontWeight: '500',
    },

    // Permissions button
    permissionsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: dark.surface,
        borderRadius: radii.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.primary500,
        ...shadows.sm,
    },
    permissionsIcon: {
        fontSize: 28,
        marginRight: spacing.md,
    },
    permissionsContent: {
        flex: 1,
    },
    permissionsTitle: {
        fontSize: typography.body.size,
        fontWeight: '600',
        color: dark.textPrimary,
        marginBottom: spacing.xs,
    },
    permissionsSubtitle: {
        fontSize: typography.bodySmall.size,
        color: dark.textSecondary,
    },
    permissionsArrow: {
        fontSize: 24,
        color: colors.primary500,
        fontWeight: '300',
    },

    // Reusable components and fallbacks (kept from previous styles)
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        fontSize: typography.h3.size,
        fontWeight: '600',
        color: dark.textPrimary,
        marginBottom: spacing.sm,
    },
    sectionSubtitle: {
        fontSize: typography.bodySmall.size,
        color: dark.textSecondary,
        marginBottom: spacing.lg,
    },

    // Simple list/item styles reused elsewhere
    appItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        backgroundColor: dark.surface,
        borderRadius: radii.md,
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: dark.divider,
    },
    appInfo: { flex: 1 },
    appName: {
        fontSize: typography.body.size,
        fontWeight: '500',
        color: dark.textPrimary,
        marginBottom: spacing.xs,
    },
    packageName: {
        fontSize: typography.caption.size,
        color: dark.textSecondary,
    },
});

export default styles;