import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFFED',
  },
  container: {
    backgroundColor: '#FFFFFFED',
    padding: width * 0.04,
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: height * 0.02,
  },
  LogoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4
  },
  logo: {
    width: width * 0.08,
    height: width * 0.08,
    resizeMode: 'contain',
  },
  appName: {
    fontSize: width * 0.045,
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
  icon: {
    width: 24,
    height: 24,
    tintColor: '#333',
  },
  welcome: {
    marginTop: height * 0.02,
    fontSize: width * 0.045,
    fontWeight: '600',
  },
  subtext: {
    fontSize: width * 0.035,
    color: '#888',
    marginBottom: height * 0.02,
    marginLeft: width * 0.07
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    padding: width * 0.02,
    borderRadius: 12,
    marginBottom: height * 0.02,
    elevation: 2,
  },
  shortcutBox: {
    alignItems: 'center',
    width: width * 0.22,
    marginVertical: height * 0.01,
  },
  shortcutIcon: {
    width: width * 0.1,
    height: width * 0.1,
    marginBottom: height * 0.01,
    resizeMode: 'contain',
  },
  shortcutLabel: {
    fontSize: width * 0.039,
    textAlign: 'center',
  },
  recentLabel: {
    fontWeight: 'bold',
    marginBottom: 1,
    marginLeft: 4,
    fontSize: width * 0.035,
  },
  noDataBox: {
    backgroundColor: '#E6E6E6FC',
    borderRadius: 12,
    height: height * 0.25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  noDataIcon: {
    width: width * 0.2,
    height: width * 0.2,
    marginBottom: height * 0.02,
    resizeMode: 'contain',
  },
  noDataText: {
    color: '#aaa',
    fontSize: width * 0.04,
  },
  ImageContainer: {
    borderRadius: 12,
    padding: width * 0.03,
    backgroundColor: '#D9D9D96B'
  },
  RequisitionContainer: {
    width: '100%',
    backgroundColor: '#fff',
    padding: width * 0.03,
    borderRadius: 12,
    marginVertical: height * 0.01,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  RecentContainer: {
    width: '60%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D9D9D978',
    borderRadius: 8,
    padding: width * 0.01,
  },
});