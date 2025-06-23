import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../../styles/Mechanic/RequisitionStyles';
import { useNavigation, useRoute } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

type DieselInvoiceType = 'Submitted' | 'Approvals' | 'Rejected' | 'All';

type Item = {
  item: string;
  quantity: number;
  uom: string;
  notes: string;
  unitRate: string;
  totalValue: string;
};

type DieselInvoiceItem = {
  id: string;
  date: string;
  items: Item[];
  projectManagerApproval: 'pending' | 'approved' | 'rejected';
};

const { width } = Dimensions.get('window');

const dieselInvoices: DieselInvoiceItem[] = [
  {
    id: '90886633',
    date: '1/5/2025',
    items: [
      {
        item: 'Wrench',
        quantity: 5,
        uom: 'pcs',
        notes: 'For engine maintenance',
        unitRate: '100',
        totalValue: '500',
      },
      {
        item: 'Bolt',
        quantity: 50,
        uom: 'pcs',
        notes: 'Standard size',
        unitRate: '10',
        totalValue: '500',
      },
    ],
    projectManagerApproval: 'pending',
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
        unitRate: '50',
        totalValue: '500',
      },
    ],
    projectManagerApproval: 'pending',
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
        unitRate: '40',
        totalValue: '800',
      },
    ],
    projectManagerApproval: 'rejected',
  },
  {
    id: '90886636',
    date: '4/5/2025',
    items: [
      {
        item: 'Paint',
        quantity: 10,
        uom: 'liters',
        notes: 'Exterior use',
        unitRate: '120',
        totalValue: '1200',
      },
    ],
    projectManagerApproval: 'approved',
  },
];

const TABS: DieselInvoiceType[] = ['Submitted', 'Approvals', 'Rejected', 'All'];

const DieselInvoice = () => {
  const [activeTab, setActiveTab] = useState<DieselInvoiceType>('Submitted');
  const navigation = useNavigation<any>();
const route = useRoute<any>();
  const {role, activeTab2, projectList , selectedProjectNumber} = useSelector((state: RootState) => state.auth);

const getTitle = () => {
  switch (route.name) {
    case 'MaterialBill':
      return 'Material Bill';
    case 'RevenueInput':
      return 'Revenue Input';
    case 'ExpenseInput':
      return 'Expense Input';
    case 'DieselInvoice':
      return 'Diesel Invoice';
    default:
      return 'Title';
  }
};


  const filteredDieselInvoices = dieselInvoices.filter(item => {
    const { projectManagerApproval } = item;

    switch (activeTab) {
      case 'Submitted':
        return projectManagerApproval === 'pending';

      case 'Approvals':
        return projectManagerApproval === 'approved';

      case 'Rejected':
        return projectManagerApproval === 'rejected';

      case 'All':
      default:
        return true;
    }
  });

  const renderItem = ({ item }: { item: DieselInvoiceItem }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          <Text style={styles.date}>Date : {item.date}</Text>
          <Text style={styles.itemCount}>Total No. of Items : {item.items.length}</Text>
        </View>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() =>
            navigation.navigate('ViewItems', {
              document: item,
              ScreenType: 'dieselInvoice',
            })
          }
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
    onPress={() =>
      route.name === 'DieselInvoice'
        ? navigation.openDrawer()
        : navigation.goBack()
    }
  >
    {route.name === 'DieselInvoice' ? (
      <Ionicons name="menu" size={30} color="black" />
    ) : (
      <Ionicons name="arrow-back" size={30} color="black" />
    )}
  </TouchableOpacity>
                 <View style={styles.LogoContainer}>
                                  <Image
                                    source={require('../../assets/Home/SoftSkirl.png')}
                                    style={styles.logo}
                                  />
                                  <Text style={styles.appName}>{selectedProjectNumber ? selectedProjectNumber : projectList?.[0]?.project_no}</Text>
                                </View>
        </View>
        <View style={styles.rightIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => console.log('Support pressed')}
          >
            <Ionicons name="settings-outline" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => console.log('Notifications pressed')}
          >
            <Icon name="notifications-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.topBar2}>
          <Text style={styles.title}>{getTitle()}</Text>
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
        data={filteredDieselInvoices}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: width * 0.04 }}
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('CreateExpenseInput')}
        style={styles.fab}
      >
        <Text style={styles.fabIcon}>＋</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DieselInvoice;
