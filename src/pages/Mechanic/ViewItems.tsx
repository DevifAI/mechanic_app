import React, { useRef, useState } from 'react';
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
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from "../../styles/Mechanic/ViewItemsStyles"
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import RejectReportModal from '../../Modal/RejectReport';

type Item = {
  item: string;
  quantity: number;
  uom: string;
  notes: string;
  equipment?: string;
  readingMeterNo?: string;
  readingMeterUom?: string;
};

type DocumentItem = {
  id: string;
  date: string;
  items: Item[];
  mechanicInchargeApproval: boolean;
  siteInchargeApproval: boolean;
  projectManagerApproval: boolean;

  // Log-specific fields
  equipment?: string;
  nextDate?: string;
  mantainanceLogNo?: string;
  note?: string;
  actionPlan?: string;
};

type RootStackParamList = {
  ViewDocument: {
    document: DocumentItem;
    type: 'requisition' | 'receipt' | 'consumption' | 'log';
  };
};

type ViewDocumentRouteProp = RouteProp<RootStackParamList, 'ViewDocument'>;

const { width } = Dimensions.get('window');

export default function ViewItems() {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const route = useRoute<ViewDocumentRouteProp>();

  const [currentIndex, setCurrentIndex] = useState(0);

  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };

  const onViewRef = useRef(({ viewableItems }: { viewableItems: any[] }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index ?? 0);
    }
  });

  const navigation = useNavigation<any>();
   const { role } = useSelector((state: RootState) => state.auth);

  const { document, type } = route.params;

  const {
    id,
    date,
    items,
    mechanicInchargeApproval,
    siteInchargeApproval,
    projectManagerApproval,
    equipment,
    nextDate,
    mantainanceLogNo,
    note,
    actionPlan,
  } = document;

  const title =
    type === 'requisition'
      ? 'Requisition Details'
      : type === 'receipt'
      ? 'Receipt Details'
      : type === 'consumption'
      ? 'Consumption Details'
      : 'Maintenance Log Details';


  const handleApprove = () => {
  navigation.goBack()
};

const handleReject = () => {
  setShowRejectModal(true);
};

const handleSaveRejection = (reason: string, id: string, type: string) => {
  console.log("Rejected with reason:", reason);
  console.log("Document ID:", id);
  console.log("Type:", type);
  setShowRejectModal(false);
  navigation.navigate('MainTabs', {
  screen: 'Requisition',
})
};


