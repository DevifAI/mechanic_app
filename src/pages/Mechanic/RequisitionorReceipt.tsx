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
  BackHandler,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {styles} from '../../styles/Mechanic/RequisitionStyles';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useRequisition, {RequestType} from '../../hooks/useRequisitionorReceipt';
import {RenderRequisitionOrReceiptItem} from '../../shared/renderRequisitionOrReceiptItem';
import {Role} from '../../services/api.enviornment';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {updateCurrenttab} from '../../redux/slices/authSlice';
import commonHook from '../../hooks/commonHook';
import { getApprovalStatusMessage } from '../../hooks/useApprovalSatusMessage';
import ApprovalStatusBadge from '../../components/ApprovalStatusBadge';
type RequisitionType = 'Submitted' | 'Approvals' | 'Issued' | 'Rejected' | 'All' ;

const {width} = Dimensions.get('window');

const TABS: RequisitionType[] = ['Submitted', 'Approvals', 'Issued', 'Rejected' , 'All' ];

const RequisitionOrReceiptPage = () => {
  const route = useRoute<any>();
  console.log(route, 'getting route');
  const {role, activeTab , projectList} = useSelector((state: RootState) => state.auth);
const {formatDate} = commonHook();
  const [filteredRequisitionsOrReceipt, setFilteredRequisitionsOrReceipt] =
    useState<any[]>([]);

  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const {getRequisitionsorReceiptsAll, requisitions, setRequisitions, loading} =
    useRequisition();
  console.log(requisitions, activeTab, 'requisitions data');

 useEffect(() => {
    console.log(requisitions, activeTab, 'requisitions data');
    // setFilteredRequisitionsOrReceipt([]);
    
    const filteredRequisitions = requisitions.filter(item => {
  const {
    is_approve_mic,
    is_approve_sic,
    is_approve_pm,
  } = item;

  console.log(is_approve_mic, is_approve_sic, is_approve_pm);

  switch (activeTab) {
    case 'Submitted':
      // Show only if not yet approved/rejected by mechanic incharge
      return !is_approve_mic || is_approve_mic === 'pending';

    case 'Approvals':
      // Show if approved by mechanic incharge, but not yet approved by PM
      return is_approve_mic === 'approved' && is_approve_pm !== 'approved';

       case 'Rejected':
        // Show if any of them has rejected
        return (
          is_approve_mic === 'rejected' ||
          is_approve_sic === 'rejected' ||
          is_approve_pm === 'rejected'
        );
        
    case 'Issued':
      // Show only if all three have approved
      return (
        is_approve_mic === 'approved' &&
        is_approve_sic === 'approved' &&
        is_approve_pm === 'approved'
      );

    case 'All':
    default:
      return true;
  }
});
  setFilteredRequisitionsOrReceipt(filteredRequisitions);
}, [requisitions, activeTab]);



  const renderItem = ({item}: {item: any}) =>{
    return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          {item?.mechanicName && role !== Role.mechanic && (
            <Text style={styles.date}>Mechanic name : {item.mechanicName}</Text>
          )}
          <Text style={styles.date}>Date : {formatDate(item.date)}</Text>
          <Text style={styles.itemCount}>
            Total No. of Items : {item.items.length}
          </Text>
          <ApprovalStatusBadge
  is_approve_mic={item.is_approve_mic}
  is_approve_sic={item.is_approve_sic}
  is_approve_pm={item.is_approve_pm}
/>
        </View>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() =>
            navigation.navigate('ViewItems', {
              document: item,
              ScreenType:
                route?.name === 'Requisition' ? 'requisition' : 'receipt',
            })
          }>
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  )};

  useEffect(() => {
    // if (filteredRequisitions.length === 0)
    getRequisitionsorReceiptsAll(
      route?.name === 'Requisition'
        ? RequestType.diselRequisition
        : RequestType.diselReceipt,
    );
  }, [route?.name, activeTab]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        console.log('Back button pressed');
        // dispatch(updateCurrenttab('Submitted')); // Reset to default tab on back press
        navigation.goBack(); // Navigate back to the previous screens

        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => backHandler.remove(); // ✅ Proper cleanup
    }, [activeTab]),
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      {/* Header */}
      <View style={styles.topBar}>
        <View style={styles.rightIcons}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={30} color="black" />
          </TouchableOpacity>
          <View style={styles.LogoContainer}>
                <Image
                  source={require('../../assets/Home/SoftSkirl.png')}
                  style={styles.logo}
                />
                <Text style={styles.appName}>{projectList?.[0]?.project_no}</Text>
              </View>
        </View>
        <View style={styles.rightIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => console.log('Pressed!')}>
            <Ionicons name="settings-outline" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => console.log('Pressed!')}>
            <Icon name="notifications-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <View>
        <View style={styles.topBar2}>
          <Text style={styles.title}>{route?.name}</Text>
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
      ) : filteredRequisitionsOrReceipt?.length === 0 ? (
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
          data={filteredRequisitionsOrReceipt}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{paddingHorizontal: width * 0.04}}
        />
      )}

      {/* Floating Add Button */}
      {role === Role.mechanic && (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(
              route?.name === 'Requisition'
                ? 'CreateRequisition'
                : 'CreateReceipt',
            )
          }
          style={styles.fab}>
          <Text style={styles.fabIcon}>＋</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default RequisitionOrReceiptPage;
