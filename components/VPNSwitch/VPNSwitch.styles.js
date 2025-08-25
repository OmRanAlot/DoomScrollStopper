import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    header: {
      backgroundColor: '#4CAF50',
      padding: 20,
      paddingTop: 40,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 5,
    },
    subtitle: {
      fontSize: 14,
      color: '#fff',
      opacity: 0.9,
    },
    controlSection: {
      backgroundColor: '#fff',
      margin: 15,
      padding: 15,
      borderRadius: 10,
      elevation: 2,
    },
    controlRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    controlLabel: {
      fontSize: 18,
      fontWeight: '500',
    },
    statusBox: {
      marginTop: 15,
      padding: 10,
      backgroundColor: '#E8F5E9',
      borderRadius: 5,
    },
    statusText: {
      color: '#2E7D32',
      fontWeight: '500',
    },
    statusSubtext: {
      color: '#1B5E20',
      fontSize: 12,
      marginTop: 3,
    },
    section: {
      backgroundColor: '#fff',
      margin: 15,
      marginTop: 0,
      padding: 15,
      borderRadius: 10,
      elevation: 2,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 15,
      color: '#333',
    },
    searchInput: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      padding: 10,
      marginBottom: 10,
      fontSize: 16,
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
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
    appInfo: {
      flex: 1,
    },
    appName: {
      fontSize: 16,
      fontWeight: '500',
      color: '#333',
    },
    packageName: {
      fontSize: 12,
      color: '#666',
      marginTop: 2,
    },
    detectedItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
    detectedAppName: {
      fontSize: 14,
      color: '#333',
    },
    detectedTime: {
      fontSize: 12,
      color: '#999',
    },
    emptyText: {
      color: '#999',
      fontStyle: 'italic',
      textAlign: 'center',
      paddingVertical: 10,
    },
    reloadButton: {
      padding: 20,
      alignItems: 'center',
    },
    reloadText: {
      color: '#4CAF50',
      fontSize: 16,
    },
    infoSection: {
      backgroundColor: '#E3F2FD',
      margin: 15,
      marginTop: 0,
      padding: 15,
      borderRadius: 10,
    },
    infoTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#1976D2',
    },
    infoText: {
      fontSize: 14,
      lineHeight: 22,
      color: '#424242',
    },
  });

export default styles;