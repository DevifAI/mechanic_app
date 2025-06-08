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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {styles} from '../../styles/Mechanic/RequisitionStyles';
import {useNavigation, useRoute} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useRequisition, {RequestType} from '../../hooks/useRequisitionorReceipt';
import {RenderRequisitionOrReceiptItem} from '../../shared/renderRequisitionOrReceiptItem';
import {Role} from '../../services/api.enviornment';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {updateCurrenttab} from '../../redux/slices/authSlice';
type RequisitionType = 'Submitted' | 'Approvals' | 'Issued' | 'All';

const {width, height} = Dimensions.get('window');

const TABS: RequisitionType[] = ['Submitted', 'Approvals', 'Issued', 'All'];

const RequisitionOrReceiptPage = () => {
  const route = useRoute<any>();
  console.log(route, 'getting route');
  const {role, activeTab} = useSelector((state: RootState) => state.auth);

  const [filteredRequisitionsOrReceipt, setFilteredRequisitionsOrReceipt] =
    useState<any[]>([]);

  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const {getRequisitionsorReceiptsAll, setRequisitions, requisitions, loading} =
    useRequisition();
  console.log(requisitions, activeTab, 'requisitions data');
  useEffect(() => {
    console.log(requisitions, activeTab, 'requisitions data');
    const filteredRequisitions = requisitions.filter(item => {
      const {
        mechanicInchargeApproval,
        siteInchargeApproval,
        projectManagerApproval,
      } = item;

      switch (activeTab) {
        case 'Submitted':
          return !mechanicInchargeApproval;

        case 'Approvals':
          return mechanicInchargeApproval && !projectManagerApproval;

        case 'Issued':
          return (
            mechanicInchargeApproval &&
            siteInchargeApproval &&
            projectManagerApproval
          );

        case 'All':
        default:
          return true;
      }
    });

    setFilteredRequisitionsOrReceipt(filteredRequisitions);
    // setRequisitions([]);
  }, [activeTab]);

  const renderItem = ({item}: {item: any}) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          {item?.mechanicName && (
            <Text style={styles.date}>Mechanic name : {item.mechanicName}</Text>
          )}
          <Text style={styles.date}>Date : {item.date}</Text>
          <Text style={styles.itemCount}>
            Total No. of Items : {item.items.length}
          </Text>
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
  );

  useEffect(() => {
    setRequisitions([]);
    setFilteredRequisitionsOrReceipt([]);
    dispatch(updateCurrenttab('Submitted')); // Reset to default tab on mount
    getRequisitionsorReceiptsAll(
      route?.name === 'Requisition'
        ? RequestType.diselRequisition
        : RequestType.diselReceipt,
    );
    return () => {
      // setRequisitions([]);
      setFilteredRequisitionsOrReceipt([]);
      dispatch(updateCurrenttab('Submitted')); // Reset to default tab on unmount
      console.log('Resetting filteredRequisitionsOrReceipt and activeTab');
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      {/* Header */}
      <View style={styles.topBar}>
        <View style={styles.rightIcons}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={30} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>{route?.name}</Text>
        </View>
        <View style={styles.rightIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => console.log('Pressed!')}>
            <MaterialIcons name="support-agent" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => console.log('Pressed!')}>
            <Icon name="notifications-outline" size={24} color="black" />
          </TouchableOpacity>
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
