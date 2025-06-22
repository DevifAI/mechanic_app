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
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {styles} from '../../styles/Mechanic/RequisitionStyles'; // Update path if needed
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useMaintanance from '../../hooks/useMaintanance';
import {Role} from '../../services/api.enviornment';

import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {updateCurrenttab} from '../../redux/slices/authSlice';
import commonHook from '../../hooks/commonHook';
import ApprovalStatusBadge from '../../components/ApprovalStatusBadge';

type LogType = 'Submitted' | 'Approvals' | 'Issued' | 'Rejected' | 'All';

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
  is_approved_mic: any;
  is_approved_sic?: string;
  is_approved_pm?: string;
};

const {width} = Dimensions.get('window');

// Sample logs

const TABS: LogType[] = ['All', 'Submitted', 'Approvals', 'Issued', 'Rejected'  ];

const Log = () => {
  // const [activeTab, setActiveTab] = useState<LogType>('Submitted');
  const[filteredLogs , setFilteredLogs] = useState<LogItem[]>([]);
  const navigation = useNavigation<any>();
const {formatDate} = commonHook();
  const {loading, logItems, getAllMaintananceLogByUserId} = useMaintanance();

  const {role, selectedProjectNumber, projectList,   activeTab = 'Submitted'} = useSelector(
    (state: RootState) => state.auth,
  );

  const dispatch = useDispatch();

  // console.log("loggggggggggggggggggggggggggggggggggggggggg" , logItems)

  useEffect(() => {
  
    
 const filtered = logItems.filter(item => {
    const { is_approved_mic, is_approved_sic, is_approved_pm } = item;

    const allPending = 
      (!is_approved_mic || is_approved_mic === 'pending') &&
      (!is_approved_sic || is_approved_sic === 'pending') &&
      (!is_approved_pm || is_approved_pm === 'pending');

    const anyApproved =
      is_approved_mic === 'approved' ||
      is_approved_sic === 'approved' ||
      is_approved_pm === 'approved';

    const anyRejected =
      is_approved_mic === 'rejected' ||
      is_approved_sic === 'rejected' ||
      is_approved_pm === 'rejected';
    

    const allApproved =
      is_approved_mic === 'approved' &&
      is_approved_sic === 'approved' &&
      is_approved_pm === 'approved';

    switch (activeTab) {
      case 'Submitted':
        return allPending;

      case 'Approvals':
        return !anyRejected && anyApproved && !allApproved;

      case 'Rejected':
        return anyRejected;

      case 'Issued':
        return allApproved;

      case 'All':
      default:
        return true;
    }
  }
);
setFilteredLogs(filtered as LogItem[]);
  }, [activeTab, logItems]);

  const renderItem = ({item}: {item: any}) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          {item?.mechanicName && (
            <Text style={styles.date}>Mechanic name: {item.mechanicName}</Text>
          )}
          <Text style={styles.date}>Date: {formatDate(item.date)}</Text>
          <Text style={styles.itemCount}>
            Maintainance Log No: {item.mantainanceLogNo}
          </Text>
          <Text style={styles.itemCount}>Equipment Name: {item?.equipmentData?.equipment_name || item?.equipment?.equipment_name }</Text>
          <Text style={styles.itemCount}>
            Total No. of Items: {item?.items?.length}
          </Text>
             <ApprovalStatusBadge
  is_approve_mic={item.is_approved_mic}
  is_approve_sic={item.is_approved_sic}
  is_approve_pm={item.is_approved_pm}
/>
        </View>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() =>
            navigation.navigate('ViewItems', {document: item, ScreenType: 'log'})
          }>
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  useEffect(() => {
    getAllMaintananceLogByUserId();
  }, [activeTab]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      {/* Header */}
      <View style={styles.topBar}>
        <View style={styles.rightIcons}>
          <TouchableOpacity
          onPress={() =>
            role === Role.siteInCharge
              ? navigation.goBack()
              : navigation.openDrawer()
          }
        >
          {role === Role.siteInCharge ? (
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
            onPress={() => console.log('Support pressed')}>
            <Ionicons name="settings-outline" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => console.log('Notifications pressed')}>
            <Icon name="notifications-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
 <View>
        <View style={styles.topBar2}>
          <Text style={styles.title}>Maintainance Log</Text>
        </View>
         
      </View>
      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => dispatch(updateCurrenttab(tab))}>
            <Text
              style={[styles.tabText, activeTab === tab && styles.activeTab]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}

      {loading ? (
        <ActivityIndicator
          size={'large'}
          style={{marginTop: '50%'}}
          color="#007AFF"
        />
      ) : filteredLogs?.length === 0 ? (
        <Text
          style={{
            fontSize: 18,
            color: '#666',
            textAlign: 'center',
            marginTop: 16,
          }}>
          No data found
        </Text>
      ) : (
        <FlatList
          data={filteredLogs}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{paddingHorizontal: width * 0.04}}
        />
      )}

      {/* Floating Add Button */}
      {role === Role.mechanic && (
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateLog')}
          style={styles.fab}>
          <Text style={styles.fabIcon}>＋</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Log;
