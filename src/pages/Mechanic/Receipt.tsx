// ReceiptScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../../styles/Mechanic/ReceiptStyles';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

type TabType = 'Submitted' | 'Approvals' | 'Issued' | 'All';

type Item = {
  item: string;
  quantity: number;
  uom: string;
  notes: string;
};

type ReceiptItem = {
  id: string;
  date: string;
  items: Item[];
  mechanicInchargeApproval: boolean;
  siteInchargeApproval: boolean;
  projectManagerApproval: boolean;
};

const receipts: ReceiptItem[] =  [
  {
    id: '90886633',
    date: '1/5/2025',
    items: [
      { item: 'Wrench', quantity: 5, uom: 'pcs', notes: 'For engine maintenance' },
      { item: 'Bolt', quantity: 50, uom: 'pcs', notes: 'Standard size' },
    ],
    mechanicInchargeApproval: false,
    siteInchargeApproval: false,
    projectManagerApproval: false,
  },
  {
    id: '90886634',
    date: '2/5/2025',
    items: [
      { item: 'Screwdriver', quantity: 10, uom: 'pcs', notes: 'Flathead' },
    ],
    mechanicInchargeApproval: true,
    siteInchargeApproval: false,
    projectManagerApproval: false,
  },
  {
    id: '90886635',
    date: '3/5/2025',
    items: [
      { item: 'Pipe', quantity: 20, uom: 'm', notes: 'PVC type' },
    ],
    mechanicInchargeApproval: true,
    siteInchargeApproval: true,
    projectManagerApproval: false,
  },
  {
    id: '90886636',
    date: '4/5/2025',
    items: [
      { item: 'Paint', quantity: 10, uom: 'liters', notes: 'Exterior use' },
    ],
    mechanicInchargeApproval: true,
    siteInchargeApproval: true,
    projectManagerApproval: true,
  },
];

const TABS: TabType[] = ['Submitted', 'Approvals', 'Issued', 'All'];

const Receipt = () => {
  const [activeTab, setActiveTab] = useState<TabType>('Submitted');
  const navigation = useNavigation<any>();

  const filteredReceipts = receipts.filter(item => {
    const { mechanicInchargeApproval, siteInchargeApproval, projectManagerApproval } = item;

    switch (activeTab) {
      case 'Submitted':
        return !mechanicInchargeApproval;

      case 'Approvals':
        return (
          mechanicInchargeApproval &&
          !projectManagerApproval
        );

      case 'Issued':
        return (
          mechanicInchargeApproval &&
          siteInchargeApproval &&
          projectManagerApproval
        );

      case 'All':
      default:
        return true;
    }
  });

  const renderItem = ({ item }: { item: ReceiptItem }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          <Text style={styles.date}>Date : {item.date}</Text>
          <Text style={styles.itemCount}>Total No. of Items : {item.items.length}</Text>
        </View>
        <TouchableOpacity style={styles.viewButton} 
         onPress={() => navigation.navigate('ViewItems', { document: item , ScreenType: 'receipt' })} >
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
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTab,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filteredReceipts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />

      {/* Floating Button */}
      <TouchableOpacity 
        onPress={() => navigation.navigate('CreateReceipt')}
        style={styles.fab}>
        <Text style={styles.fabIcon}>＋</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Receipt;
