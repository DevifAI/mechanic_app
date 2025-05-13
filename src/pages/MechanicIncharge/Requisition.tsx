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


const { width } = Dimensions.get('window');

type RequisitionType = 'Open' | 'Rejected' | 'Approved';

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
    type: 'Open',
  },
  {
    id: '90886634',
    username: 'm8roy2233',
    date: '05/07/25',
    time: '01:42 PM',
    type: 'Open',
  },
];

const TABS: RequisitionType[] = ['Open', 'Rejected', 'Approved'];

const Requisition = () => {
  const [activeTab, setActiveTab] = useState<RequisitionType>('Open');
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<any>();

  const filteredRequisitions =
    activeTab === 'Open'
      ? requisitions
      : requisitions.filter(item => item.type === activeTab);

  const handleRejectPress = () => {
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
          <TouchableOpacity style={styles.rejectBtn} onPress={handleRejectPress}>
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
        <Text style={styles.title}>Requisition</Text>
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

      {/* Reject Modal */}
      <RejectReportModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSave={(reason) => {
          console.log('Rejected for:', reason);
          setModalVisible(false);
        }}
      />
    </View>
  );
};

export default Requisition;

