
import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
      backgroundColor: 'white',
      height: '100%',
      width: '100%',
      paddingTop:12
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
    modalContent: {
      backgroundColor: '#E7E7E7',
      borderRadius: 12,
      padding: 20,
      marginHorizontal: 16,
      marginVertical: 10,
      flexDirection:'column',
      
    },
    orgInfoContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    logoWrapper: {
      flex: 1,
      alignItems: 'flex-start',
    },
    orgTextContainer: {
      flex: 2,
      alignItems: 'center',
    },
    tickContainer: {
      flex: 1,
      alignItems: 'flex-end',
    },
    Modallogo: {
      width: 50,
      height: 50,
      borderRadius: 8,
    },
    orgName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'center',
    },
    orgId: {
      fontSize: 14,
      color: '#666',
      marginTop: 4,
      textAlign: 'center',
      flexShrink: 1,      
      flexWrap: 'nowrap', 
    },
    modalHeaderButton: {
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    modalHeaderButtonText: {
      fontSize: 16,
      color: '#007AFF',
    },
    modalHeaderTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
logoutButton: {
  position: 'absolute',
  bottom: -450, 
  left: 20,
  right: 20,
  backgroundColor: '#E53935',
  paddingVertical: 12,
  borderRadius: 8,
  alignItems: 'center', // Center text inside
},

logoutButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},
  });