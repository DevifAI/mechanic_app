import React, {useEffect, useState} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useDPR from '../../hooks/useDPR';

const {width} = Dimensions.get('window');

type RequisitionType = 'Submitted' | 'Approvals' | 'Rejected' | 'All';

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

const shiftRequisitions: ShiftRequisition[] = [
  {
    id: '90886633',
    date: '1/5/2025',
    customerRepresentative: 'John Doe',
    shiftCode: 'MORN-001',
    shiftStartTime: '08:00',
    shiftEndTime: '16:00',
    shiftIncharge: 'Alice Smith',
    shiftMechanic: 'Bob Johnson',
    projectManagerApproval: 'Pending',
    jobs: [
      {
        timeFrom: '08:30',
        timeTo: '10:00',
        timeTotal: '1.5',
        jobDone: 'Engine maintenance',
        jobTag: 'EM-2025-001',
        revenueCode: 'ENG-MNT',
      },
    ],
  },
  {
    id: '90886634',
    date: '2/5/2025',
    customerRepresentative: 'Jane Smith',
    shiftCode: 'AFTN-002',
    shiftStartTime: '16:00',
    shiftEndTime: '00:00',
    shiftIncharge: 'Charlie Brown',
    shiftMechanic: 'David Wilson',
    projectManagerApproval: 'Approved',
    jobs: [
      {
        timeFrom: '16:30',
        timeTo: '18:00',
        timeTotal: '1.5',
        jobDone: 'Screw tightening',
        jobTag: 'SCR-2025-001',
        revenueCode: 'HRD-TGT',
      },
    ],
  },
  {
    id: '90886635',
    date: '3/5/2025',
    customerRepresentative: 'Mike Johnson',
    shiftCode: 'NIGHT-003',
    shiftStartTime: '00:00',
    shiftEndTime: '08:00',
    shiftIncharge: 'Eva Green',
    shiftMechanic: 'Frank White',
    projectManagerApproval: 'Rejected',
    jobs: [
      {
        timeFrom: '01:00',
        timeTo: '04:00',
        timeTotal: '3.0',
        jobDone: 'Pipe installation',
        jobTag: 'PIP-2025-001',
        revenueCode: 'PLB-INS',
      },
    ],
  },
  {
    id: '90886636',
    date: '4/5/2025',
    customerRepresentative: 'Sarah Connor',
    shiftCode: 'MORN-004',
    shiftStartTime: '08:00',
    shiftEndTime: '16:00',
    shiftIncharge: 'Gary Oldman',
    shiftMechanic: 'Hank Moody',
    projectManagerApproval: 'Approved',
    jobs: [
      {
        timeFrom: '09:00',
        timeTo: '14:00',
        timeTotal: '5.0',
        jobDone: 'Painting work',
        jobTag: 'PNT-2025-001',
        revenueCode: 'PNT-EXT',
      },
    ],
  },
];

const TABS: RequisitionType[] = ['Submitted', 'Approvals', 'Rejected', 'All'];

const DPR = () => {
  const [activeTab, setActiveTab] = useState<RequisitionType>('Submitted');
  const {fetchDPRList, dprList} = useDPR();
  const navigation = useNavigation<any>();

  const filteredRequisitions = dprList.filter(item => {
    switch (activeTab) {
      case 'Submitted':
        return item.projectManagerApproval === 'Pending';
      case 'Approvals':
        return item.projectManagerApproval === 'Approved';
      case 'Rejected':
        return item.projectManagerApproval === 'Rejected';
      case 'All':
      default:
        return true;
    }
  });

  const renderItem = ({item}: {item: ShiftRequisition}) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          <Text style={styles.date}>Date: {item.date}</Text>
          <Text style={styles.itemCount}>Shift Code: {item.shiftCode}</Text>
          <Text style={styles.itemCount}>Jobs: {item.jobs.length}</Text>
        </View>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => navigation.navigate('ViewDPR', {document: item})}>
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  useEffect(() => {
    // Fetch the DPR list when the component mounts and when the active tab changes
    fetchDPRList();
  }, [activeTab]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.topBar}>
        <View style={styles.rightIcons}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={30} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>DPR</Text>
        </View>
        <View style={styles.rightIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => console.log('Support')}>
            <MaterialIcons name="support-agent" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => console.log('Notifications')}>
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
      <FlatList
        data={filteredRequisitions}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{paddingHorizontal: width * 0.04}}
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('CreateDPR')}
        style={styles.fab}>
        <Text style={styles.fabIcon}>＋</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DPR;
