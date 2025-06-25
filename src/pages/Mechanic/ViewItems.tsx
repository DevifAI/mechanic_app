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
  ActivityIndicator,
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
import {
  updateCurrenttab,
  updateCurrenttab2,
} from '../../redux/slices/authSlice';
import {Role} from '../../services/api.enviornment';
import commonHook from '../../hooks/commonHook';
import useMaterialInOrOut, {
  MaterialDataType,
} from '../../hooks/useMaterialInOrOut';
import useEquipmentInOrOut from '../../hooks/useEquipmentInOrout';

type Item = {
  quantity: number;
  qty: number;
  uom: string;
  Notes: string;
  notes: string;
  equipment?: string;
  readingMeterNo?: string;
  readingMeterUom?: string;
  unitRate?: string;
  totalValue?: string;
  itemData?: any;
  items?: any;
  consumableItem?: any;
  item?: string;
  equipmentData: any;
  unitOfMeasure: any;
  uomData: any;
  unitOfMeasurement: any;
};

type DocumentItem = {
  id: string;
  date: string;
  items: Item[];
  formItems: Item[];
  partnerDetails: any;
  is_approve_mic: 'approved' | 'pending' | 'rejected' | boolean;
  is_approved_mic: 'approved' | 'pending' | 'rejected' | boolean;
  is_approve_sic: 'approved' | 'pending' | 'rejected' | boolean;
  is_approved_sic: 'approved' | 'pending' | 'rejected' | boolean;
  is_approve_pm: 'approved' | 'pending' | 'rejected' | boolean;
  is_approved_pm: 'approved' | 'pending' | 'rejected' | boolean;
  siteInchargeApproval: string | boolean;
  projectManagerApproval: string | boolean;
  accountManagerApproval: string | boolean;
  // Log-specific fields
  equipmentData?: any;
  equipment_name?: string;
  equipment?: string;
  next_date?: string;
  mantainanceLogNo?: string;
  notes?: string;
  action_planned?: string;
  challan_no?: string;
  partner?: string;
  type?: string;
  reasonOut?: string;
  reject_reason?: string;
};

