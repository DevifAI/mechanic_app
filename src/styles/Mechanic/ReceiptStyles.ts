// Receipt.styles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' , paddingTop:12 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width * 0.04,
  },
  title: { fontSize: width * 0.05, fontWeight: 'bold' },
  rightIcons: { flexDirection: 'row', gap: width * 0.03 },
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
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 6,
    marginTop:12
  },
  tabText: {
    fontSize: width * 0.045,
    color: '#777',
  },
  activeTab: {
    color: '#1271EE',
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
    fontWeight: 'bold',
    paddingBottom: 2,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'column',
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  viewButton: {
    // backgroundColor: '#007bff',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth:1,
    borderColor:'#000',
  },
  viewButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    right: width * 0.05,
    bottom: height * 0.05,
    backgroundColor: '#000',
    borderRadius: width * 0.12, // Makes it a perfect circle
    width: width * 0.15,
    height: width * 0.15,
    alignItems: 'center',
    justifyContent: 'center',
    // Optional: Add shadow for better visibility
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  fabIcon: {
    color: 'white',
    fontSize: width * 0.1,
    fontWeight: 'bold',
    // Adjust text alignment (optional, but ensures centering)
    textAlign: 'center',
    // Fine-tuning vertical alignment (if needed)
    lineHeight: width * 0.1, // Match font size
    includeFontPadding: false, // Removes extra padding (Android)
  },
});
