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

type TabType = 'Submitted' | 'Approval' | 'Issued' | 'All';

type ReceiptItem = {
  id: string;
  name: string;
  date: string;
  status: string;
  type: TabType;
};

const RECEIPTS: ReceiptItem[] = [
  { id: '90886633', name: 'Robin Kumar das', date: '5/5/2025', status: 'Draft', type: 'All' },
];

const TABS: TabType[] = ['Submitted', 'Approval', 'Issued', 'All'];

const Receipt = () => {
  const [activeTab, setActiveTab] = useState<TabType>('All');
  const navigation = useNavigation<any>();

  const filteredReceipts =
    activeTab === 'All'
      ? RECEIPTS
      : RECEIPTS.filter(item => item.type === activeTab);

  const renderItem = ({ item }: { item: ReceiptItem }) => (
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
        <Text style={styles.title}>Reciept</Text>
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
