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
import {styles} from '../../styles/Mechanic/RequisitionStyles'; // Update path if needed
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useMaintanance from '../../hooks/useMaintanance';
import {Role} from '../../services/api.enviornment';

import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';

type LogType = 'Submitted' | 'Approvals' | 'Issued' | 'All';

type Item = {
  item: string;
  quantity: number;
  uom: string;
  notes: string;
  equipment: string;
};

type LogItem = {
  id: string;
  mantainanceLogNo: string;
  note: string;
  equipment: string;
  nextDate: string;
  date: string;
  actionPlan: string;
  items: Item[];
  mechanicInchargeApproval: boolean;
  siteInchargeApproval: boolean;
  projectManagerApproval: boolean;
};

const {width} = Dimensions.get('window');

// Sample logs

const TABS: LogType[] = ['Submitted', 'Approvals', 'Issued', 'All'];

const Log = () => {
  const [activeTab, setActiveTab] = useState<LogType>('Submitted');
  const navigation = useNavigation<any>();

  const {loading, logItems, getAllMaintananceLogByUserId} = useMaintanance();

  const {role} = useSelector((state: RootState) => state.auth);

  const filteredLogs = logItems.filter(item => {
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

  const renderItem = ({item}: {item: any}) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          {item?.mechanicName && (
            <Text style={styles.date}>Mechanic name: {item.mechanicName}</Text>
          )}
          <Text style={styles.date}>Date: {item.date}</Text>
          <Text style={styles.itemCount}>
            Maintainance Log No: {item.mantainanceLogNo}
          </Text>
          <Text style={styles.itemCount}>Equipment Name: {item.equipment}</Text>
          <Text style={styles.itemCount}>
            Total No. of Items: {item.items.length}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() =>
            navigation.navigate('ViewItems', {document: item, ScrenType: 'log'})
          }>
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  useEffect(() => {
    getAllMaintananceLogByUserId();
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
          <Text style={styles.title}>Maintainance Log</Text>
        </View>
        <View style={styles.rightIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => console.log('Support pressed')}>
            <MaterialIcons name="support-agent" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => console.log('Notifications pressed')}>
            <Icon name="notifications-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map(tab => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
            <Text
              style={[styles.tabText, activeTab === tab && styles.activeTab]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}

      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={filteredLogs}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{paddingHorizontal: width * 0.04}}
        />
      )}

      {/* Floating Add Button */}
      {role === Role.mechanic && (
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateLog')}
          style={styles.fab}>
          <Text style={styles.fabIcon}>＋</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Log;
