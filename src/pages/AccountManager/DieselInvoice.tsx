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
import { updateCurrenttab3 } from '../../redux/slices/authSlice';
import useDieselInvoice from '../../hooks/useDieselInvoice';
import commonHook from '../../hooks/commonHook';

const { width } = Dimensions.get('window');

const TABS = ['Draft', 'Invoiced', 'All'];

const DieselInvoice = () => {
  const [filteredMaterials, setFilteredMaterials] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [combinedData, setCombinedData] = useState<any>({ bills: [], materialTransactions: [] });
  const [combinedDieselData, setCombinedDieselData] = useState<any>({ dieselReceipts: [], dieselInvoices: [] });
  const [initialApiData, setInitialApiData] = useState<any>(null); // New state for initial API data
  const [initialApiLoading, setInitialApiLoading] = useState(true); // Loading state for initial API
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { role, activeTab3, projectList, selectedProjectNumber } = useSelector((state: RootState) => state.auth);

  const { fetchMaterialBills, materialBill, fetchCombinedBillsAndMaterials } = useMaterialBill();
  const { fetchRevenueInput, revenueInput } = useRevenueInput();
  const { fetchExpenseInput, expenseInput } = useExpenseInput();
  const { fetchDieselInvoices, dieselInvoices } = useDieselInvoice();

const {formatDate} = commonHook();

  useEffect(() => {
    fetchMaterialBills();
    fetchDieselInvoices();
  }, [])
  

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

  // Function to check if current route should show tabs
  const shouldShowTabs = () => {
    return route.name === 'MaterialBill' || route.name === 'DieselInvoice';
  };

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    if (route.name === 'MaterialBill') {
      await fetchMaterialBills(); // fetch and wait for update
    } else if (route.name === 'RevenueInput') {
      await fetchRevenueInput();
    } else if (route.name === 'ExpenseInput') {
      await fetchExpenseInput();
    } else if (route.name === 'DieselInvoice') {
      await fetchDieselInvoices(); // fetch and wait for update
    }
    setLoading(false);
  };
  fetchData();
}, [route?.name, activeTab3]);

useEffect(() => {
  if (route.name === 'MaterialBill' && materialBill) {
    setCombinedData(materialBill);
  }
}, [route.name, materialBill]);

useEffect(() => {
  if (route.name === 'DieselInvoice' && dieselInvoices) {
    setCombinedDieselData(dieselInvoices);
  }
}, [route.name, dieselInvoices]);


  useEffect(() => {
    let dataToFilter = [];

    if (route.name === 'MaterialBill') {
      // Handle Material Bill filtering based on active tab
      switch (activeTab3) {
        case 'Draft':
          dataToFilter = combinedData.materialTransactions || [];
          break;
        case 'Invoiced':
          dataToFilter = combinedData.bills || [];
          break;
        case 'All':
        default:
          dataToFilter = [
            ...(combinedData.bills || []),
            ...(combinedData.materialTransactions || [])
          ];
          break;
      }
    } else if (route.name === 'DieselInvoice') {
      // Handle Diesel Invoice filtering based on active tab
      switch (activeTab3) {
        case 'Draft':
          dataToFilter = combinedDieselData.dieselReceipts || [];
          break;
        case 'Invoiced':
          dataToFilter = combinedDieselData.dieselInvoices || [];
          break;
        case 'All':
        default:
          dataToFilter = [
            ...(combinedDieselData.dieselInvoices || []),
            ...(combinedDieselData.dieselReceipts || [])
          ];
          break;
      }
    } else if (route.name === 'RevenueInput') {
      dataToFilter = revenueInput;
    } else if (route.name === 'ExpenseInput') {
      dataToFilter = expenseInput;
    }

    // For non-MaterialBill and non-DieselInvoice routes, apply filtering logic if needed
    if (route.name !== 'MaterialBill' && route.name !== 'DieselInvoice') {
      const filtered = dataToFilter.filter((item: any) => {
        const status = item?.is_approve_pm?.toLowerCase();
        // Add your filtering logic here if needed
        return true;
      });
      setFilteredMaterials(filtered);
    } else {
      setFilteredMaterials(dataToFilter);
    }
  }, [route.name, materialBill, revenueInput, expenseInput, dieselInvoices, activeTab3, combinedData, combinedDieselData]);

  // Helper function to determine if item is a bill or transaction for MaterialBill
  const isItemFromBills = (item: any) => {
    return item?.materialTransactionId !== undefined || 
           item?.partner_inv_no !== undefined ||
           item?.inv_basic_value !== undefined ||
           item?.total_invoice_value !== undefined;
  };

  // Helper function to determine if item is a transaction for MaterialBill
  const isItemFromTransactions = (item: any) => {
    return item?.data_type !== undefined ||
           item?.type !== undefined ||
           item?.challan_no !== undefined ||
           item?.is_invoiced !== undefined;
  };

  // Helper function to determine if item is from diesel receipts (draft)
  const isItemFromDieselReceipts = (item: any) => {
    return item?.items !== undefined && 
           item?.createdByEmployee !== undefined &&
           item?.organisation !== undefined &&
           !item?.invoice_no; // assuming invoices have invoice_no field
  };

  // Helper function to determine if item is from diesel invoices
  const isItemFromDieselInvoices = (item: any) => {
    return item?.dieselReceiptId !== undefined || 
           item?.total_invoice_value !== undefined ||
           item?.partner_inv_no !== undefined;
  };

