import React, {useEffect} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useDPR from '../../hooks/useDPR';
import { Role } from '../../services/api.enviornment';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { updateCurrenttab2 } from '../../redux/slices/authSlice';
import PMApprovalBadge from '../../components/PMapprovalBadge';
import commonHook from '../../hooks/commonHook';

const {width} = Dimensions.get('window');

const TABS = [ 'All','Submitted', 'Approved', 'Rejected'] as const;
type Tab= (typeof TABS)[number];

type Job = {
  timeFrom: string;
  timeTo: string;
  timeTotal: string;
  jobDone: string;
  jobTag: string;
  revenueCode: string;
};

type ShiftRequisition = {
  id: string;
  date: string;
  customerRepresentative: string;
  shiftCode: string;
  shiftStartTime: string;
  shiftEndTime: string;
  shiftIncharge: string;
  shiftMechanic: string;
  projectManagerApproval: 'Pending' | 'Approved' | 'Rejected';
  jobs: Job[];
};

const DPR = () => {
  const {fetchDPRList, dprList, loading} = useDPR();
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const {formatDate} = commonHook();
  const { role, activeTab2, selectedProjectNumber , projectList } = useSelector((state: RootState) => state.auth);

  const filteredRequisitions = dprList.filter(item => {
    const status = item.projectManagerApproval.toLowerCase();
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

  const renderItem = ({item}: {item: ShiftRequisition}) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          <Text style={styles.date}>Date: {formatDate(item.date)}</Text>
          <Text style={styles.itemCount}>Shift Code: {item.shiftCode}</Text>
          <Text style={styles.itemCount}>Jobs: {item.jobs.length}</Text>
        </View>
         {/* <PMApprovalBadge
           is_approve_pm={item.projectManagerApproval.toLowerCase()}/> */}
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => navigation.navigate('ViewDPR', {document: item})}>
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  useEffect(() => {
    fetchDPRList();
  }, [activeTab2]);

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
            }>
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
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="settings-outline" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="notifications-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.topBar2}>
        <Text style={styles.title}>DPR</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map(tab => (
          <TouchableOpacity key={tab} onPress={() => dispatch(updateCurrenttab2(tab))}>
            <Text style={[styles.tabText, activeTab2 === tab && styles.activeTab]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      {loading ? (
       <View style={{ flex: 1, paddingTop:10, alignItems: 'center' }}>
  <Text style={{ fontSize: 16, color: '#555' }}>Loading ...</Text>
</View>

      ) : filteredRequisitions.length === 0 ? (
       <View style={{ flex: 1, paddingTop:10, alignItems: 'center' }}>
  <Text style={{ fontSize: 16, color: '#555' }}>No DPRs found</Text>
</View>

      ) : (
        <FlatList
          data={filteredRequisitions}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{paddingHorizontal: width * 0.04}}
        />
      )}

      {/* Floating Add Button */}
      {role !== Role.projectManager && (
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateDPR')}
          style={styles.fab}>
          <Text style={styles.fabIcon}>＋</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default DPR;
