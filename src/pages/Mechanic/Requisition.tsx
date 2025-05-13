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
import { styles } from "../../styles/Mechanic/RequisitionStyles"
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
type RequisitionType = 'Submitted' | 'Approval' | 'Issued' | 'All';

type RequisitionItem = {
  id: string;
  name: string;
  date: string;
  status: string;
  type: RequisitionType;
};

const { width, height } = Dimensions.get('window');

const requisitions: RequisitionItem[] = [
  { id: '90886633', name: 'Robin Kumar das', date: '5/5/2025', status: 'Draft', type: 'All' },
  { id: '90886634', name: 'Anjali Verma', date: '5/5/2025', status: 'Submitted', type: 'Submitted' },
  { id: '90886635', name: 'Ravi Singh', date: '5/5/2025', status: 'Approved', type: 'Approval' },
  { id: '90886636', name: 'Meena Das', date: '5/5/2025', status: 'Issued', type: 'Issued' },
];

const TABS: RequisitionType[] = ['Submitted', 'Approval', 'Issued', 'All'];

const Requisition = () => {
  const [activeTab, setActiveTab] = useState<RequisitionType>('All');
  const navigation = useNavigation<any>();
  
  const filteredRequisitions =
    activeTab === 'All'
      ? requisitions
      : requisitions.filter(item => item.type === activeTab);

  const renderItem = ({ item }: { item: RequisitionItem }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.id}>₹{item.id}</Text>
      </View>
      <Text style={styles.date}>{item.date} • {item.date}</Text>
      <Text style={styles.status}>{item.status}</Text>
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
        <Text style={styles.title}>Requisition</Text>
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
        data={filteredRequisitions}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: width * 0.04 }}
      />

      {/* Floating Add Button */}
      <TouchableOpacity 
       onPress={() => navigation.navigate('CreateRequisition')}
      style={styles.fab}>
        <Text style={styles.fabIcon}>＋</Text>
      </TouchableOpacity>
    </View>
  );
};


export default Requisition;
