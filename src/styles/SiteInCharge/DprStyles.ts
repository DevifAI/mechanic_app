import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

// Responsive units
const scale = width / 375; // base width for design
const fontScale = height / 812; // base height

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: width * 0.05,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: width * 0.05,
    paddingTop: height * 0.06,
  },
  headerTitle: {
    fontSize: 18 * fontScale,
    fontWeight: '600',
    color: '#000',
  },
  saveText: {
    color: '#1271EE',
    fontSize: 16 * fontScale,
  },
 cardContainer: {
  backgroundColor: '#fff',
  borderRadius: 16,
  padding: 16,
  margin: 4,
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
},
userRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 4,
},
userText: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#000',
},
divider: {
  height: 1,
  backgroundColor: '#e0e0e0',
  marginVertical: 8,
},
labelBlock: {
  marginTop: 4,
  gap:4
},
labelText: {
  fontSize: 15,
  color: '#000',
  marginBottom: 8,
},

  cardContainer2: {
    backgroundColor: '#f6f6f6',
    padding: 16,
    borderRadius: 16,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8
  },
  rightAligned: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
  },
  subText: {
    fontSize: 12,
    color: '#888',
  },
 
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addText: {
    fontSize: 14,
    color: '#1271EE',
    marginLeft: 6,
  },
  costBlock: {
    marginTop: 8,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  labelText2: {
    fontSize: 15,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  editText: {
    fontSize: 14,
    color: '#1271EE',
    marginRight: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
    backIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});