import React, {useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {styles} from '../styles/Mechanic/OrganizationModal';
import {logout, updateCurrentProject} from '../redux/slices/authSlice';
import useSuperadmin from '../hooks/useSuperadmin';
import {RootState} from '../redux/store';

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

  useEffect(() => {
    if (visible && userId) {
      getProjectsUsingUserId(userId);
    }
  }, [visible, userId]);

  useEffect(() => {
    console.log('Projects:', projectList);
  }, [projectList]);

  const handleProjectSelect = (projectId: string) => {
    dispatch(updateCurrentProject(projectId));
    onClose(); // Optional: auto-close on selection
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
                  onPress={() => handleProjectSelect(project?.id)}>
                  <View
                    style={[
                      styles.orgInfoContainer,
                      isSelected && {borderColor: '#4CAF50', borderWidth: 0},
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
                      {/* <Text style={styles.orgId}>
                        Project ID. {project?.id}
                      </Text> */}
                    </View>
                    {isSelected && (
                      <View style={styles.tickContainer}>
                        <MaterialIcons
                          name="check-circle"
                          size={30}
                          color="#4CAF50"
                        />
                      </View>
                    )}
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

export default OrganizationModal;
