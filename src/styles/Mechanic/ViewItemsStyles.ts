import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex:1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {},
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
    flex: 1,
    marginRight: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    width: '100%',
    // borderWidth: 1,
    // borderColor: '#e1e1e1',
  },
   infoCard: {
    width: width * 0.4,  // 45% of screen width
    backgroundColor: '#f7f7f7',
    paddingVertical: 14,
    marginHorizontal: 6,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e1e1e1',
     elevation: 2,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
  logDetails: {
    marginBottom: 24,
    gap: 12,
  },
  logCard: {
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
  },
  subheading: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textAlign:"center"
  },
  approvalsContainer: {
    marginTop: 20,
    marginBottom: 68,
  },
  approvalRow: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 8,
  },
  approvalText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#444',
    padding: 4,
  },
  approvalRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
    gap: 8,
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  pendingRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
    gap: 8,
    borderWidth: 1,
    borderColor: '#f5a623',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  approvedBox: {
    borderRadius: 6,
  },
  pendingBox: {
    borderRadius: 6,
  },
  approvedText: {
    color: 'green',
    fontWeight: '600',
  },
  pendingText: {
    color: '#d17c00',
    fontWeight: '600',
  },

    itemCard: {
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
    marginBottom: 12,
    width: width * 0.85, // 90% of screen width
  },


  itemTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    color: '#222',
  },
  itemDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemDetailsRow2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  itemDetail: {
    flexDirection: 'row',
    alignContent: 'center',
  },
  itemDetailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  itemDetailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
 itemNotes: {
  marginTop: 4,
  fontSize: 16,
  fontStyle: 'italic',
  color: '#555',
},

  buttonRow: {
  flexDirection: 'row',
  justifyContent: 'center',
  marginVertical: 16,
  alignItems:'center',
  gap: 16,
},

approveButton: {
  borderColor: 'green',
  borderWidth: 2,
  paddingVertical: 10,
  paddingHorizontal: 2,
  borderRadius: 8,
  width:'40%'
},

rejectButton: {
  borderColor: 'red',
  borderWidth: 2,
  paddingVertical: 10,
  paddingHorizontal: 2,
  borderRadius: 8,
  width:'40%'
},

buttonText: {
  color: 'black',
  fontWeight: 'bold',
  textAlign: 'center',
  fontSize:18
},

indicatorContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 16,
  marginBottom:20,
  gap: 2, // Optional: if using React Native 0.71+
},

indicatorDot: {
  width: 6,
  height: 6,
  borderRadius: 4,
  backgroundColor: '#ccc',
  marginHorizontal: 4,
  opacity: 0.6,
},

activeDot: {
  width: 15,
  height: 5,
  borderRadius: 5,
  backgroundColor: '#333',
  opacity: 1,
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
},

rejectedBox: {
   borderRadius: 6,
},
rejectedText: {
  color: '#ff1a1a',
  fontWeight: '600',
},
reasonText: {
  color: '#000',
  fontWeight: '600',
  fontSize:15,
  
},
rejectedRowItem: {
  flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
    gap: 8,
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
},



});