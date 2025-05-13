import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Modal, 
  Dimensions,
  Platform,
  SafeAreaView,
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import OrganizationModal from '../../Modal/OrganizationModal';
import { styles } from "../../styles/Mechanic/HomeStyles"
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

// Placeholder icons (replace with your actual icon paths)
const icons = {
  requisition: require('../../assets/Home/Requisition.png'),
  receipt: require('../../assets/Home/Receipt.png'),
  consumption: require('../../assets/Home/Consumption.png'),
  log: require('../../assets/Home/Maintanance.png'),
  noData: require('../../assets/Home/NoRequisition.png'), // placeholder
};

const Home = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Top Bar */}
        <View style={styles.header}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View style={styles.LogoContainer}>
            <Image source={require('../../assets/Home/SoftSkirl.png')} style={styles.logo} />
            <Text style={styles.appName}>Softskirl</Text>
              <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
          </View>
          </TouchableOpacity>
          <View style={styles.rightIcons}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => console.log('Pressed!')}
            >
              <MaterialIcons name="support-agent" size={24} color="black" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={() => console.log('Pressed!')}
            >
              <Icon name="notifications-outline" size={24} color="black" style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Welcome Message */} 
        <Text style={styles.welcome}>✨ Welcome g8sanju1982</Text>
        <Text style={styles.subtext}>Happy Invoicing!</Text>

        {/* Shortcut Grid */}
        <View style={styles.gridContainer}>
          <Shortcut screenName="Requisition"  icon={icons.requisition} label="Diesel Requisitions" />
          <Shortcut screenName="Receipt" icon={icons.receipt} label="Diesel Receipt" />
          <Shortcut screenName="Consumption" icon={icons.consumption} label="Diesel Consumption" />
          <Shortcut screenName="Log" icon={icons.log} label="Maintenance Log" />
        </View>

        {/* Requisition Status */}
        <View style={styles.RequisitionContainer}>
          <View style={styles.RecentContainer}>
            <FontAwesome6 
              name="clock-rotate-left" 
              size={16} 
              color="black" 
            />
            <Text style={styles.recentLabel}>Recent Requisition Status</Text>
          </View>

          <View style={styles.noDataBox}>
            <Image source={icons.noData} style={styles.noDataIcon} />
            <Text style={styles.noDataText}>No Requisition To Show</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Modal */}
      <OrganizationModal visible={modalVisible} onClose={() => setModalVisible(false)} />

    </SafeAreaView>
  );
};

const Shortcut = ({ icon, label, screenName }: { icon: any; label: string; screenName: string }) => {
  const navigation = useNavigation<any>();
  
  return (
    <TouchableOpacity 
      style={styles.shortcutBox} 
      onPress={() => navigation.navigate(screenName)}
    >
      <View style={styles.ImageContainer}>
        <Image source={icon} style={styles.shortcutIcon} />
      </View>
      <Text style={styles.shortcutLabel}>{label}</Text>
    </TouchableOpacity>
  );
};


export default Home;