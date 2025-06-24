import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

const menuItems = [
  { title: 'Diesel Consumption', icon: require('../../assets/Icons/ConsumptionLogo.png'), name:'Consumption' },
  { title: 'Maintanance Log', icon: require('../../assets/Icons/LogLogo.png'), name:'Log' },
  { title: 'HSE', icon: require('../../assets/Icons/HseLogo.png'), name:'' },
  { title: 'Training', icon: require('../../assets/Icons/TrainingLogo.png'), name:'' },
];

export default function MoreScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity  onPress={() => navigation.goBack()}>
                  <View style={styles.backIconContainer}>
                    <MaterialIcons name="keyboard-arrow-left" size={28} color="#000" />
                  </View>
                </TouchableOpacity>
        <Text style={styles.headerTitle}>More</Text>
        <View style={{ width: 24 }} /> {/* Placeholder to balance layout */}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.itemRow} onPress={() => navigation.navigate(`${item.name}`)}>
            <Image source={item.icon} style={styles.icon} resizeMode="contain" />
            <Text style={styles.itemText}>{item.title}</Text>
            <Ionicons
              name="chevron-forward-outline"
              size={22}
              color="#000"
              style={{ marginLeft: 'auto' }}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

// ========================= STYLES =========================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFFED',
    paddingTop: height * 0.06,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    marginBottom: height * 0.02,
  },
  headerTitle: {
    fontSize: height * 0.025,
    fontWeight: '600',
    color: '#000',
  },
  content: {
    paddingHorizontal: width * 0.05,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: height * 0.015,
    backgroundColor:'white',
    borderRadius:12,
    paddingHorizontal: width * 0.06,
    marginBlock:10,
  },
  icon: {
    width: width * 0.08,
    height: height * 0.05,
    marginRight: width * 0.04,
  },
  itemText: {
    fontSize: height * 0.022,
    color: '#000',
    fontWeight: '500',
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
