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
  unitRate?: string;
  totalValue?: string;
};

type DocumentItem = {
  id: string;
  date: string;
  items: Item[];
  mechanicInchargeApproval: boolean;
  siteInchargeApproval: boolean;
  projectManagerApproval: boolean;
  accountManagerApproval : boolean;
  // Log-specific fields
  equipment?: string;
  nextDate?: string;
  mantainanceLogNo?: string;
  note?: string;
  actionPlan?: string;
  challanNo?: string;
  partner?: string;
  type?: string;
  reasonOut?:string;
};

type RootStackParamList = {
  ViewDocument: {
    document: DocumentItem;
    ScreenType: 'requisition' | 'receipt' | 'consumption' | 'log' | 'materialin' | 'materialout' | 'equipmentin' | 'equipmentout' | 'dieselInvoice';
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

  const { document, ScreenType } = route.params;

  const {
    id,
    date,
    items,
    mechanicInchargeApproval,
    siteInchargeApproval,
    projectManagerApproval,
    accountManagerApproval,
    equipment,
    nextDate,
    mantainanceLogNo,
    note,
    actionPlan,
   challanNo,
   partner,
   type,
   reasonOut,
  } = document;

 const title =
  ScreenType === 'requisition'
    ? 'Requisition Details'
    : ScreenType === 'receipt'
    ? 'Receipt Details'
    : ScreenType === 'consumption'
    ? 'Consumption Details'
    : ScreenType === 'materialin'
    ? 'Material In Details'
    : ScreenType === 'materialout'
    ? 'Material Out Details'
    : ScreenType === 'equipmentin'
    ? 'Equipment In Details'
    : ScreenType === 'equipmentout'
    ? 'Equipment Out Details'
    : ScreenType === 'dieselInvoice'
    ? 'Diesel Invoice Details'
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
      {ScreenType === 'consumption' && item.equipment && (
        <Text style={styles.itemTitle}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#666' }}>
            Equipment:
          </Text>{' '}
          {item.equipment}
        </Text>
      )}

{ScreenType === 'equipmentin' && (
  <Text style={styles.itemTitle}>
    <Text style={{ fontSize: 16, fontWeight: '600', color: '#666' }}>
      Equipment:
    </Text>{' '}
    {item.equipment}
  </Text>
)}


     {ScreenType !== 'equipmentin' && (
  <Text style={styles.itemTitle}>
    <Text style={{ fontSize: 16, fontWeight: '600', color: '#666' }}>
      Item Name:
    </Text>{' '}
    {item.item}
  </Text>
)}


      <View style={styles.itemDetailsRow}>
        <ItemDetail label="Quantity: " value={item.quantity.toString()} />
        <ItemDetail label="UOM: " value={item.uom} />
      </View>

      {ScreenType === 'consumption' && item.item.toLowerCase() === 'diesel' && (
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

      {ScreenType === 'dieselInvoice' && (
<View style={[styles.itemDetailsRow, { marginTop: 4 }]}>
    <ItemDetail label="Unit Rate: " value={item.unitRate?.toString() ?? ''} />
    <ItemDetail label="Total Value: " value={item.totalValue?.toString() ?? ''} />
  </View>
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
      {ScreenType === 'log' && (
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

      {role === 'storeManager' && (
          <View style={styles.logDetails}>

          {/* <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Type</Text>
            <Text style={styles.infoValue}>{type || '-'}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Challan No</Text>
            <Text style={styles.infoValue}>{challanNo || '-'}</Text>
          </View>
          </View> */}

{!(ScreenType === 'materialout' || ScreenType === 'equipmentin' || ScreenType === 'equipmentout') && (
  <View style={styles.infoRow}>
    <View style={styles.infoCard}>
      <Text style={styles.infoLabel}>Type</Text>
      <Text style={styles.infoValue}>{type || '-'}</Text>
    </View>
    <View style={styles.infoCard}>
      <Text style={styles.infoLabel}>Challan No</Text>
      <Text style={styles.infoValue}>{challanNo || '-'}</Text>
    </View>
  </View>
)}



{(ScreenType === 'materialout'|| ScreenType === 'equipmentin') && (
  <View style={styles.logCard}>
    <Text style={styles.infoLabel}>Type</Text>
    <Text style={styles.infoValue}>{type}</Text>
  </View>
)}


 {ScreenType === 'equipmentout' && (
  <View style={styles.logCard}>
    <Text style={styles.infoLabel}>Reason Out</Text>
    <Text style={styles.infoValue}>{reasonOut}</Text>
  </View>
)}


        {partner && (
  <View style={styles.logCard}>
    <Text style={styles.infoLabel}>Partner</Text>
    <Text style={styles.infoValue}>{partner}</Text>
  </View>
)}

        </View>
      )}


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


{role === "storeManager" && (
  <View style={styles.approvalsContainer}>
    <View style={styles.approvalRow}>
      <ApprovalBadge
        label="Account Manager"
        approved={accountManagerApproval}
      />
      <ApprovalBadge
        label="Project Manager"
        approved={projectManagerApproval}
      />
      </View></View>
)}

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

{role === 'accountManager' && !(ScreenType === 'dieselInvoice') && (
  <View style={styles.buttonRow}>
    <TouchableOpacity style={styles.approveButton} onPress={handleApprove}>
      <Text style={styles.buttonText}>Approve</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.rejectButton} onPress={handleReject}>
      <Text style={styles.buttonText}>Reject</Text>
    </TouchableOpacity>
  </View>
)}

{role === "accountManager" && ScreenType === 'dieselInvoice' &&(
  <View style={styles.approvalsContainer}>
    <View style={styles.approvalRow}>
      <ApprovalBadge
        label="Project Manager"
        approved={projectManagerApproval}
      />
      </View></View>
)}


{showRejectModal && (
  <RejectReportModal
    visible={showRejectModal}
    onClose={() => setShowRejectModal(false)}
   onSave={handleSaveRejection}
    id={id}
    type={ScreenType}
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
  approved: boolean | 'rejected' | 'approved' | 'pending'; // being future-proof
}) {
  let statusText: string;
  let containerStyle: any;
  let textStyle: any;
  let rowItemStyle: any;

  if (approved === true || approved === 'approved') {
    statusText = 'Approved';
    containerStyle = styles.approvedBox;
    textStyle = styles.approvedText;
    rowItemStyle = styles.approvalRowItem;
  } else if (approved === 'rejected') {
    statusText = 'Rejected';
    containerStyle = styles.rejectedBox;
    textStyle = styles.rejectedText;
    rowItemStyle = styles.rejectedRowItem;
  } else {
    // false, "pending", undefined, null, etc.
    statusText = 'Pending';
    containerStyle = styles.pendingBox;
    textStyle = styles.pendingText;
    rowItemStyle = styles.pendingRowItem;
  }

  return (
    <View style={rowItemStyle}>
      <Text style={styles.approvalText}>{label}:</Text>
      <View style={containerStyle}>
        <Text style={textStyle}>{statusText}</Text>
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

