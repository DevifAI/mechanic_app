import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { styles } from "../../styles/MechanicIncharge/RequisitonStyles";
import RejectReportModal from '../../Modal/RejectReport';
import Ionicons from 'react-native-vector-icons/Ionicons';


const { width } = Dimensions.get('window');

type RequisitionType = 'Submitted' | 'Issued' | 'Approval' | 'All';

type RequisitionItem = {
  id: string;
  username: string;
  date: string;
  time: string;
  type: RequisitionType;
};

const requisitions: RequisitionItem[] = [
  {
    id: '90886633',
    username: 'g8sanju1982',
    date: '05/07/25',
    time: '01:42 PM',
    type: 'Issued',
  },
  {
    id: '90886634',
    username: 'm8roy2233',
    date: '05/07/25',
    time: '01:42 PM',
    type: 'Approval',
  },
];

const TABS: RequisitionType[] = ['Submitted', 'Approval', 'Issued', 'All'];

const Receipt = () => {
  const [activeTab, setActiveTab] = useState<RequisitionType>('All');
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedRequisition, setSelectedRequisition] = useState<RequisitionItem | null>(null);
  const navigation = useNavigation<any>();

  const filteredRequisitions =
    activeTab === 'All'
      ? requisitions
      : requisitions.filter(item => item.type === activeTab);

  const handleReject = (item: RequisitionItem) => {
    setSelectedRequisition(item);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: RequisitionItem }) => (
    <View style={styles.card}>
      <View style={styles.leftSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.username.charAt(0).toLowerCase()}</Text>
        </View>
        <View style={styles.meta}>
          <Text style={styles.date}>{item.date}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
      </View>

      <View style={styles.middleSection}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.description}>
          In id cursus mi pretium tellus duis sed diam urna tempor. Pulvinar vivamus
        </Text>
      </View>

      <View style={styles.rightSection}>
        <View style={styles.buttonGroup}>
        <TouchableOpacity
  style={styles.approveBtn}
  onPress={() => navigation.navigate('Approve')}>
  <Text style={styles.approveText}>Approve</Text>
</TouchableOpacity>

          <TouchableOpacity style={styles.rejectBtn} onPress={() => handleReject(item)}>
            <Text style={styles.rejectText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.topBar}>
       <View style={styles.rightIcons}>
               <TouchableOpacity  onPress={() => navigation.openDrawer()}>
                   <Ionicons name="menu" size={30} color="black" />
               </TouchableOpacity>
              <Text style={styles.title}>Reciept</Text>
               </View>
        <View style={styles.rightIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="support-agent" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="notifications-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map(tab => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTab]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filteredRequisitions}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 100 }}
      />

      {/* Modal */}
      <RejectReportModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSave={(reason) => {
          console.log(`Requisition ${selectedRequisition?.id} rejected for:`, reason);
          setModalVisible(false);
        }}
      />
    </View>
  );
};

export default Receipt;


