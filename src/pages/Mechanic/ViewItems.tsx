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
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import RejectReportModal from '../../Modal/RejectReport';
import useRequisition, {RequestType} from '../../hooks/useRequisitionorReceipt';
import useConsumption from '../../hooks/useConsumption';
import useMaintanance from '../../hooks/useMaintanance';
import {updateCurrenttab} from '../../redux/slices/authSlice';
import {Role} from '../../services/api.enviornment';
import commonHook from '../../hooks/commonHook';

type Item = {
  quantity: number;
  uom: string;
  notes: string;
  equipment?: string;
  readingMeterNo?: string;
  readingMeterUom?: string;
  unitRate?: string;
  totalValue?: string;
  itemData?: any;
  consumableItem?: any;
  item?: string;
};

type DocumentItem = {
  id: string;
  date: string;
  items: Item[];
  is_approve_mic: string | boolean;
   is_approved_mic: string | boolean;
   is_approve_sic: string | boolean;
  siteInchargeApproval: string | boolean;
  projectManagerApproval:string | boolean;
  accountManagerApproval: string | boolean;
  // Log-specific fields
  equipmentData?: any;
  equipment_name?: string;
  equipment?:string;
  next_date?: string;
  mantainanceLogNo?: string;
  notes?: string;
  action_planned?: string;
  challanNo?: string;
  partner?: string;
  type?: string;
  reasonOut?: string;
  reject_reason?:string;
};

type RootStackParamList = {
  ViewDocument: {
    document: DocumentItem;
    ScreenType:
      | 'requisition'
      | 'receipt'
      | 'consumption'
      | 'log'
      | 'materialin'
      | 'materialout'
      | 'equipmentin'
      | 'equipmentout'
      | 'dieselInvoice';
  };
};

type ViewDocumentRouteProp = RouteProp<RootStackParamList, 'ViewDocument'>;

const {width} = Dimensions.get('window');

export default function ViewItems() {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const route = useRoute<ViewDocumentRouteProp>();

  const [currentIndex, setCurrentIndex] = useState(0);

  const viewabilityConfig = {viewAreaCoveragePercentThreshold: 50};

  const onViewRef = useRef(({viewableItems}: {viewableItems: any[]}) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index ?? 0);
    }
  });
