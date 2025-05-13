import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native';

const { width, height } = Dimensions.get('window');


interface RejectReportModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (reason: string) => void; // Assuming onSave takes a reason string
  }

  const RejectReportModal: React.FC<RejectReportModalProps> = ({ visible, onClose, onSave }) => {
    
  const [reason, setReason] = useState('');

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Reject Report</Text>
            <TouchableOpacity onPress={() => onSave(reason)}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Kindly provide a valid reason for the rejection.
          </Text>

          <TextInput
            style={styles.textArea}
            placeholder="Type here..."
            multiline
            value={reason}
            onChangeText={setReason}
            textAlignVertical="top"
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: width * 0.06,
    width: '100%',
    minHeight: height * 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.015,
  },
  title: {
    fontSize: width * 0.05,
    fontWeight: '600',
  },
  cancelText: {
    color: '#007aff',
    fontSize: width * 0.045,
  },
  saveText: {
    color: '#007aff',
    fontSize: width * 0.045,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: width * 0.04,
    color: '#666',
    margin: height * 0.015,
  },
  textArea: {
    height: height * 0.2,
    borderColor: '#007aff',
    borderWidth: 1,
    borderRadius: 10,
    padding: width * 0.04,
    fontSize: width * 0.038,
    backgroundColor: '#fff',
  },
});

export default RejectReportModal;
