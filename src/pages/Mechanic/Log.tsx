import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {styles} from '../../styles/Mechanic/RequisitionStyles'; // Update path if needed
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useMaintanance from '../../hooks/useMaintanance';

type LogType = 'Submitted' | 'Approvals' | 'Issued' | 'All';

type Item = {
  item: string;
  quantity: number;
  uom: string;
  notes: string;
  equipment: string;
};

type LogItem = {
  id: string;
  mantainanceLogNo: string;
  note: string;
  equipment: string;
  nextDate: string;
  date: string;
  actionPlan: string;
  items: Item[];
  mechanicInchargeApproval: boolean;
  siteInchargeApproval: boolean;
  projectManagerApproval: boolean;
};

const {width} = Dimensions.get('window');

// Sample logs
const logs: LogItem[] = [
  {
    id: '90886633',
    mantainanceLogNo: 'ML-90886633',
    note: 'Multiple equipment maintenance',
    equipment: 'Hydraulic Brakes',
    nextDate: '15/5/2025',
    date: '01/5/26',
    actionPlan: 'Check tightness and lubrication',
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
    mantainanceLogNo: 'ML-90886634',
    note: 'Control panel inspection',
    equipment: 'Control Panel',
    nextDate: '16/5/2025',
    date: '11/5/26',
    actionPlan: 'Replace worn tools',
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
    mantainanceLogNo: 'ML-90886635',
    note: 'Water system and generator check',
    equipment: 'Water Cooling System',
    nextDate: '18/5/2025',
    date: '21/5/26',
    actionPlan: 'Inspect connections and refill fuel',
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
      },
    ],
    mechanicInchargeApproval: true,
    siteInchargeApproval: true,
    projectManagerApproval: false,
  },
  {
    id: '90886636',
    mantainanceLogNo: 'ML-90886636',
    note: 'Post-maintenance fuel refill',
    equipment: 'Hydraulic Pump',
    nextDate: '19/5/2025',
    date: '05/5/26',
    actionPlan: 'Monitor meter and refill weekly',
    items: [
      {
        item: 'Diesel',
        quantity: 20,
        uom: 'liters',
        notes: 'Refilled after maintenance',
        equipment: 'Hydraulic Pump',
      },
    ],
    mechanicInchargeApproval: true,
    siteInchargeApproval: true,
    projectManagerApproval: true,
  },
];

const TABS: LogType[] = ['Submitted', 'Approvals', 'Issued', 'All'];

const Log = () => {
  const [activeTab, setActiveTab] = useState<LogType>('Submitted');
  const navigation = useNavigation<any>();

  const {loading, logItems, getAllMaintananceLogByUserId} = useMaintanance();

  const filteredLogs = logItems.filter(item => {
    const {
      mechanicInchargeApproval,
      siteInchargeApproval,
      projectManagerApproval,
    } = item;

    switch (activeTab) {
      case 'Submitted':
        return !mechanicInchargeApproval;

      case 'Approvals':
        return mechanicInchargeApproval && !projectManagerApproval;

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

  const renderItem = ({item}: {item: LogItem}) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          <Text style={styles.date}>Date: {item.date}</Text>
          <Text style={styles.itemCount}>
            Maintainance Log No: {item.mantainanceLogNo}
          </Text>
          <Text style={styles.itemCount}>Equipment Name: {item.equipment}</Text>
          <Text style={styles.itemCount}>
            Total No. of Items: {item.items.length}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() =>
            navigation.navigate('ViewItems', {document: item, ScrenType: 'log'})
          }>
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  useEffect(() => {
    getAllMaintananceLogByUserId();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      {/* Header */}
      <View style={styles.topBar}>
        <View style={styles.rightIcons}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={30} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Maintainance Log</Text>
        </View>
        <View style={styles.rightIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => console.log('Support pressed')}>
            <MaterialIcons name="support-agent" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => console.log('Notifications pressed')}>
            <Icon name="notifications-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map(tab => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
            <Text
              style={[styles.tabText, activeTab === tab && styles.activeTab]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}


 {loading ? (
        <ActivityIndicator size={'large'} style={{marginTop: '50%'}} color="#007AFF"/>
      ) : filteredLogs?.length === 0 ? (
          <Text style={{ fontSize: 18, color: '#666', textAlign: 'center' , marginTop:16 }}>No data found</Text>
      ) : (
        <FlatList
          data={filteredLogs}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{paddingHorizontal: width * 0.04}}
        />
      )}

      {/* Floating Add Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('CreateLog')}
        style={styles.fab}>
        <Text style={styles.fabIcon}>＋</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Log;
