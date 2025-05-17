import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.05,
    paddingTop: 12,
  },

  // Header
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

  // Form Layout
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

  // Notes Input
  notesInput: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 10,
    padding: 10,
    minHeight: width * 0.3,
    textAlignVertical: 'top',
    marginTop: 6,
  },

  // Generic Text Input
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: width * 0.03,
    paddingVertical: Platform.OS === 'ios' ? height * 0.015 : height * 0.012,
    fontSize: width * 0.04,
    marginTop: 8,
  },

  // Dropdown Styles
  dropdown: {
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 4,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },

  // Item Input with Add Button (if reused)
  itemInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderWidth: 0,
    borderRadius: 8,
    paddingHorizontal: width * 0.03,
    paddingVertical: Platform.OS === 'ios' ? height * 0.012 : height * 0.005,
    marginTop: 8,
  },
  itemInput: {
    flex: 1,
    fontSize: width * 0.04,
    paddingVertical: 4,
  },
  addButton: {
    backgroundColor: '#1271EE',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.035,
  },

  // Chips
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  chipText: {
    marginRight: 6,
    fontSize: width * 0.035,
    color: '#333',
  },
});
