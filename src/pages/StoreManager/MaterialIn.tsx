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
type MaterialInCategory = 'new' | 'transfer' | 'repair' | 'site return';

type MaterialInItem = {
  id: string;
  date: string;
  items: Item[];
  accountManagerApproval: ApprovalStatus;
  projectManagerApproval: ApprovalStatus;
  type: MaterialInCategory;
  partner: string;
  challanNo: string;
};

type MaterialInTab = 'Submitted' | 'Approvals' | 'Issued' | 'All';


type Item = {
  item: string;
  quantity: number;
  uom: string;
  notes: string;
};

const { width } = Dimensions.get('window');

const materialInData: MaterialInItem[] = [
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
    partner: 'ABC Supplies',
    challanNo: 'CH12345',
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
    challanNo: 'CH12346',
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
    partner: 'LMN Pipes',
    challanNo: 'CH12347',
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
    partner: 'OPQ Paints',
    challanNo: 'CH12348',
  },
];


const TABS: MaterialInTab[] = ['Submitted', 'Approvals', 'Issued', 'All'];

const MaterialIn = () => {
  const [activeTab, setActiveTab] = useState<MaterialInTab>('Submitted');
  const navigation = useNavigation<any>();
 const { role } = useSelector((state: RootState) => state.auth);

const filteredMaterialInData = materialInData.filter(item => {
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
  const renderItem = ({ item }: { item: MaterialInItem }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          <Text style={styles.date}>Date: {item.date}</Text>
          <Text style={styles.itemCount}>Type: {item.type}</Text>
          <Text style={styles.itemCount}>Challan No: {item.challanNo}</Text>
          <Text style={styles.itemCount}>Total No. of Items: {item.items.length}</Text>
        </View>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => navigation.navigate('ViewItems', { document: item, ScreenType: 'materialin' })}
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
          <Text style={styles.title}>Material In</Text>
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
        data={filteredMaterialInData}
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

export default MaterialIn;
