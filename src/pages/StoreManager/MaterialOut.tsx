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
import { styles } from "../../styles/Mechanic/RequisitionStyles";
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

type ApprovalStatus = 'pending' | 'approved' | 'rejected';
type MaterialOutCategory = 'new' | 'transfer' | 'repair' | 'site return';

type MaterialOutItem = {
  id: string;
  date: string;
  items: Item[];
  accountManagerApproval: ApprovalStatus;
  projectManagerApproval: ApprovalStatus;
  type: MaterialOutCategory;
  partner?: string;
};

type MaterialOutType = 'Submitted' | 'Approvals' | 'Issued' | 'All';

type Item = {
  item: string;
  quantity: number;
  uom: string;
  notes: string;
};

const { width } = Dimensions.get('window');

const materialOutData: MaterialOutItem[] = [
  {
    id: '90886633',
    date: '1/5/2025',
    items: [
      { item: 'Wrench', quantity: 5, uom: 'pcs', notes: 'For engine maintenance' },
      { item: 'Bolt', quantity: 50, uom: 'pcs', notes: 'Standard size' },
    ],
    projectManagerApproval: 'pending',
    accountManagerApproval: 'pending',
    type: 'new',
  },
  {
    id: '90886634',
    date: '2/5/2025',
    items: [
      { item: 'Screwdriver', quantity: 10, uom: 'pcs', notes: 'Flathead' },
    ],
    projectManagerApproval: 'approved',
    accountManagerApproval: 'approved',
    type: 'repair',
    partner: 'XYZ Tools',
  },
  {
    id: '90886635',
    date: '3/5/2025',
    items: [
      { item: 'Pipe', quantity: 20, uom: 'm', notes: 'PVC type' },
    ],
    projectManagerApproval: 'rejected',
    accountManagerApproval: 'approved',
    type: 'transfer',
  },
  {
    id: '90886636',
    date: '4/5/2025',
    items: [
      { item: 'Paint', quantity: 10, uom: 'liters', notes: 'Exterior use' },
    ],
    projectManagerApproval: 'approved',
    accountManagerApproval: 'approved',
    type: 'site return',
  },
];


const TABS: MaterialOutType[] = ['Submitted', 'Approvals', 'Issued', 'All'];

const MaterialOut = () => {
  const [activeTab, setActiveTab] = useState<MaterialOutType>('Submitted');
  const navigation = useNavigation<any>();
   const { role } = useSelector((state: RootState) => state.auth);

  const filteredMaterialOutData = materialOutData.filter(item => {
     if (activeTab === 'All') return true;

  if (activeTab === 'Submitted') {
    return item.accountManagerApproval === 'pending' &&
           item.projectManagerApproval === 'pending';
  }

  if (activeTab === 'Approvals') {
    return item.accountManagerApproval === 'approved' &&
           item.projectManagerApproval === 'pending';
  }

  if (activeTab === 'Issued') {
    return item.accountManagerApproval === 'approved' &&
           item.projectManagerApproval === 'approved';
  }

  return false;
});

  const renderItem = ({ item }: { item: MaterialOutItem }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          <Text style={styles.date}>Date: {item.date}</Text>
          <Text style={styles.itemCount}>Type: {item.type}</Text>
          <Text style={styles.itemCount}>Total No. of Items: {item.items.length}</Text>
        </View>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => navigation.navigate('ViewItems', { document: item, ScreenType: 'materialout' })}
        >
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
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={30} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Material Out</Text>
        </View>
        <View style={styles.rightIcons}>
          <TouchableOpacity style={styles.iconButton} onPress={() => console.log('Support pressed!')}>
            <MaterialIcons name="support-agent" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => console.log('Notifications pressed!')}>
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
        data={filteredMaterialOutData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: width * 0.04 }}
      />

      {/* Floating Add Button */}
        {role !== 'accountManager' && (
  <TouchableOpacity
    onPress={() => navigation.navigate('CreateEquipmentIn')}
    style={styles.fab}
  >
    <Text style={styles.fabIcon}>＋</Text>
  </TouchableOpacity>
)}
    </View>
  );
};

export default MaterialOut;
