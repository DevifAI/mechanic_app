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
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const { width } = Dimensions.get('window');

type LogType = 'Open' | 'Rejected' | 'Approved';


type LogItem = {
  id: string;
  mantainanceLogNo: string;
  note: string;
  equipment: string;
  nextDate: string;
  date: string;
  actionPlan: string;
  items: {
    item: string;
    quantity: number;
    uom: string;
    notes: string;
  }[];
  username: string;
  type: 'Open' | 'Rejected' | 'Approved';
};


const logs: LogItem[] = [
  {
    id: '90886633',
    mantainanceLogNo: 'ML-90886633',
    note: 'Multiple equipment maintenance',
    equipment: 'Hydraulic Brakes',
    nextDate: '15/5/2025',
    date: "01/5/26",
    actionPlan: 'Check tightness and lubrication',
    username: 'Amit Sharma',
    type: 'Open',
    items: [
      {
        item: 'Wrench',
        quantity: 5,
        uom: 'pcs',
        notes: 'For engine maintenance ',
       
      },
      {
        item: 'Bolt',
        quantity: 50,
        uom: 'pcs',
        notes: 'Standard size',
        
      },
       {
        item: 'Screwdriver',
        quantity: 10,
        uom: 'pcs',
        notes: 'Flathead',
        
      },
    ],
  },
  {
    id: '90886634',
    mantainanceLogNo: 'ML-90886634',
    note: 'Control panel inspection',
    equipment: 'Control Panel',
    nextDate: '16/5/2025',
    date: "11/5/26",
    actionPlan: 'Replace worn tools',
    username: 'Neha Verma',
    type: 'Open',
    items: [
      {
        item: 'Screwdriver',
        quantity: 10,
        uom: 'pcs',
        notes: 'Flathead',
        
      },
    ],
  },
  {
    id: '90886635',
    mantainanceLogNo: 'ML-90886635',
    note: 'Water system and generator check',
    equipment: 'Water Cooling System',
    nextDate: '18/5/2025',
    date: "21/5/26",
    actionPlan: 'Inspect connections and refill fuel',
    username: 'Raj Patel',
    type: 'Open',
    items: [
      {
        item: 'Pipe',
        quantity: 20,
        uom: 'm',
        notes: 'PVC type',
        
      },
      {
        item: 'Diesel',
        quantity: 15,
        uom: 'liters',
        notes: 'Generator refill',
        
      },
    ],
  },
  {
    id: '90886636',
    mantainanceLogNo: 'ML-90886636',
    note: 'Post-maintenance fuel refill',
    equipment: 'Hydraulic Pump',
    nextDate: '19/5/2025',
    date: "05/5/26",
    actionPlan: 'Monitor meter and refill weekly',
    username: 'Sneha Reddy',
    type: 'Approved',
    items: [
      {
        item: 'Diesel',
        quantity: 20,
        uom: 'liters',
        notes: 'Refilled after maintenance'
      },
    ],
  },
];


const TABS: LogType[] = ['Open', 'Rejected', 'Approved'];

const Log = () => {
  const [activeTab, setActiveTab] = useState<LogType>('Open');
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<any>();
  const { role } = useSelector((state: RootState) => state.auth);
  const filteredLogs =
    activeTab === 'Open'
      ? logs
      : logs.filter(item => item.type === activeTab);

  const renderItem = ({ item }: { item: LogItem }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          <Text style={styles.date}>Mechanic name : {item.username}</Text>
          <Text style={styles.date}>Date : {item.date}</Text>
          <Text style={styles.itemCount}>Total No. of Items : {item.items.length}</Text>
        </View>
        <TouchableOpacity style={styles.viewButton} 
          onPress={() => navigation.navigate('ViewItems', { document: item , type: 'log' })} >
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
        if (role === 'siteIncharge') {
          navigation.goBack();
        } else {
          navigation.openDrawer();
        }
      }}
      style={{ paddingHorizontal: 10 }}
    >
      <Ionicons
        name={role === 'siteIncharge' ? 'arrow-back' : 'menu'}
        size={30}
        color="black"
      />
    </TouchableOpacity>
    
          <Text style={styles.title}>Maintainance Log</Text>
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
        data={filteredLogs}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 100 }}
      />

    </View>
  );
};

export default Log;
