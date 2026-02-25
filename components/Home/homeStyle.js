import { StyleSheet, Platform, Dimensions } from 'react-native';
const tokens = require('../../design/tokens').default;

const { spacing, radii, typography, shadows, colors } = tokens;
const s = colors.stitch; // { navy, mint, seafoam, steel, appBg, appSurface, appBorder, appText, appAccent }

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: s.navy,
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xxxl,
    },

    // --- Inner Header ---
    innerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: spacing.lg,
        zIndex: 10,
    },
    iconButton: {
        padding: spacing.sm,
        borderRadius: radii.full,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    statusChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
        borderRadius: radii.full,
    },
    pulseDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: s.seafoam,
        marginRight: spacing.sm,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: 'rgba(194,231,218,0.8)',
        letterSpacing: 2,
    },
    notificationDot: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: s.steel,
    },

    // --- Score Dial ---
    scoreContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.sm,
        marginBottom: spacing.xxl,
        position: 'relative',
        height: 280,
    },
    circleBackgroundGlow: {
        position: 'absolute',
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: 'rgba(98, 144, 195, 0.15)', // steel/15
        /// No blur easily achievable across both platforms without heavy libs, 
        /// using a large shadow to fake blur glow
        shadowColor: s.steel,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 50,
        elevation: 20,
    },
    scoreCircle: {
        width: 260,
        height: 260,
        borderRadius: 130,
        borderWidth: 4,
        borderColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Faking the progress ring by just making a colored border. 
    // Wait, let's just use the scoreContent since SVG isn't here
    innerScoreContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    scoreLabel: {
        color: s.steel,
        fontWeight: '500',
        letterSpacing: 1.5,
        fontSize: 12,
        marginBottom: spacing.xs,
    },
    scoreValue: {
        color: s.mint,
        fontSize: 72,
        fontWeight: '700',
        letterSpacing: -2,
    },
    trendChip: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.sm,
        paddingHorizontal: spacing.md,
        paddingVertical: 4,
        borderRadius: radii.md,
        backgroundColor: 'rgba(241,255,231,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(241,255,231,0.1)',
    },
    trendText: {
        color: s.mint,
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 4,
    },

    // --- Glass Grid ---
    glassGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xxl,
    },
    glassCard: {
        width: (width - spacing.lg * 2 - spacing.md) / 2,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderWidth: 1,
        borderColor: 'rgba(194, 231, 218, 0.1)',
        borderRadius: radii.xl,
        padding: spacing.lg,
    },
    glassCardIconBoxSteel: {
        padding: 8,
        borderRadius: radii.md,
        backgroundColor: 'rgba(98,144,195,0.1)',
        alignSelf: 'flex-start',
        marginBottom: spacing.md,
    },
    glassCardIconBoxSeafoam: {
        padding: 8,
        borderRadius: radii.md,
        backgroundColor: 'rgba(194,231,218,0.1)',
        alignSelf: 'flex-start',
        marginBottom: spacing.md,
    },
    glassCardLabel: {
        color: 'rgba(241, 255, 231, 0.5)',
        fontSize: 12,
        fontWeight: '500',
        letterSpacing: 1,
        marginBottom: 4,
    },
    glassCardValues: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    glassCardValueBig: {
        color: s.mint,
        fontSize: 32,
        fontWeight: '700',
        marginRight: 4,
    },
    glassCardValueSmall: {
        color: s.steel,
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1.5,
    },

    // --- Insight Section ---
    insightSection: {
        marginBottom: spacing.xxl,
    },
    insightHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    insightTitle: {
        color: s.steel,
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    insightReportLink: {
        color: s.seafoam,
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1.5,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(194,231,218,0.3)',
    },
    insightCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        borderRadius: radii.xl,
        padding: spacing.lg,
        alignItems: 'flex-start',
    },
    insightIconBox: {
        padding: spacing.sm,
        backgroundColor: 'rgba(98,144,195,0.2)',
        borderRadius: radii.md,
        marginRight: spacing.md,
    },
    insightTexts: {
        flex: 1,
    },
    insightCardTitle: {
        color: s.mint,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    insightCardDesc: {
        color: 'rgba(241, 255, 231, 0.6)',
        fontSize: 14,
        lineHeight: 20,
    },
    insightHighlight: {
        color: s.seafoam,
        fontWeight: 'bold',
    },

    // --- Blocks Section ---
    blocksSection: {
        marginBottom: spacing.xl,
    },
    blocksTitle: {
        color: s.steel,
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: spacing.md,
    },
    blockRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderWidth: 1,
        borderColor: 'rgba(194, 231, 218, 0.1)',
        borderRadius: radii.lg,
        padding: spacing.md,
        marginBottom: spacing.sm,
    },
    blockRowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    blockIconBox: {
        width: 48,
        height: 48,
        borderRadius: radii.md,
        backgroundColor: s.navy,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    blockCategory: {
        color: s.mint,
        fontSize: 14,
        fontWeight: 'bold',
    },
    blockApps: {
        color: 'rgba(241, 255, 231, 0.4)',
        fontSize: 10,
        letterSpacing: 1,
        marginTop: 2,
        textTransform: 'uppercase',
    },
    blockTimeChip: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: 'rgba(194,231,218,0.05)',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(194,231,218,0.1)',
    },
    blockTimeText: {
        color: s.seafoam,
        fontSize: 10,
        fontWeight: 'bold',
    },

});

export default styles;