const {formatDate} = commonHook();
  const navigation = useNavigation<any>();
  const {role} = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch();

  const {document, ScreenType} = route.params;
  console.log("sscccccccc" , ScreenType);
  const {updateRequisitionOrReceipt, loading, getRequisitionsorReceiptsAll} =
    useRequisition();
  const {updateConsumption, getConsumptionByUserId} = useConsumption();
  const {updateMaintananceLog, getAllMaintananceLogByUserId} = useMaintanance();

  const {
    id,
    date,
    items,
    is_approved_mic,
    is_approve_mic,
    is_approve_sic,
    siteInchargeApproval,
    projectManagerApproval,
    accountManagerApproval,
    equipment_name,
    equipmentData,
    equipment,
    next_date,
    mantainanceLogNo,
    notes,
    action_planned,
    challanNo,
    partner,
    type,
    reasonOut,
    reject_reason,
  } = document;

  console.log("mechanicInchargeApproval" , document)
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
      : ScreenType === 'log'
      ? 'Maintenance Log Details'
      : 'Maintenance Log Details'

  const handleApproveCallBack = () => {
    dispatch(updateCurrenttab('Approvals'));
    if (ScreenType === 'requisition')
      getRequisitionsorReceiptsAll(RequestType.diselRequisition);
    else if (ScreenType === 'receipt')
      getRequisitionsorReceiptsAll(RequestType.diselReceipt);
    else if (ScreenType === 'consumption') getConsumptionByUserId();
    else if (ScreenType === 'log') getAllMaintananceLogByUserId();
    navigation.goBack();
  };

  console.log("#############",is_approve_mic)

  const handleRejectCallback = () => {
    dispatch(updateCurrenttab('Submitted'));
    navigation.goBack();
    setShowRejectModal(false);
  };

  const handleApprove = () => {
    if (ScreenType === 'requisition' || ScreenType === 'receipt') {
      updateRequisitionOrReceipt(
        {requisitionId: id, receiptId: id, status: 'approved'},
        handleApproveCallBack,
        ScreenType === 'requisition'
          ? RequestType.diselRequisition
          : RequestType.diselReceipt,
      );
    } else if (ScreenType === 'consumption') {
      updateConsumption(
        {sheetId: id, status: 'approved'},
        handleApproveCallBack,
      );
    } else if (ScreenType === 'log') {
      updateMaintananceLog(
        {sheetId: id, status: 'approved'},
        handleApproveCallBack,
      );
    }
  };

  const handleReject = () => {
    setShowRejectModal(true);
  };

  const handleSaveRejection = (reason: string, id: string, type: string) => {
    console.log('Rejected with reason:', reason);
    console.log('Document ID:', id);
    console.log('Type:', type);
    if (ScreenType === 'requisition' || ScreenType === 'receipt') {
      updateRequisitionOrReceipt(
        {
          requisitionId: id,
          receiptId: id,
          status: 'rejected',
          reason_reject: reason,
          reject_reason: reason,
        },
        handleRejectCallback,
        ScreenType === 'requisition'
          ? RequestType.diselRequisition
          : RequestType.diselReceipt,
      );
    } else if (ScreenType === 'consumption') {
      updateConsumption(
        {sheetId: id, status: 'rejected', reject_reason: reason},
        handleRejectCallback,
      );
    } else if (ScreenType === 'log') {
      updateMaintananceLog(
        {sheetId: id, status: 'rejected', reject_reason: reason},
        handleRejectCallback,
      );
    }
  };

  console.log(items, 'getting requisition items');



  const renderItem = ({item}: {item: Item}) => (
    <View style={styles.itemCard}>
      {ScreenType === 'consumption' && item.equipment && (
        <Text style={styles.itemTitle}>
          <Text style={{fontSize: 16, fontWeight: '600', color: '#666'}}>
            Equipment:
          </Text>{' '}
          {item.equipment}
        </Text>
      )}

      {ScreenType === 'equipmentin' && (
        <Text style={styles.itemTitle}>
          <Text style={{fontSize: 16, fontWeight: '600', color: '#666'}}>
            Equipment:
          </Text>{' '}
          {item.equipment || 'N/A'}
        </Text>
      )}

      {ScreenType !== 'equipmentin' && (
  <>
    {console.log('Item Object:', item)}
    <Text style={styles.itemTitle}>
      <Text style={{ fontSize: 16, fontWeight: '600', color: '#666' }}>
        Item Name:
      </Text>{' '}
      {item?.itemData?.item_name ||
        item?.consumableItem?.item_name ||
        item?.item ||
        'N/A'}
    </Text>
  </>
)}


      <View style={styles.itemDetailsRow}>
        <ItemDetail label="Quantity: " value={item.quantity.toString()} />
        <ItemDetail label="UOM: " value={item.uom} />
      </View>

      {ScreenType === 'consumption' && item.item.toLowerCase() === 'diesel' && (
        <>
          {item.readingMeterNo && (
            <View style={styles.itemDetailsRow2}>
              <ItemDetail
                label="Reading Meter No: "
                value={item.readingMeterNo}
              />
            </View>
          )}
          {item.readingMeterUom && (
            <View style={styles.itemDetailsRow2}>
              <ItemDetail
                label="Reading Meter UOM: "
                value={item.readingMeterUom}
              />
            </View>
          )}
        </>
      )}

      {ScreenType === 'dieselInvoice' && (
        <View style={[styles.itemDetailsRow, {marginTop: 4}]}>
          <ItemDetail
            label="Unit Rate: "
            value={item.unitRate?.toString() ?? ''}
          />
          <ItemDetail
            label="Total Value: "
            value={item.totalValue?.toString() ?? ''}
          />
        </View>
      )}

      {item.notes ? (
        <Text style={styles.itemNotes}>Notes: {item.notes}</Text>
      ) : null}
    </View>
  );

    console.log("screeeeeeeeeeene" , ScreenType)

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
            {/* <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>ID</Text>
              <Text style={styles.infoValue}>{id}</Text>
            </View> */}
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>{formatDate(date)}</Text>
            </View>
          </View>

          {/* LOG-specific fields */}
          {ScreenType === 'log' && (
            <View style={styles.logDetails}>
              <View style={styles.infoRow}>
                <View style={styles.infoCard}>
                  <Text style={styles.infoLabel}>Equipment</Text>
                  <Text style={styles.infoValue}>{equipmentData?.equipment_name || equipment?.equipment_name || '-'}</Text>
                </View>
                <View style={styles.infoCard}>
                  <Text style={styles.infoLabel}>Next Date</Text>
                  <Text style={styles.infoValue}>{formatDate(next_date)}</Text>
                </View>
              </View>

              <View style={styles.logCard}>
                <Text style={styles.infoLabel}>Maintainance Log Number</Text>
                <Text style={styles.infoValue}>{mantainanceLogNo || '-'}</Text>
              </View>
              <View style={styles.logCard}>
                <Text style={styles.infoLabel}>Note</Text>
                <Text style={styles.infoValue}>{notes || '-'}</Text>
              </View>
              <View style={styles.logCard}>
                <Text style={styles.infoLabel}>Action Plan</Text>
                <Text style={styles.infoValue}>{action_planned || '-'}</Text>
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

              {!(
                ScreenType === 'materialout' ||
                ScreenType === 'equipmentin' ||
                ScreenType === 'equipmentout'
              ) && (
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

              {(ScreenType === 'materialout' ||
                ScreenType === 'equipmentin') && (
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
            contentContainerStyle={{paddingHorizontal: 2}}
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

          {role === 'storeManager' && (
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
              </View>
            </View>
          )}

{(ScreenType !== 'consumption' && ScreenType !== 'log') && (
  role === Role.mechanic &&
(is_approve_mic === "rejected" || is_approve_mic === "approved") && (
  <View style={styles.approvalsContainer}>
    <View style={styles.approvalRow}>
      <ApprovalBadge
        label="Mechanic Incharge"
        approved={is_approve_mic}
      />
      <ApprovalBadge
        label="Site Incharge"
        approved={is_approve_sic}
      />
      <ApprovalBadge
        label="Project Manager"
        approved={projectManagerApproval}
      />
    </View>
  </View>
 )
)}

{(ScreenType == 'consumption' || ScreenType === 'log') && (
  role === Role.mechanic &&
 (is_approved_mic === "rejected" || is_approved_mic === "approved") && (
  <View style={styles.approvalsContainer}>
    <View style={styles.approvalRow}>
      <ApprovalBadge
        label="Mechanic Incharge"
        approved={is_approved_mic}
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
 )
)}



{(ScreenType !== 'consumption' && ScreenType !== 'log') && (
  role === Role.mechanicInCharge &&
  is_approve_mic !== "rejected" &&
  is_approve_mic !== "approved" && (
    <View style={styles.buttonRow}>
      <TouchableOpacity style={styles.approveButton} onPress={handleApprove}>
        <Text style={styles.buttonText}>Approve</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.rejectButton} onPress={handleReject}>
        <Text style={styles.buttonText}>Reject</Text>
      </TouchableOpacity>
    </View>
  )
)}




{(ScreenType === 'consumption' || ScreenType === 'log') && (
  role === Role.mechanicInCharge &&
  is_approved_mic !== "rejected" &&
  is_approved_mic !== "approved" && (
    <View style={styles.buttonRow}>
      <TouchableOpacity style={styles.approveButton} onPress={handleApprove}>
        <Text style={styles.buttonText}>Approve</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.rejectButton} onPress={handleReject}>
        <Text style={styles.buttonText}>Reject</Text>
      </TouchableOpacity>
    </View>
  )
)}





{(ScreenType !== 'consumption' && ScreenType !== 'log') && (
  role === Role.mechanicInCharge &&
 (is_approve_mic === "rejected" || is_approve_mic === "approved") && (
  <View style={styles.approvalsContainer}>
    <View style={styles.approvalRow}>
      <ApprovalBadge
        label="Mechanic Incharge"
        approved={is_approve_mic}
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
 )
)}

{(ScreenType === 'consumption' || ScreenType === 'log') && (
  role === Role.mechanicInCharge &&
 (is_approved_mic === "rejected" || is_approved_mic === "approved") && (
  <View style={styles.approvalsContainer}>
    <View style={styles.approvalRow}>
      <ApprovalBadge
        label="Mechanic Incharge"
        approved={is_approved_mic}
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
 )
)}




          {role === 'accountManager' && !(ScreenType === 'dieselInvoice') && (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.approveButton}
                onPress={handleApprove}>
                <Text style={styles.buttonText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rejectButton}
                onPress={handleReject}>
                <Text style={styles.buttonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          )}

          {role === 'accountManager' && ScreenType === 'dieselInvoice' && (
            <View style={styles.approvalsContainer}>
              <View style={styles.approvalRow}>
                <ApprovalBadge
                  label="Project Manager"
                  approved={projectManagerApproval}
                />
              </View>
            </View>
          )}

{reject_reason && (
   <View style={styles.infoRow}>
    <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Reject Reason</Text>
              <Text style={styles.infoValue}>{reject_reason}</Text>
            </View>
            </View>
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

function ItemDetail({label, value}: {label: string; value: string}) {
  return (
    <View style={styles.itemDetail}>
      <Text style={styles.itemDetailLabel}>{label}</Text>
      <Text style={styles.itemDetailValue}>{value}</Text>
    </View>
  );
}
