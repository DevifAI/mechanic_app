import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get('window');


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.05,
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
    fontSize: width * 0.05,
  },
  saveText: {
    color: '#007AFF',
    fontSize: width * 0.04,
  },
    inputContainer: {
    marginTop: 20,
    marginBottom: 4,
    width: '100%' // ensures full width
  },
  label: {
    fontSize: 16,
    fontWeight: '600', // semi-bold
    color: '#007AFF',
    marginBottom: 4,
    fontFamily: 'System', // default iOS font
  },
input: {
    height: 44,
    borderBottomWidth: 1, // Only bottom border
    borderColor: '#C6C6C8',
    paddingHorizontal: 2,
    fontSize: 16,
    backgroundColor: 'transparent', // Remove white background
    fontFamily: 'System',
    flex:2,
},
 inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width:'auto',
    //  borderWidth: 1,
    // borderColor: '#999',
  },
  addButton2: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText2: {
    color: 'black',
    fontSize: 28,
    fontWeight: '400',
    lineHeight: 24,
    marginRight:10
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 10,
    padding: 10,
    minHeight: width * 0.3,
    textAlignVertical: 'top',
    marginTop: 6,
  },
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
  addButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap:8 ,
    marginTop: 24,
  },
  addButtonText: {
    color: '#fff',
    fontSize: width * 0.05,
    fontWeight: '600',
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap:8 ,
  },
  itemPreview: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginTop: 6,
  },
  textArea: {
  height: 100,
  textAlignVertical: 'top',
   borderWidth: 1,
   borderColor: '#C6C6C8',
   padding: 10, 
   minHeight: width * 0.3,
   borderRadius:8,
},

});
