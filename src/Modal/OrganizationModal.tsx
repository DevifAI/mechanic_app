import React from 'react';
import { Modal, View, Text, TouchableOpacity, Image } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles/Mechanic/OrganizationModal';
import { logout } from '../redux/authSlice';

interface OrganizationModalProps {
  visible: boolean;
  onClose: () => void;
}

const OrganizationModal: React.FC<OrganizationModalProps> = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  // const handleLogout = () => {
  //   dispatch(logout());
  //   onClose(); // Close modal
  //   navigation.replace('Login'); // Navigate to Login screen
  // };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity style={styles.modalHeaderButton} onPress={onClose}>
              <Text style={styles.modalHeaderButtonText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Organization</Text>
            <TouchableOpacity style={styles.modalHeaderButton}>
              <Text style={styles.modalHeaderButtonText}>Manage</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.orgInfoContainer}>
              <View style={styles.logoWrapper}>
                <Image source={require('../assets/Home/SoftSkirl.png')} style={styles.Modallogo} />
              </View>
              <View style={styles.orgTextContainer}>
                <Text style={styles.orgName}>Softskirl</Text>
                <Text style={styles.orgId}>Org. ID. 8596321478</Text>
              </View>
              <View style={styles.tickContainer}>
                <MaterialIcons name="check-circle" size={30} color="#4CAF50" />
              </View>
            </View>

            {/* Logout Button */}
            {/* <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Log Out</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default OrganizationModal;
