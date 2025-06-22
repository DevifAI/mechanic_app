import React, {useState} from 'react';
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
import {styles} from '../../styles/Mechanic/RequisitionStyles';
import {useNavigation, useRoute} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import useEquipmentInOrOut, {
  EquipmentDataType,
} from '../../hooks/useEquipmentInOrout';

const {width} = Dimensions.get('window');

type ApprovalStatus = 'pending' | 'approved' | 'rejected';
type EquipmentInCategory = 'new' | 'transfer' | 'repair' | 'site return';

type EquipmentItem = {
  equipment: string;
  quantity: number;
  uom: string;
  notes: string;
};

type EquipmentInItem = {
  id: string;
  date: string;
  items: EquipmentItem[];
  accountManagerApproval: ApprovalStatus;
  projectManagerApproval: ApprovalStatus;
  type: EquipmentInCategory;
  partner: string;
};

type EquipmentInTab = 'Submitted' | 'Approvals' | 'Issued' | 'All';

const equipmentInData: EquipmentInItem[] = [
  {
    id: 'EQ-001',
    date: '2025-05-01',
    items: [
      {equipment: 'Excavator', quantity: 1, uom: 'pcs', notes: 'New unit'},
      {
        equipment: 'Hammer Drill',
        quantity: 5,
        uom: 'pcs',
        notes: 'For concrete work',
      },
    ],
    accountManagerApproval: 'pending',
    projectManagerApproval: 'pending',
    type: 'new',
    partner: 'MegaBuild Supplies',
  },
  {
    id: 'EQ-002',
    date: '2025-05-02',
    items: [
      {equipment: 'Jackhammer', quantity: 2, uom: 'pcs', notes: 'Urgent use'},
    ],
    accountManagerApproval: 'approved',
    projectManagerApproval: 'pending',
    type: 'repair',
    partner: 'ToolZone Ltd.',
  },
  {
    id: 'EQ-003',
    date: '2025-05-03',
    items: [
      {
        equipment: 'Bulldozer',
        quantity: 1,
        uom: 'pcs',
        notes: 'Transfer to site',
      },
    ],
    accountManagerApproval: 'approved',
    projectManagerApproval: 'approved',
    type: 'transfer',
    partner: 'HeavyEquip Rentals',
  },
  {
    id: 'EQ-004',
    date: '2025-05-04',
    items: [
      {
        equipment: 'Generator',
        quantity: 1,
        uom: 'pcs',
        notes: 'Returned from site',
      },
    ],
    accountManagerApproval: 'rejected',
    projectManagerApproval: 'pending',
    type: 'site return',
    partner: 'PowerTech Co.',
  },
];
const TABS: EquipmentInTab[] = ['Submitted', 'Approvals', 'Issued', 'All'];

const EquipmentScreen = () => {
  const [activeTab, setActiveTab] = useState<EquipmentInTab>('Submitted');
  const navigation = useNavigation<any>();
  const {role} = useSelector((state: RootState) => state.auth);

  const {Equipments, loading, fetchEquipments} = useEquipmentInOrOut();

  const route = useRoute<any>();

  const filteredEquipmentInData = Equipments.filter(item => {
    if (activeTab === 'All') return true;

    if (activeTab === 'Submitted') {
      return (
        item.accountManagerApproval === 'pending' &&
        item.projectManagerApproval === 'pending'
      );
    }

    if (activeTab === 'Approvals') {
      return (
        item.accountManagerApproval === 'approved' &&
        item.projectManagerApproval === 'pending'
      );
    }

    if (activeTab === 'Issued') {
      return (
        item.accountManagerApproval === 'approved' &&
        item.projectManagerApproval === 'approved'
      );
    }

    return false;
  });

  const renderItem = ({item}: {item: EquipmentInItem}) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          <Text style={styles.date}>Date: {item.date}</Text>
          <Text style={styles.itemCount}>Type: {item.type}</Text>
          {/* Removed Challan No */}
          <Text style={styles.itemCount}>
            Total No. of Equipments: {item.items.length}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() =>
            navigation.navigate('ViewItems', {
              document: item,
              ScreenType: 'equipmentin',
            })
          }>
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  React.useEffect(() => {
    fetchEquipments(
      route?.name === 'EquipmentIn'
        ? EquipmentDataType.IN
        : EquipmentDataType.OUT,
    );
  }, [route?.name, activeTab]);

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
            style={{paddingHorizontal: 10}}>
            <Ionicons
              name={role === 'accountManager' ? 'arrow-back' : 'menu'}
              size={30}
              color="black"
            />
          </TouchableOpacity>
          <Text style={styles.title}>Equipment In</Text>
        </View>
        <View style={styles.rightIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => console.log('Support pressed!')}>
            <MaterialIcons name="support-agent" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => console.log('Notifications pressed!')}>
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
        <View style={{}}>
          <Text style={{}}>Loading...</Text>
        </View>
      ) : filteredEquipmentInData.length === 0 ? (
        <View style={{}}>
          <Text style={{}}>No Equipment In records found.</Text>
        </View>
      ) : null}
      <FlatList
        data={filteredEquipmentInData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{paddingHorizontal: width * 0.04}}
      />

      {/* Floating Add Button */}
      {role !== 'accountManager' && (
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateEquipmentIn')}
          style={styles.fab}>
          <Text style={styles.fabIcon}>＋</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default EquipmentScreen;