//   const formatDate = (dateString: string) => {
//   const date = new Date(dateString);
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');
//   return `${day}-${month}-${year}`;
// };


  const handleRefresh = async () => {
  setLoading(true);
  if (route.name === 'MaterialBill') {
    await fetchMaterialBills();
  } else if (route.name === 'RevenueInput') {
    await fetchRevenueInput();
  } else if (route.name === 'ExpenseInput') {
    await fetchExpenseInput();
  } else if (route.name === 'DieselInvoice') {
    await fetchDieselInvoices();
  }
  setLoading(false);
};


  const renderItem = ({ item }: { item: any }) => {
    // Determine the item count based on the route and item structure
    let itemCount = 0;
    
    if (route.name === 'DieselInvoice' || route.name === 'MaterialBill' ) {
      itemCount = item?.formItems?.length || item?.items?.length || 0;
    }

    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.leftSection}>
           <Text style={styles.date}>Date : {formatDate(item.date)}</Text>

         {(route.name === 'DieselInvoice' || route.name === 'MaterialBill') && (
  <>
  <Text style={styles.itemCount}>Total No. of Items : {itemCount}</Text>
  </>
)}

{ route.name === 'MaterialBill' && (
  <>
  <Text style={styles.itemCount}>Challan No : {item.partner_inv_no}</Text>
  <Text style={styles.itemCount}>Total Value : ₹{item.total_invoice_value}</Text>
  </>
)}

{route.name === 'MaterialBill' && isItemFromBills(item) ? (
  <View style={{ paddingVertical: 4, borderRadius: 4 }}>
    <Text style={{ fontWeight: '600', fontSize: 14, marginTop: 4, fontStyle: 'italic', color: 'green' }}>
      Invoiced
    </Text>
  </View>
) : route.name === 'DieselInvoice' && isItemFromDieselInvoices(item) ? (
  <View style={{ paddingVertical: 4, borderRadius: 4 }}>
    <Text style={{ fontWeight: '600', fontSize: 14, marginTop: 4, fontStyle: 'italic', color: 'green' }}>
      Invoiced
    </Text>
  </View>
) : (route.name === 'DieselInvoice' || route.name === 'MaterialBill') ? (
  <PMApprovalBadge is_approve_pm={item.is_approve_pm} />
) : null}

