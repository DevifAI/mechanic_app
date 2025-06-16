import React, {useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {
  logout,
  updateCurrentProject,
  updateSelectedProjectNumber,
} from '../redux/slices/authSlice';
import useSuperadmin from '../hooks/useSuperadmin';
import {RootState} from '../redux/store';

const {width, height} = Dimensions.get('window');

interface OrganizationModalProps {
  visible: boolean;
  onClose: () => void;
}

const OrganizationModal: React.FC<OrganizationModalProps> = ({
  visible,
  onClose,
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const {userId, projectList, projectId} = useSelector(
    (state: RootState) => state.auth,
  );
  const {getProjectsUsingUserId} = useSuperadmin();

  // useEffect(() => {
  //   if (visible && userId) {
  //     getProjectsUsingUserId(userId);
  //   }
  // }, [visible, userId]);

  useEffect(() => {
    console.log('Projects:', projectList);
  }, [projectList]);

  const handleProjectSelect = (projectId: string, projectNumber: string) => {
    console.log("projet idddddddddddddddddddddddddddd" , projectId , projectNumber)
    dispatch(updateCurrentProject(projectId));
    dispatch(updateSelectedProjectNumber(projectNumber));
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalHeaderButton}
              onPress={onClose}>
              <Text style={styles.modalHeaderButtonText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Project List</Text>
            <TouchableOpacity style={styles.modalHeaderButton}>
              <Text style={styles.modalHeaderButtonText}>Manage</Text>
            </TouchableOpacity>
          </View>

          {/* Project List */}
          <ScrollView style={styles.modalContent}>
            {projectList?.map((project: any) => {
              const isSelected = projectId === project.id;
              return (
                <Pressable
                  key={project?.id}
                  onPress={() =>
                    handleProjectSelect(
                      project?.id,
                      project?.project_no || 'Unnamed'
                    )
                  }>
                  <View
                    style={[
                      styles.orgInfoContainer,
                      isSelected && styles.selectedProject,
                    ]}>
                    <View style={styles.logoWrapper}>
                      <Image
                        source={require('../assets/Home/SoftSkirl.png')}
                        style={styles.Modallogo}
                      />
                    </View>
                    <View style={styles.orgTextContainer}>
                      <Text style={styles.orgName}>
                        {project?.project_no || 'Unnamed Project'}
                      </Text>
                    </View>
                    <View style={styles.tickContainer}>
                      {isSelected && (
                        <MaterialIcons
                          name="check-circle"
                          size={24}
                          color="#4CAF50"
                        />
                      )}
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    height: '100%',
    width: '100%',
    paddingTop: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalContent: {
    backgroundColor: '#E7E7E7',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 10,
    flex: 1,
  },
  orgInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedProject: {
    borderWidth: 2,
    borderColor: '#4CAF50',
    backgroundColor: '#f8fff8',
  },
  logoWrapper: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orgTextContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  tickContainer: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Modallogo: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  orgName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'left',
  },
  orgId: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    textAlign: 'left',
  },
  modalHeaderButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 60,
  },
  modalHeaderButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  logoutButton: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: '#E53935',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrganizationModal;
