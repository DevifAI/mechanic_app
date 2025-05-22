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
import { styles } from '../../styles/MechanicIncharge/RequisitonStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const { width } = Dimensions.get('window');

type ConsumptionType = 'Open' | 'Rejected' | 'Approved';

type Consumption = {
  id: string;
  date: string;
  username: string;
  type: ConsumptionType;
  items: {
    item: string;
    quantity: number;
    uom: string;
    notes: string;
    equipment: string;
  }[];
};

const consumptions: Consumption[] = [
  {
    id: '90886633',
    date: '01/5/2025',
    username: 'Amit Sharma',
    type: 'Open',
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
      {
        item: 'Screwdriver',
        quantity: 10,
        uom: 'pcs',
        notes: 'Flathead',
        equipment: 'Toolbox',
      },
    ],
  },
  {
    id: '90886634',
    date: '11/5/2025',
    username: 'Neha Verma',
    type: 'Open',
    items: [
      {
        item: 'Screwdriver',
        quantity: 10,
        uom: 'pcs',
        notes: 'Flathead',
        equipment: 'Control Panel',
      },
    ],
  },
  {
    id: '90886635',
    date: '21/5/2025',
    username: 'Raj Patel',
    type: 'Open',
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
        equipment: 'Generator',
      },
    ],
  },
  {
    id: '90886636',
    date: '05/5/2025',
    username: 'Sneha Reddy',
    type: 'Approved',
    items: [
      {
        item: 'Diesel',
        quantity: 20,
        uom: 'liters',
        notes: 'Refilled after maintenance',
        equipment: 'Hydraulic Pump',
      },
    ],
  },
];


const TABS: ConsumptionType[] = ['Open', 'Rejected', 'Approved'];

const Consumption = () => {
  const [activeTab, setActiveTab] = useState<ConsumptionType>('Open');
  const navigation = useNavigation<any>();
  const { role } = useSelector((state: RootState) => state.auth);
  const filteredConsumptions =
    activeTab === 'Open'
      ? consumptions
      : consumptions.filter(item => item.type === activeTab);

  const renderItem = ({ item }: { item: Consumption }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          <Text style={styles.date}>Mechanic name : {item.username}</Text>
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

          <Text style={styles.title}>Consumption</Text>
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
        data={filteredConsumptions}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 100 }}
      />
    </View>
  );
};

export default Consumption;