const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.itemCard}>
      {type === 'consumption' && item.equipment && (
        <Text style={styles.itemTitle}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#666' }}>
            Equipment:
          </Text>{' '}
          {item.equipment}
        </Text>
      )}

      <Text style={styles.itemTitle}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#666' }}>
          Item Name:
        </Text>{' '}
        {item.item}
      </Text>

      <View style={styles.itemDetailsRow}>
        <ItemDetail label="Quantity: " value={item.quantity.toString()} />
        <ItemDetail label="UOM: " value={item.uom} />
      </View>

      {type === 'consumption' && item.item.toLowerCase() === 'diesel' && (
        <>
          {item.readingMeterNo && (
            <View style={styles.itemDetailsRow2}>
              <ItemDetail label="Reading Meter No: " value={item.readingMeterNo} />
            </View>
          )}
          {item.readingMeterUom && (
            <View style={styles.itemDetailsRow2}>
              <ItemDetail label="Reading Meter UOM: " value={item.readingMeterUom} />
            </View>
          )}
        </>
      )}

      {item.notes ? (
        <Text style={styles.itemNotes}>Notes: {item.notes}</Text>
      ) : null}
    </View>
  );



  return (

      <SafeAreaView
       style={{ flexGrow: 1 , paddingTop:20 , paddingBottom:40,  backgroundColor: '#fff',}}>
    <ScrollView style={styles.container}>

<View style={{ flexGrow: 1  }}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
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

      {/* LOG-specific fields */}
      {type === 'log' && (
        <View style={styles.logDetails}>

          <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Equipment</Text>
            <Text style={styles.infoValue}>{equipment || '-'}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Next Date</Text>
            <Text style={styles.infoValue}>{nextDate || '-'}</Text>
          </View>
          </View>

          <View style={styles.logCard}>
            <Text style={styles.infoLabel}>Maintainance Log Number</Text>
            <Text style={styles.infoValue}>{mantainanceLogNo || '-'}</Text>
          </View>
          <View style={styles.logCard}>
            <Text style={styles.infoLabel}>Note</Text>
            <Text style={styles.infoValue}>{note || '-'}</Text>
          </View>
          <View style={styles.logCard}>
            <Text style={styles.infoLabel}>Action Plan</Text>
            <Text style={styles.infoValue}>{actionPlan || '-'}</Text>
          </View>
        </View>
      )}

      {/* <Text style={styles.subheading}>Items</Text>
      {items.map((item, index) => (
        <View key={index} style={styles.itemCard}>
          {type === 'consumption' && item.equipment && (
            <Text style={styles.itemTitle}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#666' }}>
                Equipment:
              </Text>{' '}
              {item.equipment}
            </Text>
          )}

          <Text style={styles.itemTitle}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#666' }}>
              Item Name:
            </Text>{' '}
            {item.item}
          </Text>
          <View style={styles.itemDetailsRow}>
            <ItemDetail label="Quantity: " value={item.quantity.toString()} />
            <ItemDetail label="UOM: " value={item.uom} />
          </View>

          {type === 'consumption' && item.item.toLowerCase() === 'diesel' && (
            <>
              {item.readingMeterNo && (
                <View style={styles.itemDetailsRow2}>
                  <ItemDetail label="Reading Meter No: " value={item.readingMeterNo} />
                </View>
              )}
              {item.readingMeterUom && (
                <View style={styles.itemDetailsRow2}>
                  <ItemDetail label="Reading Meter UOM: " value={item.readingMeterUom} />
                </View>
              )}
            </>
          )}

          {item.notes ? (
            <Text style={styles.itemNotes}>Notes: {item.notes}</Text>
          ) : null}
        </View>
      ))} */}

       <Text style={styles.subheading}>Items</Text>

      <FlatList
        data={items}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 2 }}
        renderItem={renderItem}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewabilityConfig}
      />

      <View style={styles.indicatorContainer}>
        {items.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicatorDot,
              currentIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>


      {role === 'mechanic' && (
  <View style={styles.approvalsContainer}>
    <View style={styles.approvalRow}>
      <ApprovalBadge
        label="Mechanic Incharge"
        approved={mechanicInchargeApproval}
      />
      <ApprovalBadge
        label="Site Incharge"
        approved={siteInchargeApproval}
      />
      <ApprovalBadge
        label="Project Manager"
        approved={projectManagerApproval}
      />
    </View>
  </View>
)} 

{role === 'mechanicIncharge' && (
  <View style={styles.buttonRow}>
    <TouchableOpacity style={styles.approveButton} onPress={handleApprove}>
      <Text style={styles.buttonText}>Approve</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.rejectButton} onPress={handleReject}>
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
    type={type}
  />
)}

</View>
    </ScrollView>
    </SafeAreaView>

  );
}

function ApprovalBadge({
  label,
  approved,
}: {
  label: string;
  approved: boolean;
}) {
  return (
    <View style={approved ? styles.approvalRowItem : styles.pendingRowItem}>
      <Text style={styles.approvalText}>{label}:</Text>
      <View style={approved ? styles.approvedBox : styles.pendingBox}>
        <Text style={approved ? styles.approvedText : styles.pendingText}>
          {approved ? 'Approved' : 'Pending'}
        </Text>
      </View>
    </View>
  );
}

function ItemDetail({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.itemDetail}>
      <Text style={styles.itemDetailLabel}>{label}</Text>
      <Text style={styles.itemDetailValue}>{value}</Text>
    </View>
  );
}

