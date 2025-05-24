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
type EquipmentOutCategory = 'new' | 'transfer' | 'repair' | 'site return';

type EquipmentOutItem = {
  id: string;
  date: string;
  items: EquipmentItem[];
  type: EquipmentOutCategory;
  accountManagerApproval?: ApprovalStatus;
  projectManagerApproval?: ApprovalStatus;
  reasonOut: string;
  partner?:string
};

type EquipmentOutType = 'Submitted' | 'Approvals' | 'Issued' | 'All';

type EquipmentItem = {
  equipment: string;
  quantity: number;
  uom: string;
  notes: string;
};

const { width } = Dimensions.get('window');

const equipmentOutData: EquipmentOutItem[] = [
  {
    id: '90886633',
    date: '1/5/2025',
    type: 'new',
    items: [
      { equipment: 'Generator', quantity: 2, uom: 'pcs', notes: 'Backup power' },
      { equipment: 'Compressor', quantity: 1, uom: 'pcs', notes: 'Air compressor' },
    ],
    projectManagerApproval: 'pending',
    reasonOut: 'To support new site setup',
  },
  {
    id: '90886634',
    date: '2/5/2025',
    type: 'transfer',
    items: [
      { equipment: 'Welding Machine', quantity: 3, uom: 'pcs', notes: 'Arc welding' },
    ],
    projectManagerApproval: 'approved',
    reasonOut: 'Urgent welding work at site B',
  },
  {
    id: '90886635',
    date: '3/5/2025',
    type: 'repair',
    items: [
      { equipment: 'Crane', quantity: 1, uom: 'pcs', notes: 'For lifting' },
    ],
    projectManagerApproval: 'rejected',
    reasonOut: 'Not approved for crane transfer',
    partner: 'ABC Repairs Ltd',
  },
  {
    id: '90886636',
    date: '4/5/2025',
    type: 'site return',
    items: [
      { equipment: 'Paint Sprayer', quantity: 2, uom: 'pcs', notes: 'For painting' },
    ],
    projectManagerApproval: 'approved',
    reasonOut: 'Final coat needed for finishing',
  },
];



const TABS: EquipmentOutType[] = ['Submitted', 'Approvals', 'Issued', 'All'];

const EquipmentOut = () => {
  const [activeTab, setActiveTab] = useState<EquipmentOutType>('Submitted');
  const navigation = useNavigation<any>();
   const { role } = useSelector((state: RootState) => state.auth);

const filteredEquipmentOutData = equipmentOutData.filter(item => {
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

  const renderItem = ({ item }: { item: EquipmentOutItem }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          <Text style={styles.date}>Date: {item.date}</Text>
          {/* <Text style={styles.itemCount}>Type: {item.type}</Text> */}
          <Text style={styles.itemCount}>Total No. of Equipments: {item.items.length}</Text>
        </View>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => navigation.navigate('ViewItems', { document: item, ScreenType: 'equipmentout' })}
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
          <TouchableOpacity
                         onPress={() => {
                           if (role === 'accountManager') {
                             navigation.goBack();
                           } else {
                             navigation.openDrawer();
                           }
                         }}
                         style={{ paddingHorizontal: 10 }}
                       >
                         <Ionicons
                           name={role === 'accountManager' ? 'arrow-back' : 'menu'}
                           size={30}
                           color="black"
                         />
                       </TouchableOpacity>
          <Text style={styles.title}>Equipment Out</Text>
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
        data={filteredEquipmentOutData}
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

export default EquipmentOut;
