import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    // Main container styles
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
    actionCard: {
        backgroundColor: '#2A2F2E',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        flex: 1,
        borderWidth: 1,
        borderColor: '#3A3F3E',
    },
    actionTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#DDE8F9',
        textAlign: 'center',
    },
    
    // Screen Time Card Styles
    screenTimeCard: {
        backgroundColor: '#2A2F2E',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#3A3F3E',
    },
    screenTimeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    screenTimeTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#DDE8F9',
    },
    grantButton: {
        backgroundColor: '#A8C5F0',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
    },
    grantButtonText: {
        color: '#1D201F',
        fontWeight: '600',
        fontSize: 14,
    },
    screenTimeContent: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    screenTimeValue: {
        fontSize: 36,
        fontWeight: '700',
        color: '#A8C5F0',
        marginBottom: 4,
    },
    screenTimeSubtext: {
        fontSize: 14,
        color: '#9CA3AF',
        marginBottom: 12,
    },
    permissionText: {
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 16,
    },
    usageSection: {
        marginTop: 16,
        backgroundColor: '#1D201F',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#3A3F3E',
    },
    usageSectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#DDE8F9',
        marginBottom: 12,
    },
    usageItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#3A3F3E',
    },
    usageAppName: {
        fontSize: 14,
        color: '#DDE8F9',
    },
    usageTime: {
        fontSize: 14,
        fontWeight: '600',
        color: '#A8C5F0',
    },
    refreshButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#3A3F3E',
    },
    refreshButtonText: {
        fontSize: 18,
    },
    loadingContainer: {
        padding: 16,
        alignItems: 'center',
    },
    loadingText: {
        color: '#9CA3AF',
        marginTop: 8,
    },
    overviewCard: {
        backgroundColor: '#2A2F2E',
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
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
    controlSection: {
        backgroundColor: '#2A2F2E',
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#3A3F3E',
    },
    controlHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    controlTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#DDE8F9',
    },
    controlToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    controlLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#9CA3AF',
    },
    statusBox: {
        backgroundColor: '#1D201F',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#A8C5F0',
    },
    statusHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    statusIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    statusText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#A8C5F0',
    },
    statusDetails: {
        gap: 12,
    },
    statusDetail: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDetailIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    statusDetailText: {
        fontSize: 14,
        color: '#DDE8F9',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#DDE8F9',
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#9CA3AF',
        marginBottom: 20,
    },
    presetAppsContainer: {
        paddingHorizontal: 4,
    },
    presetAppCard: {
        alignItems: 'center',
        backgroundColor: '#2A2F2E',
        borderRadius: 16,
        padding: 16,
        borderWidth: 2,
        borderColor: 'transparent',
        marginHorizontal: 6,
        minWidth: 100,
        maxWidth: 120,
    },
    blockedPresetApp: {
        borderColor: '#A8C5F0',
        backgroundColor: '#1D201F',
    },
    presetAppIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#3A3F3E',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    presetAppIconText: {
        fontSize: 20,
    },
    presetAppName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#DDE8F9',
        marginBottom: 8,
        textAlign: 'center',
    },
    blockedPresetAppName: {
        color: '#A8C5F0',
    },
    presetAppStatus: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#3A3F3E',
        alignItems: 'center',
        justifyContent: 'center',
    },
    blockedPresetAppStatus: {
        backgroundColor: '#A8C5F0',
    },
    presetAppStatusText: {
        fontSize: 14,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1D201F',
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#3A3F3E',
    },
    searchIcon: {
        fontSize: 18,
        marginRight: 12,
        color: '#9CA3AF',
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#DDE8F9',
        paddingVertical: 16,
    },
    appsList: {
        maxHeight: 300,
    },
    flatList: {
        maxHeight: 250,
    },
    appItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: '#2A2F2E',
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#3A3F3E',
    },
    appInfo: {
        flex: 1,
    },
    appName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#DDE8F9',
        marginBottom: 4,
    },
    packageName: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 32,
        backgroundColor: '#2A2F2E',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#3A3F3E',
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
        opacity: 0.5,
    },
    emptyText: {
        color: '#9CA3AF',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        maxWidth: 250,
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    actionCard: {
        backgroundColor: '#2A2F2E',
        borderRadius: 16,
    },
});
export default styles;