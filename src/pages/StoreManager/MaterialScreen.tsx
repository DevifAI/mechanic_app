import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { RootState } from '../../redux/store';
import { styles } from '../../styles/Mechanic/RequisitionStyles';
import useMaterialInOrOut, { MaterialDataType } from '../../hooks/useMaterialInOrOut';
import { updateCurrenttab2 } from '../../redux/slices/authSlice';
import { Role } from '../../services/api.enviornment';
import PMApprovalBadge from '../../components/PMapprovalBadge';
import commonHook from '../../hooks/commonHook';

const { width } = Dimensions.get('window');

const TABS = [ 'All', 'Submitted', 'Approved', 'Rejected'] as const;
type Tab = (typeof TABS)[number];

const MaterialScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useDispatch();

  const { role, activeTab2, selectedProjectNumber , projectList } = useSelector((state: RootState) => state.auth);
  const { materials, fetchMaterials, loading } = useMaterialInOrOut();

  const [filteredMaterials, setFilteredMaterials] = useState<any[]>([]);

  const isMaterialIn = route.name === 'MaterialIn';
  const dataType = isMaterialIn ? MaterialDataType.IN : MaterialDataType.OUT;

  // 🧠 Fetch materials on mount or route change
  useEffect(() => {
    fetchMaterials(dataType);
  }, [route?.name, activeTab2]);

  // 🧠 Filter materials when list or activeTab changes
useEffect(() => {
  const filtered = materials.filter(item => {
    const status = item.is_approve_pm?.toLowerCase();

    switch (activeTab2) {
      case 'Submitted':
        return status === 'pending';
      case 'Approved':
        return status === 'approved';
      case 'Rejected':
        return status === 'rejected';
      case 'All':
      default:
        return true;
    }
  });

  setFilteredMaterials(filtered);
}, [materials, activeTab2]);


//   const formatDate = (dateString: string) => {
//   const date = new Date(dateString);
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');
//   return `${day}-${month}-${year}`;
// };
const {formatDate} = commonHook();

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          <Text style={styles.date}>Date: {formatDate(item.date)}</Text>
          <Text style={styles.itemCount}>Type: {item.type}</Text>
          {isMaterialIn && item.challanNo && (
            <Text style={styles.itemCount}>Challan No: {item.challanNo}</Text>
          )}
          {item.partner && (
            <Text style={styles.itemCount}>Partner: {item?.partnerDetails?.partner_name}</Text>
          )}
          <Text style={styles.itemCount}>Total No. of Items: {item?.formItems?.length}</Text>

          <PMApprovalBadge
           is_approve_pm={item.is_approve_pm}/>
           
        </View>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => navigation.navigate('ViewItems', {
            document: item,
            ScreenType: route.name,
          })}
        >
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.topBar}>
        <View style={styles.rightIcons}>
                  <TouchableOpacity
           onPress={() =>
             role === Role.projectManager || role === Role.admin
               ? navigation.navigate('MainTabs')
               : navigation.openDrawer()
           }
         >
           {(role === Role.projectManager || role === Role.admin )? (
             <Ionicons name="arrow-back" size={30} color="black" />
           ) : (
             <Ionicons name="menu" size={30} color="black" />
           )}
         </TouchableOpacity>
          <View style={styles.LogoContainer}>
                <Image
                  source={require('../../assets/Home/SoftSkirl.png')}
                  style={styles.logo}
                />
                <Text style={styles.appName}>{selectedProjectNumber ? selectedProjectNumber : projectList?.[0]?.project_no}</Text>
              </View>
        </View>
        <View style={styles.rightIcons}>
          <TouchableOpacity style={styles.iconButton}>
           <Ionicons name="settings-outline" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
       <View style={styles.topBar2}>
         <Text style={styles.title}>
            {isMaterialIn ? 'Material In' : 'Material Out'}
          </Text>
       </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map(tab => (
          <TouchableOpacity key={tab} onPress={() => dispatch(updateCurrenttab2(tab))}>
            <Text style={[styles.tabText, activeTab2 === tab && styles.activeTab]}>
              {tab}
            </Text> 
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      {loading ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Loading...</Text>
      ) : filteredMaterials?.length > 0 ? (
        <FlatList
          data={filteredMaterials}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          refreshing={loading}
          onRefresh={() => fetchMaterials(dataType)}
          contentContainerStyle={{ paddingHorizontal: width * 0.04 }}
        />
      ) : (
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <Text style={{ fontSize: 16, color: '#888' }}>No data found.</Text>
        </View>
      )}

      {/* Floating Add Button */}
     {(role !== Role.projectManager && role !== Role.admin ) && (
  <TouchableOpacity
    style={styles.fab}
    onPress={() =>
      navigation.navigate(
        isMaterialIn ? 'CreateMaterialIn' : 'CreateMaterialOut'
      )
    }
  >
    <Text style={styles.fabIcon}>＋</Text>
  </TouchableOpacity>
)}

    </View>
  );
};

export default MaterialScreen;
