import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop:12
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width * 0.04,
  },

  title: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },

  rightIcons: {
    flexDirection: 'row',
    gap: width * 0.03,
  },

  iconButton: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: height * 0.01,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginTop: 12,
  },

  tabText: {
    fontSize: width * 0.045,
    color: '#777',
  },

  activeTab: {
    color: '#1271EE',
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
    paddingBottom: 2,
    fontWeight: 'bold',
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems:'flex-start',
    paddingVertical:width * 0.04,
    paddingHorizontal: width * 0.02,
    marginHorizontal: width * 0.02,
    marginTop: height * 0.015,
    borderRadius: width * 0.03,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 1,
    gap: width * 0.01,
  },

  leftSection: {
    flex: 0.7,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  avatar: {
    width: width * 0.10,
    height: width * 0.10,
    borderRadius: (width * 0.12) / 2,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.01,
  },

  avatarText: {
    fontSize: width * 0.05,
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },

  meta: {
    alignItems: 'center',
  },

  date: {
    fontSize: width * 0.035,
    color: '#1271EE',
    fontWeight: '500',
  },

  time: {
    fontSize: width * 0.035,
    color: '#1271EE',
    fontWeight: '500',
  },
  middleSection : {
    flex: 2,
     marginLeft: width * 0.03,
  },

  rightSection: {
    flex: 1,
    // borderColor: 'red',
    // borderWidth: 1.5,
   
  },

  username: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: height * 0.005,
  },

  description: {
    fontSize: width * 0.035,
    color: '#666',
    marginBottom: height * 0.015,
  },

  buttonGroup: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    gap: width * 0.03,
  },

  approveBtn: {
    backgroundColor: '#1271EE',
    paddingVertical: height * 0.005,
    paddingHorizontal: width * 0.035,
    borderRadius: 12,
    paddingBottom:5    
  },

  approveText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: width * 0.035,
    textAlign:'center'
  },

  rejectBtn: {
    borderColor: 'red',
    borderWidth: 1.5,
    paddingVertical: height * 0.005,
    paddingHorizontal: width * 0.04,
    borderRadius: 18,
  },

  rejectText: {
    color: 'red',
    fontWeight: '600',
    fontSize: width * 0.035,
     textAlign:'center'
  },

  fab: {
    position: 'absolute',
    right: width * 0.05,
    bottom: height * 0.05,
    backgroundColor: '#000',
    borderRadius: width * 0.12,
    width: width * 0.15,
    height: width * 0.15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  fabIcon: {
    color: 'white',
    fontSize: width * 0.1,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: width * 0.1,
    includeFontPadding: false,
  },
});
