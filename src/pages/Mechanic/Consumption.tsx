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
import { styles } from "../../styles/Mechanic/RequisitionStyles"; // Update this path if needed
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

type ConsumptionType = 'Submitted' | 'Approvals' | 'Issued' | 'All';

type Item = {
  item: string;
  quantity: number;
  uom: string;
  notes: string;
  equipment: string;
  readingMeterNo?: string;
  readingMeterUom?: string;
};

type ConsumptionItem = {
  id: string;
  date: string;
  items: Item[];
  mechanicInchargeApproval: boolean;
  siteInchargeApproval: boolean;
  projectManagerApproval: boolean;
};

const { width, height } = Dimensions.get('window');

const consumptions: ConsumptionItem[] = [
  {
    id: '90886633',
    date: '1/5/2025',
    items: [
      {
        item: 'Wrench',
        quantity: 5,
        uom: 'pcs',
        notes: 'For engine maintenance',
        equipment: 'Hydraulic Brakes',
      },
      {
        item: 'Bolt',
        quantity: 50,
        uom: 'pcs',
        notes: 'Standard size',
        equipment: 'Suspension System',
      },
    ],
    mechanicInchargeApproval: false,
    siteInchargeApproval: false,
    projectManagerApproval: false,
  },
  {
    id: '90886634',
    date: '2/5/2025',
    items: [
      {
        item: 'Screwdriver',
        quantity: 10,
        uom: 'pcs',
        notes: 'Flathead',
        equipment: 'Control Panel',
      },
    ],
    mechanicInchargeApproval: true,
    siteInchargeApproval: false,
    projectManagerApproval: false,
  },
  {
    id: '90886635',
    date: '3/5/2025',
    items: [
      {
        item: 'Pipe',
        quantity: 20,
        uom: 'm',
        notes: 'PVC type',
        equipment: 'Water Cooling System',
      },
      {
        item: 'Diesel',
        quantity: 15,
        uom: 'liters',
        notes: 'Generator refill',
        equipment: 'Backup Generator',
        readingMeterNo: '24567',
        readingMeterUom: 'hours',
      },
    ],
    mechanicInchargeApproval: true,
    siteInchargeApproval: true,
    projectManagerApproval: false,
  },
  {
    id: '90886636',
    date: '4/5/2025',
    items: [
      {
        item: 'Diesel',
        quantity: 20,
        uom: 'liters',
        notes: 'Refilled after maintenance',
        equipment: 'Hydraulic Pump',
        readingMeterNo: '30210',
        readingMeterUom: 'hours',
      },
    ],
    mechanicInchargeApproval: true,
    siteInchargeApproval: true,
    projectManagerApproval: true,
  },
];



const TABS: ConsumptionType[] = ['Submitted', 'Approvals', 'Issued', 'All'];

const Consumption = () => {
  const [activeTab, setActiveTab] = useState<ConsumptionType>('Submitted');
  const navigation = useNavigation<any>();

  const filteredConsumptions = consumptions.filter(item => {
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

  const renderItem = ({ item }: { item: ConsumptionItem }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          <Text style={styles.date}>Date : {item.date}</Text>
          <Text style={styles.itemCount}>Total No. of Items : {item.items.length}</Text>
        </View>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => navigation.navigate('ViewItems', { document: item, type: 'consumption' })}
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
          <Text style={styles.title}>Consumption</Text>
        </View>
        <View style={styles.rightIcons}>
          <TouchableOpacity style={styles.iconButton} onPress={() => console.log('Pressed!')}>
            <MaterialIcons name="support-agent" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => console.log('Pressed!')}>
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
        data={filteredConsumptions}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: width * 0.04 }}
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('CreateConsumption')}
        style={styles.fab}
      >
        <Text style={styles.fabIcon}>＋</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Consumption;
