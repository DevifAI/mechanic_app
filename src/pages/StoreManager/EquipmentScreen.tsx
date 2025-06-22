import React, {useEffect, useState} from 'react';
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
import {styles} from '../../styles/Mechanic/RequisitionStyles';
import {useNavigation, useRoute} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import useEquipmentInOrOut, {
  EquipmentDataType,
} from '../../hooks/useEquipmentInOrout';
import PMApprovalBadge from '../../components/PMapprovalBadge';
import { Role } from '../../services/api.enviornment';
import { updateCurrenttab2 } from '../../redux/slices/authSlice';

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
  is_approve_pm: ApprovalStatus;
  type: EquipmentInCategory;
  partner: string;
};

type EquipmentInTab = 'Submitted' | 'Approvals' | 'Issued' | 'All';


// const TABS: EquipmentInTab[] = ['Submitted', 'Approvals', 'Issued', 'All'];

const TABS = [ 'All', 'Submitted', 'Approved', 'Rejected'] as const;
type Tab = (typeof TABS)[number];

const EquipmentScreen = () => {
  // const [activeTab, setActiveTab] = useState<EquipmentInTab>('Submitted');
  const navigation = useNavigation<any>();
   const dispatch = useDispatch();
  const {role, projectList , selectedProjectNumber , activeTab2} = useSelector((state: RootState) => state.auth);
   const [filteredEquipmentInData, setFilteredEquipmentInData] = useState<any>()
  const {Equipments, loading, fetchEquipments} = useEquipmentInOrOut();

  const route = useRoute<any>();

  console.log('Equipments:', Equipments);

useEffect(() => {
  const filtered = Equipments.filter(item => {
    const status = item.is_approve_pm?.toLowerCase();

    switch (activeTab2) {
      case 'Submitted':
        return status === 'pending';
      case 'Approved':
        return status === 'approved';
      case 'Rejected':
        return status === 'rejected';
      case 'All':
      default:
        return true;
    }
  });

  setFilteredEquipmentInData(filtered);
}, [Equipments, activeTab2]);

  const renderItem = ({item}: {item: EquipmentInItem}) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          <Text style={styles.date}>Date: {item.date}</Text>
          <Text style={styles.itemCount}>Type: {item.type}</Text>
          {/* Removed Challan No */}
          <Text style={styles.itemCount}>
            Total No. of Equipments: {item?.items?.length}
          </Text>
           <PMApprovalBadge
           is_approve_pm={item?.is_approve_pm}/>
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
  }, [route?.name, activeTab2]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      {/* Header */}
      <View style={styles.topBar}>
        <View style={styles.rightIcons}>
         <TouchableOpacity
                    onPress={() =>
                      role === Role.projectManager
                        ? navigation.goBack()
                        : navigation.openDrawer()
                    }
                  >
                    {role === Role.projectManager ? (
                      <Ionicons name="arrow-back" size={30} color="black" />
                    ) : (
                      <Ionicons name="menu" size={30} color="black" />
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
            onPress={() => console.log('Support pressed!')}>
              <Ionicons name="settings-outline" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => console.log('Notifications pressed!')}>
            <Icon name="notifications-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
       <View style={styles.topBar2}>
               <Text style={styles.title}>
                   {route?.name === 'EquipmentIn' ? 'Equipment In' : 'Equipment Out'}
                </Text>
             </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map(tab => (
          <TouchableOpacity key={tab} onPress={() => dispatch(updateCurrenttab2(tab))}>
            <Text
              style={[styles.tabText, activeTab2 === tab && styles.activeTab]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}

      {loading ? (
        <View
  style={{
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  }}
>
  <Text style={{ fontSize: 16, color: '#555' }}>Loading...</Text>
</View>

      ) : filteredEquipmentInData?.length === 0 ? (
        <View
  style={{
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  }}
>
  <Text style={{ fontSize: 16, color: '#555' }}>
    No Equipment In records found.
  </Text>
</View>

      ) : null}
      <FlatList
        data={filteredEquipmentInData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{paddingHorizontal: width * 0.04}}
      />

      {/* Floating Add Button */}
  {role !== Role.projectManager && (
  <TouchableOpacity
    onPress={() =>
      route?.name === 'EquipmentIn'
        ? navigation.navigate('CreateEquipmentIn')
        : navigation.navigate('CreateEquipmentOut')
    }
    style={styles.fab}
  >
    <Text style={styles.fabIcon}>＋</Text>
  </TouchableOpacity>
)}

    </View>
  );
};

export default EquipmentScreen;
