import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.05,
    paddingBottom: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: width * 0.1,
    paddingBottom: width * 0.08,
  },
  cancelText: {
    color: 'red',
    fontSize: width * 0.04,
  },
    saveText: {
    color: '#007AFF',
    fontSize: width * 0.04,
  },
  headerTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  row2: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // label: {
  //   fontSize: width * 0.038,
  //   fontWeight: '500',
  //   color: '#555',
  //   width: 60,
  // },
  value: {
    fontSize: width * 0.038,
    color: '#222',
    flexShrink: 1,
  },
  addButton: {
    borderWidth:1,
    borderColor: '#1271EE',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    flexDirection:'row',
    justifyContent:'center',
    gap:4
  },
  addButtonText: {
    color: '#1271EE',
    fontWeight: '600',
    fontSize:16
  },
  // card: {
  //   flexDirection: 'row',
  //   padding: 12,
  //   backgroundColor: '#f7f7f7',
  //   borderRadius: 8,
  //   marginBottom: 10,
  //   elevation: 2,
  // },
  title: {
    fontSize: width * 0.045,
    fontWeight: '600',
    marginBottom: 6,
  },
  deleteBtn: {
    justifyContent: 'center',
    paddingLeft: 4,
    marginRight:8
  },
  saveBtnContainer: {
    position: 'absolute',
    bottom: 20,
    left: width * 0.05,
    right: width * 0.05,
  },
  saveBtn: {
    backgroundColor: '#34C759',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  headerRow: {
    flexDirection: 'row',
    paddingBottom: 10,
    marginTop:16,
     display:'flex',
    textAlign:'center',
    justifyContent:"center",
    alignItems:"center",
  },
  headerText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#6b7280',
    display:'flex',
    textAlign:'center',
    justifyContent:"center",
    alignItems:"center",
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical:22,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  itemContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  centerContent: {
    flexDirection: 'column',
  },
 
  itemDetails: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    textAlign: 'right',
    minWidth: 70,
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 10,
  },
  subTotalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 6,
    gap:32,
    paddingHorizontal:10
  },
  subTotalText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#111827',
  },

  //card

   card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  deleteIcon: {
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  itemSub: {
    fontSize: 14,
    color: '#777',
    marginTop: 6,
    fontWeight: '600',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  qtyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  uomText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    marginTop: 6,
  },

  //////log////////////////////////////////////////

   label: {
    fontSize: 16,
    fontWeight: '600', // semi-bold
    color: '#007AFF',
    marginBottom: 4,
    marginTop: 8,
    fontFamily: 'System', // default iOS font
  },
input: {
    height: 40,
    borderBottomWidth: 1, // Only bottom border
    borderColor: '#C6C6C8',
    paddingHorizontal: 2,
    fontSize: 16,
    backgroundColor: 'transparent', // Remove white background
    fontFamily: 'System',
    flex:2,
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
  dropdown: {
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 2,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
});
