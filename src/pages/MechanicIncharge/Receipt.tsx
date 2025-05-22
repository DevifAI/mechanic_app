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

type ReceiptType = 'Open' | 'Rejected' | 'Approved';

type ReceiptItem = {
  id: string;
  username: string;
  date: string;
  time: string;
  type: ReceiptType;
  items: {
    item: string;
    quantity: number;
    uom: string;
    notes: string;
  }[];
};

const requisitions: ReceiptItem[] = [
  {
    id: '90886633',
    username: 'Amit Sharma',
    date: '1/5/2025',
    time: '09:15',
    type: 'Open',
    items: [
      { item: 'Wrench', quantity: 5, uom: 'pcs', notes: 'For engine maintenance' },
      { item: 'Bolt', quantity: 50, uom: 'pcs', notes: 'Standard size' },
    ],
  },
  {
    id: '90886634',
    username: 'Neha Verma',
    date: '2/5/2025',
    time: '10:30',
    type: 'Open',
    items: [
      { item: 'Screwdriver', quantity: 10, uom: 'pcs', notes: 'Flathead' },
    ],
  },
  {
    id: '90886635',
    username: 'Raj Patel',
    date: '3/5/2025',
    time: '14:45',
    type: 'Open',
    items: [
      { item: 'Pipe', quantity: 20, uom: 'm', notes: 'PVC type' },
    ],
  },
  {
    id: '90886636',
    username: 'Sneha Reddy',
    date: '4/5/2025',
    time: '11:00',
    type: 'Approved',
    items: [
      { item: 'Paint', quantity: 10, uom: 'liters', notes: 'Exterior use' },
    ],
  },
];


const TABS: ReceiptType[] = ['Open', 'Rejected', 'Approved'];

const Receipt = () => {
  const [activeTab, setActiveTab] = useState<ReceiptType>('Open');
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<any>();

  const filteredRequisitions =
    activeTab === 'Open'
      ? requisitions
      : requisitions.filter(item => item.type === activeTab);

  const handleRejectPress = () => {
    setModalVisible(true);
  };

const renderItem = ({ item }: { item: ReceiptItem }) => (
  <View style={styles.card}>
    <View style={styles.cardContent}>
      <View style={styles.leftSection}>
          <Text style={styles.date}>Mechanic name : {item.username}</Text>
        <Text style={styles.date}>Date : {item.date}</Text>
        <Text style={styles.itemCount}>Total No. of Items : {item.items.length}</Text>
      </View>
      <TouchableOpacity style={styles.viewButton} 
        onPress={() => navigation.navigate('ViewItems', { document: item , type: 'receipt' })} >
        <Text style={styles.viewButtonText}>View</Text>
      </TouchableOpacity>
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
        <Text style={styles.title}>Receipt</Text>
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

    </View>
  );
};

export default Receipt;