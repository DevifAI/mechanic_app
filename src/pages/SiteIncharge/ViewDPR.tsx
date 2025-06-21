import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  FlatList,
} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {styles} from '../../styles/Mechanic/ViewItemsStyles';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import RejectReportModal from '../../Modal/RejectReport';
import {Role} from '../../services/api.enviornment';
import useDPR from '../../hooks/useDPR';

type Job = {
  timeFrom: string;
  timeTo: string;
  timeTotal: string;
  jobDone: string;
  jobTag: string;
  revenueCode: string;
};

type DPRDocument = {
  id: string;
  date: string;
  customerRepresentative: string;
  shiftCode: string;
  shiftStartTime: string;
  shiftEndTime: string;
  shiftIncharge: string;
  shiftMechanic: string;
  projectManagerApproval: string;
  jobs: Job[];
};

type RootStackParamList = {
  ViewDocument: {
    document: DPRDocument;
  };
};

type ViewDocumentRouteProp = RouteProp<RootStackParamList, 'ViewDocument'>;

const {width} = Dimensions.get('window');

export default function ViewDPR() {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const route = useRoute<ViewDocumentRouteProp>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation<any>();
  const {role} = useSelector((state: RootState) => state.auth);

  const {updateDPRByProjectManager} = useDPR();

  const viewabilityConfig = {viewAreaCoveragePercentThreshold: 50};

  const onViewRef = useRef(({viewableItems}: {viewableItems: any[]}) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index ?? 0);
    }
  });

  const {document} = route.params;

  const {
    id,
    date,
    customerRepresentative,
    shiftCode,
    shiftStartTime,
    shiftEndTime,
    shiftIncharge,
    shiftMechanic,
    projectManagerApproval,
    jobs,
  } = document;

  const title = 'DPR Details';

  const handleupdateDPR = async (status: 'approved' | 'rejected') => {
    if (status === 'approved') {
      await updateDPRByProjectManager({dpr_id: id, status}, () => {
        navigation.navigate('MainTabs', {screen: 'DprScreen'});
      });
    } else {
      setShowRejectModal(true);
    }
  };

  const handleSaveRejection = async (
    reason: string,
    id: string,
    status: string,
  ) => {
    if (!reason.trim()) {
      console.error('Rejection reason cannot be empty');
      return;
    }
    await updateDPRByProjectManager({dpr_id: id, status, reason}, () => {
      navigation.navigate('MainTabs', {screen: 'DprScreen'});
    });
    console.log('Rejected with reason:', reason);
    console.log('Document ID:', id);
    setShowRejectModal(false);
    navigation.navigate('MainTabs', {
      screen: 'Requisition',
    });
  };

  const renderJobItem = ({item}: {item: Job}) => (
    <View style={styles.itemCard}>
      <Text style={styles.itemTitle}>
        <Text style={{fontSize: 16, fontWeight: '600', color: '#666'}}>
          Job Tag:
        </Text>{' '}
        {item.jobTag}
      </Text>

      <View style={styles.itemDetailsRow}>
        <ItemDetail label="Time From: " value={item.timeFrom} />
        <ItemDetail label="Time To: " value={item.timeTo} />
      </View>
      <View style={styles.itemDetailsRow}>
        <ItemDetail label="Revenue Code: " value={item.revenueCode} />
      </View>

      <View style={styles.itemDetailsRow}>
        <ItemDetail label="Total Time: " value={item.timeTotal} />
      </View>

      <View style={styles.itemDetailsRow}>
        {/* <Text style={styles.infoLabel}>Job Done</Text>
        <Text style={styles.infoValue}>{item.jobDone}</Text> */}
        <Text style={styles.itemNotes}>Notes: {item.jobDone}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={{
        flexGrow: 1,
        paddingTop: 20,
        paddingBottom: 40,
        backgroundColor: '#fff',
      }}>
      <ScrollView style={styles.container}>
        <View style={{flexGrow: 1}}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.heading}>{title}</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>ID</Text>
              <Text style={styles.infoValue}>{id}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>{date}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Shift Code</Text>
              <Text style={styles.infoValue}>{shiftCode}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Customer Rep.</Text>
              <Text style={styles.infoValue}>{customerRepresentative}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Shift Start</Text>
              <Text style={styles.infoValue}>{shiftStartTime}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Shift End</Text>
              <Text style={styles.infoValue}>{shiftEndTime}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Shift Incharge</Text>
              <Text style={styles.infoValue}>{shiftIncharge}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Shift Mechanic</Text>
              <Text style={styles.infoValue}>{shiftMechanic}</Text>
            </View>
          </View>

          <Text style={styles.subheading}>Jobs</Text>

          <FlatList
            data={jobs}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{paddingHorizontal: 2}}
            renderItem={renderJobItem}
            onViewableItemsChanged={onViewRef.current}
            viewabilityConfig={viewabilityConfig}
          />

          <View style={styles.indicatorContainer}>
            {jobs.map((_: any, index: React.Key | null | undefined) => (
              <View
                key={index}
                style={[
                  styles.indicatorDot,
                  currentIndex === index && styles.activeDot,
                ]}
              />
            ))}
          </View>

          {role === Role.siteInCharge && (
            <View style={styles.approvalsContainer}>
              <View style={styles.approvalRow}>
                <ApprovalBadge
                  label="Project Manager"
                  approved={projectManagerApproval}
                />
              </View>
            </View>
          )}

          {role === Role.projectManager && (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.approveButton}
                onPress={() => {
                  handleupdateDPR('approved');
                }}>
                <Text style={styles.buttonText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rejectButton}
                onPress={() => {
                  handleupdateDPR('rejected');
                }}>
                <Text style={styles.buttonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          )}

          {showRejectModal && (
            <RejectReportModal
              visible={showRejectModal}
              onClose={() => setShowRejectModal(false)}
              onSave={handleSaveRejection}
              id={id}
              type="dpr"
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ApprovalBadge({label, approved}: {label: string; approved: string}) {
  const isApproved = approved === 'approved';
  return (
    <View style={isApproved ? styles.approvalRowItem : styles.pendingRowItem}>
      <Text style={styles.approvalText}>{label}:</Text>
      <View style={isApproved ? styles.approvedBox : styles.pendingBox}>
        <Text style={isApproved ? styles.approvedText : styles.pendingText}>
          {isApproved ? 'Approved' : 'Pending'}
        </Text>
      </View>
    </View>
  );
}

function ItemDetail({label, value}: {label: string; value: string}) {
  return (
    <View style={styles.itemDetail}>
      <Text style={styles.itemDetailLabel}>{label}</Text>
      <Text style={styles.itemDetailValue}>{value}</Text>
    </View>
  );
}