type RootStackParamList = {
  ViewDocument: {
    document: DocumentItem;
    ScreenType:
      | 'requisition'
      | 'receipt'
      | 'consumption'
      | 'log'
      | 'MaterialIn'
      | 'MaterialOut'
      | 'EquipmentIn'
      | 'EquipmentOut'
      | 'dieselInvoice'
      | 'MaterialBill';
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
  const {role, projectId} = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch();

  const {document, ScreenType} = route.params;
  console.log('Document:', document, ScreenType);
  const {updateRequisitionOrReceipt, loading, getRequisitionsorReceiptsAll} =
    useRequisition();
  const {updateConsumption, getConsumptionByUserId} = useConsumption();
  const {updateMaintananceLog, getAllMaintananceLogByUserId} = useMaintanance();
  const {
    fetchMaterials,
    updateMaterial,
    loading: materialUpdateLoading,
  } = useMaterialInOrOut();
  const {updateEquipmentByProjectManager, loading: equipmentUpdateLoading} =
    useEquipmentInOrOut();
  const {
    id,
    date,
    items,
    formItems,
    partnerDetails,
    is_approved_mic,
    is_approve_mic,
    is_approved_sic,
    is_approve_sic,
    is_approve_pm,
    is_approved_pm,
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
    challan_no,
    partner,
    type,
    reasonOut,
    reject_reason,
  } = document;

  console.log('mechanicInchargeApproval', document);
  const title =
    ScreenType === 'requisition'
      ? 'Requisition Details'
      : ScreenType === 'receipt'
      ? 'Receipt Details'
      : ScreenType === 'consumption'
      ? 'Consumption Details'
      : ScreenType === 'MaterialIn'
      ? 'Material In Details'
      : ScreenType === 'MaterialOut'
      ? 'Material Out Details'
      : ScreenType === 'EquipmentIn'
      ? 'Equipment In Details'
      : ScreenType === 'EquipmentOut'
      ? 'Equipment Out Details'
      : ScreenType === 'dieselInvoice'
      ? 'Diesel Invoice Details'
      : ScreenType === 'MaterialBill'
      ? 'Material Bill Details'
      : ScreenType === 'log'
      ? 'Maintenance Log Details'
      : 'Maintenance Log Details';

  const handleApproveCallBack = () => {
    dispatch(updateCurrenttab('Approvals'));
    dispatch(updateCurrenttab2('Approved'));
    if (ScreenType === 'requisition')
      getRequisitionsorReceiptsAll(RequestType.diselRequisition);
    else if (ScreenType === 'receipt')
      getRequisitionsorReceiptsAll(RequestType.diselReceipt);
    else if (ScreenType === 'consumption') getConsumptionByUserId();
    else if (ScreenType === 'log') getAllMaintananceLogByUserId();
    else if (ScreenType === 'MaterialIn') fetchMaterials(MaterialDataType.IN);
    else if (ScreenType === 'MaterialOut') fetchMaterials(MaterialDataType.OUT);
    navigation.goBack();
  };

  console.log('#############', is_approve_mic);

  const handleRejectCallback = () => {
    dispatch(updateCurrenttab('Rejected'));
    dispatch(updateCurrenttab2('Rejected'));
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
    } else if (ScreenType === 'MaterialIn' || ScreenType === 'MaterialOut') {
      updateMaterial(
        {material_transaction_id: id, status: 'approved'},
        handleApproveCallBack,
      );
    } else if (ScreenType === 'EquipmentIn' || ScreenType === 'EquipmentOut') {
      updateEquipmentByProjectManager(
        {
          equipment_transaction_id: id,
          status: 'approved',
          project_id: projectId,
        },
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

  const rejectMaterial = () => {
    if (ScreenType === 'MaterialIn' || ScreenType === 'MaterialOut') {
      updateMaterial(
        {
          material_transaction_id: id, // assume currentId is from useState or route.params
          status: 'rejected',
        },
        handleRejectCallback, // assume this is defined in your component
      );
    } else if (ScreenType === 'EquipmentIn' || ScreenType === 'EquipmentOut') {
      updateEquipmentByProjectManager(
        {
          project_id: projectId,
          equipment_transaction_id: id, // assume currentId is from useState or route.params
          status: 'rejected',
        },
        handleRejectCallback, // assume this is defined in your component
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
          {item.equipmentData?.equipment_name}
        </Text>
      )}

      {ScreenType === 'EquipmentIn' && (
        <Text style={styles.itemTitle}>
          <Text style={{fontSize: 16, fontWeight: '600', color: '#666'}}>
            Equipment:
          </Text>{' '}
          {item?.consumableItem?.item_name || 'N/A'}
        </Text>
      )}

      {ScreenType !== 'EquipmentIn' && (
        <>
          {console.log('Item Object:', item)}
          <Text style={styles.itemTitle}>
            <Text style={{fontSize: 16, fontWeight: '600', color: '#666'}}>
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
        <ItemDetail
          label="Quantity: "
          value={item.quantity?.toString() || item.qty?.toString()}
        />
        <ItemDetail
          label="UOM: "
          value={
            ScreenType === 'MaterialIn' ||
            ScreenType === 'MaterialOut' ||
            ScreenType === 'EquipmentIn' ||
            ScreenType === 'EquipmentOut' ||
            ScreenType === 'MaterialBill'
              ? item?.unitOfMeasure?.unit_name
              : item.uom ||
                item?.unitOfMeasurement?.unit_name ||
                item?.uomData?.unit_name
          }
        />
      </View>

      {ScreenType === 'consumption' &&
        item?.item.toLowerCase() === 'diesel' && (
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

      {item.Notes || item.notes ? (
        <Text style={styles.itemNotes}>Notes: {item.Notes || item.notes}</Text>
      ) : null}
    </View>
  );

  console.log('screeeeeeeeeeene', ScreenType);

  return (
    <SafeAreaView
      style={{
        flexGrow: 1,
        paddingTop: 40,
        paddingBottom: 40,
        backgroundColor: '#fff',
      }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
        style={styles.container}>
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
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>No of Items</Text>
              <Text style={styles.infoValue}>
                {(items?.length || formItems?.length)?.toString()}
              </Text>
            </View>
          </View>

          {/* LOG-specific fields */}
          {ScreenType === 'log' && (
            <View style={styles.logDetails}>
              <View style={styles.infoRow}>
                <View style={styles.infoCard}>
                  <Text style={styles.infoLabel}>Equipment</Text>
                  <Text style={styles.infoValue}>
                    {equipmentData?.equipment_name ||
                      equipment?.equipment_name ||
                      '-'}
                  </Text>
                </View>
                <View style={styles.infoCard}>
                  <Text style={styles.infoLabel}>Next Date</Text>
                  <Text style={styles.infoValue}>{formatDate(next_date)}</Text>
                </View>
              </View>

              <View style={styles.logCard}>
                <Text style={styles.infoLabel}>Maintainance Log Number</Text>
                <Text style={styles.infoValue}>{mantainanceLogNo || '-'}</Text>

                <View style={{marginVertical: 12, paddingRight: 8}}>
                  <Text style={{fontSize: 14, color: '#111', lineHeight: 20}}>
                    <Text style={{fontWeight: '600', color: '#555'}}>
                      Note:{' '}
                    </Text>
                    <Text style={{fontWeight: '700', fontStyle: 'italic'}}>
                      {notes || '-'}
                    </Text>
                  </Text>
                </View>

                <View style={{marginVertical: 12, paddingRight: 8}}>
                  <Text style={{fontSize: 14, color: '#111', lineHeight: 20}}>
                    <Text style={{fontWeight: '600', color: '#555'}}>
                      Action Plan:{' '}
                    </Text>
                    <Text style={{fontWeight: '700', fontStyle: 'italic'}}>
                      {action_planned || '-'}
                    </Text>
                  </Text>
                </View>
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
                ScreenType === 'MaterialOut' ||
                ScreenType === 'EquipmentIn' ||
                ScreenType === 'EquipmentOut'
              ) && (
                <View style={styles.infoRow}>
                  <View style={styles.infoCard}>
                    <Text style={styles.infoLabel}>Type</Text>
                    <Text style={styles.infoValue}>{type || '-'}</Text>
                  </View>
                  <View style={styles.infoCard}>
                    <Text style={styles.infoLabel}>Challan No</Text>
                    <Text style={styles.infoValue}>{challan_no || '-'}</Text>
                  </View>
                </View>
              )}

              {(ScreenType === 'MaterialOut' ||
                ScreenType === 'EquipmentIn') && (
                <View style={styles.logCard}>
                  <Text style={styles.infoLabel}>Type</Text>
                  <Text style={styles.infoValue}>{type}</Text>
                </View>
              )}

              {/* {ScreenType === 'EquipmentOut' && (
                <View style={styles.logCard}>
                  <Text style={styles.infoLabel}>Reason Out</Text>
                  <Text style={styles.infoValue}>{reasonOut}</Text>
                </View>
              )} */}

              {partner && (
                <View style={styles.logCard}>
                  <Text style={styles.infoLabel}>Partner</Text>
                  <Text style={styles.infoValue}>
                    {partnerDetails?.partner_name}
                  </Text>
                </View>
              )}
            </View>
          )}

          <Text style={styles.subheading}>ITEMS</Text>

          <View
            style={{
              maxHeight: width * 0.75,
              width: '100%',
              paddingLeft: 6,
              paddingVertical: 4,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <FlatList
              data={items || formItems}
              keyExtractor={(_, index) => index?.toString()}
              // showsVerticalScrollIndicator={false}
              scrollEnabled={true}
              nestedScrollEnabled={true} // ✅ Especially for Android
              showsVerticalScrollIndicator={true}
              contentContainerStyle={{paddingBottom: 8}}
              renderItem={renderItem}
              onViewableItemsChanged={onViewRef.current}
              viewabilityConfig={viewabilityConfig}
            />
          </View>

          {/* 
<View style={{ maxHeight: 300 }}>
  <FlatList
    data={items || formItems}
    keyExtractor={(_, index) => index.toString()}
    renderItem={renderItem}
    scrollEnabled={true}
    nestedScrollEnabled={true} // <-- Required for Android
    showsVerticalScrollIndicator={true}
  />
</View> */}

          <View style={styles.indicatorContainer}>
            {items?.map((_, index) => (
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
                  label="Project Manager"
                  approved={is_approve_pm}
                />
              </View>
            </View>
          )}

          {role === Role.mechanic &&
            (is_approve_mic === 'rejected' ||
              is_approve_mic === 'approved' ||
              is_approved_mic === 'rejected' ||
              is_approved_mic === 'approved') && (
              <View style={styles.approvalsContainer}>
                <View style={styles.approvalRow}>
                  <ApprovalBadge
                    label="Mechanic Incharge"
                    approved={is_approve_mic || is_approved_mic}
                  />
                  <ApprovalBadge
                    label="Site Incharge"
                    approved={is_approve_sic || is_approved_sic}
                  />
                  <ApprovalBadge
                    label="Project Manager"
                    approved={is_approve_pm || is_approved_pm}
                  />
                </View>
              </View>
            )}

          {role === Role.mechanicInCharge &&
            is_approve_mic !== 'approved' &&
            is_approve_mic !== 'rejected' &&
            is_approved_mic !== 'approved' &&
            is_approved_mic !== 'rejected' && (
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

          {role === Role.mechanicInCharge &&
            (is_approve_mic === 'rejected' ||
              is_approve_mic === 'approved' ||
              is_approved_mic === 'approved' ||
              is_approved_mic === 'rejected') && (
              <View style={styles.approvalsContainer}>
                <View style={styles.approvalRow}>
                  <ApprovalBadge
                    label="Mechanic Incharge"
                    approved={is_approve_mic || is_approved_mic}
                  />
                  <ApprovalBadge
                    label="Site Incharge"
                    approved={is_approve_sic || is_approved_sic}
                  />
                  <ApprovalBadge
                    label="Project Manager"
                    approved={is_approve_pm || is_approved_pm}
                  />
                </View>
              </View>
            )}

          {/* Show Approval Badges */}
          {role === Role.siteInCharge &&
            (is_approve_mic === 'pending' ||
              is_approved_mic === 'pending' ||
              is_approve_mic === 'rejected' ||
              is_approved_mic === 'rejected' ||
              is_approve_sic === 'approved' ||
              is_approved_sic === 'approved' ||
              is_approve_sic === 'rejected' ||
              is_approved_sic === 'rejected') && (
              <View style={styles.approvalsContainer}>
                <View style={styles.approvalRow}>
                  <ApprovalBadge
                    label="Mechanic Incharge"
                    approved={is_approve_mic || is_approved_mic}
                  />
                  <ApprovalBadge
                    label="Site Incharge"
                    approved={is_approve_sic || is_approved_sic}
                  />
                  <ApprovalBadge
                    label="Project Manager"
                    approved={is_approve_pm || is_approved_pm}
                  />
                </View>
              </View>
            )}

          {/* Show Approve/Reject Buttons */}
          {role === Role.siteInCharge &&
            (is_approve_mic === 'approved' || is_approved_mic === 'approved') &&
            (is_approve_sic === 'pending' || is_approved_sic === 'pending') && (
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

          {/* Show Approve/Reject Buttons */}
          {role === Role.projectManager &&
            (is_approve_sic === 'approved' || is_approved_sic === 'approved') &&
            (is_approve_pm === 'pending' || is_approved_pm === 'pending') && (
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

          {(ScreenType === 'MaterialIn' ||
            ScreenType === 'MaterialOut' ||
            ScreenType === 'EquipmentIn' ||
            ScreenType === 'EquipmentOut') &&
            role === Role.projectManager &&
            (is_approve_pm === 'pending' || is_approved_pm === 'pending') && (
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  disabled={equipmentUpdateLoading || materialUpdateLoading}
                  style={styles.approveButton}
                  onPress={handleApprove}>
                  {equipmentUpdateLoading || materialUpdateLoading ? (
                    <ActivityIndicator size="small" color="black" />
                  ) : (
                    <Text style={styles.buttonText}>Approve</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={equipmentUpdateLoading || materialUpdateLoading}
                  style={styles.rejectButton}
                  onPress={rejectMaterial}>
                  {equipmentUpdateLoading || materialUpdateLoading ? (
                    <ActivityIndicator size="small" color="black" />
                  ) : (
                    <Text style={styles.buttonText}>Reject</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

          {role === Role.projectManager &&
            ScreenType !== 'MaterialIn' &&
            ScreenType !== 'MaterialOut' &&
            ScreenType !== 'EquipmentIn' &&
            ScreenType !== 'EquipmentOut' &&
            // Show if PM has acted
            ((is_approve_pm !== 'pending' && is_approved_pm !== 'pending') ||
              // OR: MIC is still pending or rejected
              is_approve_mic === 'pending' ||
              is_approved_mic === 'pending' ||
              is_approve_mic === 'rejected' ||
              is_approved_mic === 'rejected' ||
              // OR: SIC is pending
              is_approve_sic === 'pending' ||
              is_approved_sic === 'pending') && (
              <View style={styles.approvalsContainer}>
                <View style={styles.approvalRow}>
                  <ApprovalBadge
                    label="Mechanic Incharge"
                    approved={is_approve_mic || is_approved_mic}
                  />
                  <ApprovalBadge
                    label="Site Incharge"
                    approved={is_approve_sic || is_approved_sic}
                  />
                  <ApprovalBadge
                    label="Project Manager"
                    approved={is_approve_pm || is_approved_pm}
                  />
                </View>
              </View>
            )}

          {role === Role.projectManager &&
            (ScreenType === 'MaterialIn' ||
              ScreenType === 'MaterialOut' ||
              ScreenType === 'EquipmentIn' ||
              ScreenType === 'EquipmentOut') &&
            is_approve_pm !== 'pending' &&
            is_approved_pm !== 'pending' && (
              <View style={styles.approvalsContainer}>
                <View style={styles.approvalRow}>
                  <ApprovalBadge
                    label="Project Manager"
                    approved={is_approve_pm || is_approved_pm}
                  />
                </View>
              </View>
            )}

          {role === 'accountManager' &&(
            <View style={styles.approvalsContainer}>
              <View style={styles.approvalRow}>
                <ApprovalBadge
                  label="Project Manager"
                  approved={is_approve_mic === 'approved'}
                />
              </View>
            </View>
          )}

          {/* /Admin */}

          {role === Role.admin && (
            <View style={styles.approvalsContainer}>
              <View style={styles.approvalRow}>
                {(is_approve_mic || is_approved_mic) && (
                  <ApprovalBadge
                    label="Mechanic Incharge"
                    approved={is_approve_mic || is_approved_mic}
                  />
                )}
                {(is_approve_sic || is_approved_sic) && (
                  <ApprovalBadge
                    label="Site Incharge"
                    approved={is_approve_sic || is_approved_sic}
                  />
                )}
                {(is_approve_pm || is_approved_pm) && (
                  <ApprovalBadge
                    label="Project Manager"
                    approved={is_approve_pm || is_approved_pm}
                  />
                )}
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
