import React, { useEffect, useState } from 'react';
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
  StatusBar,
  BackHandler
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import OrganizationModal from '../../Modal/OrganizationModal';
import { styles } from "../../styles/Mechanic/HomeStyles";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const { width, height } = Dimensions.get('window');

const icons = {
  requisition: require('../../assets/Home/Requisition.png'),
  receipt: require('../../assets/Home/Receipt.png'),
  consumption: require('../../assets/Home/Consumption.png'),
  log: require('../../assets/Home/Maintanance.png'),
  noData: require('../../assets/Home/NoRequisition.png'),
  DPR: require('../../assets/Home/DPR.png'),
  HSE: require('../../assets/Home/HSE.png'),
  training: require('../../assets/Home/Training.png'),
};

const Home = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [exitModalVisible, setExitModalVisible] = useState(false);
  const { role } = useSelector((state: RootState) => state.auth);
  const navigation = useNavigation<any>();

  // Handle Android Back Button
useFocusEffect(
  React.useCallback(() => {
    const onBackPress = () => {
      setExitModalVisible(true);
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => backHandler.remove(); // ✅ Proper cleanup
  }, [])
);


  const handleExit = () => {
    BackHandler.exitApp();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Top Bar */}
        <View style={styles.header}>
          <View style={styles.rightIcons}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Ionicons name="menu" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <View style={styles.LogoContainer}>
                <Image source={require('../../assets/Home/SoftSkirl.png')} style={styles.logo} />
                <Text style={styles.appName}>Softskirl</Text>
                <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.rightIcons}>
            <TouchableOpacity style={styles.iconButton} onPress={() => console.log('Support')}>
              <MaterialIcons name="support-agent" size={24} color="black" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => console.log('Notifications')}>
              <Icon name="notifications-outline" size={24} color="black" style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Welcome Message */}
        <Text style={styles.welcome}>✨ Welcome g8sanju1982</Text>
        <Text style={styles.subtext}>Happy Invoicing!</Text>

        {/* Shortcut Grid */}
        {role === 'siteIncharge' && (
          <View style={styles.gridContainer}>
            <Shortcut screenName="DprScreen" icon={icons.DPR} label="DPR" />
            <Shortcut screenName="HseScreen" icon={icons.HSE} label="HSE" />
            <Shortcut screenName="Training" icon={icons.training} label="Training" />
          </View>
        )}
        <View style={styles.gridContainer}>
          <Shortcut screenName="Requisition" icon={icons.requisition} label="Diesel Requisitions" />
          <Shortcut screenName="Receipt" icon={icons.receipt} label="Diesel Receipt" />
          <Shortcut screenName="Consumption" icon={icons.consumption} label="Diesel Consumption" />
          <Shortcut screenName="Log" icon={icons.log} label="Maintenance Log" />
        </View>

        {/* Requisition Status */}
        <View style={styles.RequisitionContainer}>
          <View style={styles.RecentContainer}>
            <FontAwesome6 name="clock-rotate-left" size={16} color="black" />
            <Text style={styles.recentLabel}>Recent Requisition Status</Text>
          </View>
          <View style={styles.noDataBox}>
            <Image source={icons.noData} style={styles.noDataIcon} />
            <Text style={styles.noDataText}>No Requisition To Show</Text>
          </View>
        </View>
      </ScrollView>

      {/* Org Switch Modal */}
      <OrganizationModal visible={modalVisible} onClose={() => setModalVisible(false)} />

      {/* Exit Confirmation Modal */}
      <Modal
        visible={exitModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setExitModalVisible(false)}
      >
        <View style={exitStyles.overlay}>
          <View style={exitStyles.modalBox}>
            <Text style={exitStyles.title}>Exit App?</Text>
            <Text style={exitStyles.message}>Are you sure you want to exit the app?</Text>
            <View style={exitStyles.buttonContainer}>
              <TouchableOpacity style={exitStyles.button} onPress={handleExit}>
                <Text style={exitStyles.buttonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={exitStyles.button} onPress={() => setExitModalVisible(false)}>
                <Text style={exitStyles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const Shortcut = ({ icon, label, screenName }: { icon: any; label: string; screenName: string }) => {
  const navigation = useNavigation<any>();
  return (
    <TouchableOpacity style={styles.shortcutBox} onPress={() => navigation.navigate(screenName)}>
      <View style={styles.ImageContainer}>
        <Image source={icon} style={styles.shortcutIcon} />
      </View>
      <Text style={styles.shortcutLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const exitStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default Home;