{route.name === 'ExpenseInput' &&
<>
 <Text style={styles.itemCount}>Paid To : {item.paid_to}</Text>
  <Text style={styles.itemCount}>Paid By : {item.paid_by}</Text>
   <Text style={styles.itemCount}>Amount : ₹{item.amount}</Text>
  </>
 }

 {route.name === 'RevenueInput' &&
<>
 <Text style={styles.itemCount}>Account Code: {item.account_code}</Text>
  <Text style={styles.itemCount}>Amount Basic : {item.amount_basic}</Text>
   <Text style={styles.itemCount}>Total Amount : ₹{item.total_amount}</Text>
  </>
 }

          </View>

          <TouchableOpacity
  style={styles.viewButton}
    onPress={() => {
    if (role === 'admin') {
      // Admins always go to ViewItems
      navigation.navigate('ViewItems', {
        document: item,
        ScreenType: route.name,
      });
      return;
    }

    if (route.name === 'DieselInvoice') {
      if (isItemFromDieselInvoices(item)) {
        navigation.navigate('ViewItems', {
          document: item,
          ScreenType: route.name,
        });
      } else {
        navigation.navigate('CreateDieselInvoice', {
          document: item,
          ScreenType: route.name,
        });
      }
    } else if (route.name === 'MaterialBill') {
      if (isItemFromBills(item)) {
        navigation.navigate('ViewItems', {
          document: item,
          ScreenType: route.name,
        });
      } else if (isItemFromTransactions(item)) {
        navigation.navigate('CreateMaterialBill', {
          document: item,
        });
      } else {
        const hasUnitPrice = item?.formItems?.some((formItem: any) =>
          formItem?.unit_price !== undefined &&
          formItem?.unit_price !== null &&
          formItem?.unit_price !== '' &&
          formItem?.unit_price !== 0
        );

        if (hasUnitPrice) {
          navigation.navigate('ViewItems', {
            document: item,
            ScreenType: route.name,
          });
        } else {
          navigation.navigate('CreateMaterialBill', {
            document: item,
          });
        }
      }
    } else {
      navigation.navigate('ViewItems', {
        document: item,
        ScreenType: route.name,
      });
    }
  }}
>
  <Text style={styles.viewButtonText}>View</Text>
</TouchableOpacity>

        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={styles.topBar}>
        <View style={styles.rightIcons}>
         <TouchableOpacity
  onPress={() => {
    if (role === 'admin' || route.name === 'DieselInvoice') {
      navigation.navigate('MainTabs');
    } else {
      navigation.openDrawer();
    }
  }}
>
  <Ionicons
    name={
      role === 'admin' || route.name === 'DieselInvoice'
        ? 'arrow-back'
        : 'menu'
    }
    size={30}
    color="black"
  />
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

      {/* Only show tabs for MaterialBill and DieselInvoice */}
      {shouldShowTabs() && (
        <View style={styles.tabs}>
          {TABS.map(tab => (
            <TouchableOpacity key={tab} onPress={() => dispatch(updateCurrenttab3(tab))}>
              <Text style={[styles.tabText, activeTab3 === tab && styles.activeTab]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {loading ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Loading...</Text>
      ) : filteredMaterials?.length > 0 ? (
        <FlatList
          data={filteredMaterials}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          onRefresh={handleRefresh}          // ✅ added
           refreshing={loading} 
          contentContainerStyle={{ paddingHorizontal: width * 0.04 }}
        />
      ) : (
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <Text style={{ fontSize: 16, color: '#888' }}>No data found.</Text>
        </View>
      )}

{(route.name === 'ExpenseInput' || route.name === 'RevenueInput') && role !== 'admin' && (
  <TouchableOpacity
    onPress={() => navigation.navigate(getCreateRoute())}
    style={styles.fab}
  >
    <Text style={styles.fabIcon}>＋</Text>
  </TouchableOpacity>
)}


    </View>
  );
};

export default DieselInvoice;