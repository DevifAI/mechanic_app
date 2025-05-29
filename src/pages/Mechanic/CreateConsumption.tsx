import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {useNavigation, useRoute, useIsFocused} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useConsumption from '../../hooks/useConsumption';
import {RootState} from '../../redux/store';
import {useSelector} from 'react-redux';

type ConsumptionItem = {
  description: any;
  id: string;
  uom: string;
  uomId: string;
  name: string;
  qty: number;
  equipmentId?: string;
  equipmentName?: string;
};

const CreateConsumption = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const isFocused = useIsFocused();

  const {createConsumption} = useConsumption();

  const {orgId, userId} = useSelector((state: RootState) => state.auth);

  const [items, setItems] = useState<ConsumptionItem[]>([]);
  const [items2, setItems2] = useState<ConsumptionItem[]>([]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const mergeItems = async () => {
      if (isFocused && route.params?.updatedItems) {
        const newItems = route.params.updatedItems;

        try {
          const stored = await AsyncStorage.getItem('ConsumptionItems');
          const parsedStored: ConsumptionItem[] = stored
            ? JSON.parse(stored)
            : [];

          const merged = [...parsedStored];

          newItems.forEach((newItem: ConsumptionItem) => {
            const existingIndex = merged.findIndex(
              item => item.id === newItem.id,
            );

            if (existingIndex !== -1) {
              merged[existingIndex] = newItem;
            } else {
              merged.push(newItem);
            }
          });

          setItems(merged);
          await AsyncStorage.setItem(
            'ConsumptionItems',
            JSON.stringify(merged),
          );

          navigation.setParams({updatedItems: undefined});
        } catch (err) {
          console.error('Failed to merge items:', err);
        }
      }
    };

    mergeItems();
  }, [isFocused, route.params?.updatedItems]);

  const onChangeDate = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSave = async () => {
    const stored = await AsyncStorage.getItem('ConsumptionItems');
    const parsedStored: any[] = stored ? JSON.parse(stored) : [];
    if (parsedStored?.length === 0) return;
    const payload = {
      date: date.toISOString().split('T')[0],
      items: parsedStored.map(item => ({
        equipment: item.equipment,
        item: item.id,
        quantity: item.qty,
        uom_id: item.uomId,
        notes: item?.description,

        reading_meter_uom: item?.readingMeterUom || null,
        reading_meter_number: item?.readingMeterNo || null,
      })),
      createdBy: userId,
      // is_approve_mic: false,
      // is_approve_sic: false,
      // is_approve_pm: false,
      org_id: orgId,
    };
    createConsumption(payload, createConsumptionSuccessCallBack);
  };

  const createConsumptionSuccessCallBack = async () => {
    try {
      await AsyncStorage.removeItem('ConsumptionItems');
      setItems([]);
      navigation.navigate('MainTabs', {
        screen: 'Consumption',
      });
    } catch (err) {
      console.error('Error clearing AsyncStorage:', err);
    }
  };

  const confirmDelete = (id: string) => {
    Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const storedItems = await AsyncStorage.getItem('ConsumptionItems');
            const parsedItems = storedItems ? JSON.parse(storedItems) : [];
            const updatedItems = parsedItems.filter(
              (item: any) => item.id !== id,
            );
            await AsyncStorage.setItem(
              'ConsumptionItems',
              JSON.stringify(updatedItems),
            );
            setItems(updatedItems);
          } catch (error) {
            console.error('Error deleting item:', error);
          }
        },
      },
    ]);
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: ConsumptionItem;
    index: number;
  }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <TouchableOpacity
          onPress={() => confirmDelete(item.id)}
          style={styles.deleteIcon}>
          <Icon name="close-circle-outline" size={24} color="#d11a2a" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.itemInfo}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('AddItem', {
              item,
              index,
              existingItems: items,
              targetScreen: 'CreateConsumption',
            })
          }>
          <View style={styles.leftSection}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemSub}>UOM ID: {item.uomId}</Text>
          </View>

          <View style={styles.rightSection}>
            <Text style={styles.qtyText}>Quantity: {item.qty}</Text>
            <Text style={styles.uomText}>UOM: {item.uom}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{flex: 1}}>
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{paddingBottom: 40}}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('MainTabs', {screen: 'Consumption'})
            }
            style={{padding: 10, marginLeft: -10}}>
            <Icon name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Create Consumption</Text>

          <TouchableOpacity
            onPress={handleSave}
            style={{
              backgroundColor: '#007AFF',
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 6,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{color: 'white', fontSize: 16, fontWeight: '600'}}>
              Save
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date Picker */}
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: '#ccc',
            paddingVertical: 6,
            marginBottom: 24,
          }}>
          <Text
            style={{
              color: '#007AFF',
              fontWeight: 'bold',
              marginBottom: 6,
              fontSize: 16,
            }}>
            Date <Text style={{color: 'red', fontSize: 16}}>*</Text>
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 16, color: '#000'}}>
              {date.toLocaleDateString('en-GB')}
            </Text>
            <Icon name="calendar-outline" size={22} color="#000" />
          </View>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChangeDate}
            maximumDate={new Date()}
          />
        )}

        {/* Add Items Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            navigation.navigate('AddItem', {
              existingItems: items,
              targetScreen: 'CreateConsumption',
            })
          }>
          <Icon name="add-circle-outline" size={24} color="#1271EE" />
          <Text style={styles.addButtonText}>Add Items</Text>
        </TouchableOpacity>

        {items.length > 0 && (
          <View style={styles.headerRow}>
            <Text style={styles.headerText}>Added Items</Text>
          </View>
        )}

        {/* Item List */}
        <FlatList
          data={items}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{marginTop: 10, paddingBottom: 10}}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateConsumption;

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.05,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: width * 0.1,
    paddingBottom: width * 0.08,
  },
  headerTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  addButton: {
    borderWidth: 1,
    borderColor: '#1271EE',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  addButtonText: {
    color: '#1271EE',
    fontWeight: '600',
    fontSize: 16,
  },
  headerRow: {
    flexDirection: 'row',
    paddingBottom: 10,
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    padding: 12,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteIcon: {
    marginRight: 10,
  },
  itemInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  leftSection: {
    flexDirection: 'column',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemSub: {
    fontSize: 14,
    color: '#555',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  qtyText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  uomText: {
    fontSize: 14,
    color: '#666',
  },
});
