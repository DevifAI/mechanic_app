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
import { updateCurrenttab } from '../../redux/slices/authSlice';

const { width } = Dimensions.get('window');

const TABS = ['Submitted', 'Approvals', 'Issued', 'All'] as const;
type Tab = (typeof TABS)[number];

const MaterialScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useDispatch();

  const { role, activeTab, selectedProjectNumber , projectList } = useSelector((state: RootState) => state.auth);
  const { materials, fetchMaterials, loading } = useMaterialInOrOut();

  const [filteredMaterials, setFilteredMaterials] = useState<any[]>([]);

  const isMaterialIn = route.name === 'MaterialIn';
  const dataType = isMaterialIn ? MaterialDataType.IN : MaterialDataType.OUT;

  // 🧠 Fetch materials on mount or route change
  useEffect(() => {
    fetchMaterials(dataType);
  }, [route?.name, activeTab]);

  // 🧠 Filter materials when list or activeTab changes
  useEffect(() => {
    console.log(materials, activeTab, 'materials data');
    const filtered = materials.filter(item => {
      const { accountManagerApproval, projectManagerApproval } = item;

      switch (activeTab) {
        case 'Submitted':
          return accountManagerApproval === 'pending' && projectManagerApproval === 'pending';
        case 'Approvals':
          return accountManagerApproval === 'approved' && projectManagerApproval !== 'approved';
        case 'Issued':
          return accountManagerApproval === 'approved' && projectManagerApproval === 'approved';
        case 'All':
        default:
          return true;
      }
    });

    setFilteredMaterials(filtered);
  }, [materials, activeTab]);

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          <Text style={styles.date}>Date: {item.date}</Text>
          <Text style={styles.itemCount}>Type: {item.type}</Text>
          {isMaterialIn && item.challanNo && (
            <Text style={styles.itemCount}>Challan No: {item.challanNo}</Text>
          )}
          {item.partner && (
            <Text style={styles.itemCount}>Partner: {item.partner}</Text>
          )}
          <Text style={styles.itemCount}>Total No. of Items: {item?.items?.length}</Text>
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
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={30} color="black" />
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
          <TouchableOpacity key={tab} onPress={() => dispatch(updateCurrenttab(tab))}>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTab]}>
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
      {role !== 'accountManager' && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate(
            isMaterialIn ? 'CreateMaterialIn' : 'CreateMaterialOut'
          )}
        >
          <Text style={styles.fabIcon}>＋</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default MaterialScreen;
