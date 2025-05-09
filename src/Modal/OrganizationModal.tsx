import React from 'react';
import { Modal, View, Text, TouchableOpacity, Image } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import  {styles } from '../styles/OrganizationModal';

interface OrganizationModalProps {
    visible: boolean;
    onClose: () => void;
  }

  const OrganizationModal: React.FC<OrganizationModalProps> = ({ visible, onClose }) => {  return (
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
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default OrganizationModal;