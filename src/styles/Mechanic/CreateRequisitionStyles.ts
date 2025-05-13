
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingHorizontal: width * 0.05,
      paddingTop:12
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: width * 0.1,
      paddingBottom: width * 0.05,
    },
    cancelText: {
      color: '#007AFF',
      fontSize: width * 0.04,
    },
    headerTitle: {
      fontWeight: 'bold',
      fontSize: width * 0.045,
    },
    saveText: {
      color: '#007AFF',
      fontSize: width * 0.04,
    },
    form: {
      marginTop: 12,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: width * 0.045,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    label: {
      fontSize: width * 0.04,
      fontWeight: '500',
    },
    value: {
      color: '#007AFF',
      fontSize: width * 0.04,
      marginRight: 6,
    },
    rowRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    notesInput: {
      borderWidth: 1,
      borderColor: '#999',
      borderRadius: 10,
      padding: 10,
      minHeight: width * 0.3,
      textAlignVertical: 'top',
      marginTop: 6,
    },
  });
  