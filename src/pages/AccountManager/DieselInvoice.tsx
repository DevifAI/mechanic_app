import React, { useEffect, useState } from 'react';
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
import { styles } from '../../styles/Mechanic/RequisitionStyles';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import useMaterialBill from '../../hooks/useMaterialBill';
import useRevenueInput from '../../hooks/useRevenueInput';
import useExpenseInput from '../../hooks/UseEquipmentInput';
import PMApprovalBadge from '../../components/PMapprovalBadge';
import { updateCurrenttab2 } from '../../redux/slices/authSlice';

const { width } = Dimensions.get('window');

const TABS = ['All', 'Submitted', 'Approved', 'Rejected'];

const DieselInvoice = () => {
  const [filteredMaterials, setFilteredMaterials] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { role, activeTab2, projectList, selectedProjectNumber } = useSelector((state: RootState) => state.auth);

  const { fetchMaterialBills, materialBill } = useMaterialBill();
  const { fetchRevenueInput, revenueInput } = useRevenueInput();
  const { fetchExpenseInput, expenseInput } = useExpenseInput();

  const getTitle = () => {
    switch (route.name) {
      case 'MaterialBill': return 'Material Bill';
      case 'RevenueInput': return 'Revenue Input';
      case 'ExpenseInput': return 'Expense Input';
      case 'DieselInvoice': return 'Diesel Invoice';
      default: return 'Title';
    }
  };

  const getCreateRoute = () => {
    switch (route.name) {
      case 'MaterialBill': return 'CreateMaterialBill';
      case 'RevenueInput': return 'CreateRevenueInput';
      case 'ExpenseInput': return 'CreateExpenseInput';
      case 'DieselInvoice': return 'CreateDieselInvoice';
      default: return 'Title';
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (route.name === 'MaterialBill') await fetchMaterialBills();
      else if (route.name === 'RevenueInput') await fetchRevenueInput();
      else if (route.name === 'ExpenseInput') await fetchExpenseInput();
      setLoading(false);
    };
    fetchData();
  }, [route?.name, activeTab2]);

  useEffect(() => {
    console.log("dataaaaaaaaaaaaaaaaaaaaaaaa" ,  expenseInput)
    let dataToFilter = [];
    if (route.name === 'MaterialBill') dataToFilter = materialBill;
    else if (route.name === 'RevenueInput') dataToFilter = revenueInput;
    else if (route.name === 'ExpenseInput') dataToFilter = expenseInput;

    const filtered = dataToFilter.filter((item: any) => {
      const status = item?.is_approve_pm?.toLowerCase();
      switch (activeTab2) {
        case 'Submitted': return status === 'pending';
        case 'Approved': return status === 'approved';
        case 'Rejected': return status === 'rejected';
        case 'All':
        default: return true;
      }
    });
    setFilteredMaterials(filtered);
  }, [route.name, materialBill, revenueInput, expenseInput, activeTab2]);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          <Text style={styles.date}>Date : {item.date}</Text>
          <Text style={styles.itemCount}>Total No. of Items : {item?.formItems?.length}</Text>

          <PMApprovalBadge
           is_approve_pm={item.is_approve_pm}/>
        </View>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() =>
            navigation.navigate('ViewItems', {
              document: item,
              ScreenType: route.name,
            })
          }
        >
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={styles.topBar}>
        <View style={styles.rightIcons}>
          <TouchableOpacity
            onPress={() =>
              route.name === 'DieselInvoice' ? navigation.openDrawer() : navigation.goBack()
            }
          >
            {route.name === 'DieselInvoice' ? (
              <Ionicons name="menu" size={30} color="black" />
            ) : (
              <Ionicons name="arrow-back" size={30} color="black" />
            )}
          </TouchableOpacity>
          <View style={styles.LogoContainer}>
            <Image source={require('../../assets/Home/SoftSkirl.png')} style={styles.logo} />
            <Text style={styles.appName}>{selectedProjectNumber || projectList?.[0]?.project_no}</Text>
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
        <Text style={styles.title}>{getTitle()}</Text>
      </View>

      <View style={styles.tabs}>
        {TABS.map(tab => (
          <TouchableOpacity key={tab} onPress={() => dispatch(updateCurrenttab2(tab))}>
            <Text style={[styles.tabText, activeTab2 === tab && styles.activeTab]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Loading...</Text>
      ) : filteredMaterials?.length > 0 ? (
        <FlatList
          data={filteredMaterials}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: width * 0.04 }}
        />
      ) : (
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <Text style={{ fontSize: 16, color: '#888' }}>No data found.</Text>
        </View>
      )}

      <TouchableOpacity
        onPress={() => navigation.navigate(getCreateRoute())}
        style={styles.fab}
      >
        <Text style={styles.fabIcon}>＋</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DieselInvoice;
