import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import {useNavigation, useRoute, useIsFocused} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {styles} from '../../styles/Mechanic/CreateRequisitionStyles';
import useSuperadmin from '../../hooks/useSuperadmin';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import useEquipmentInOrOut, {
  EquipmentDataType,
} from '../../hooks/useEquipmentInOrout';

type EquipmentInItem = {
  description: any;
  id: string;
  uom: string;
  uomId: string;
  name: string;
  qty: number;
};

const typeOptions = ['New', 'Repair', 'Transfer', 'Site Return'];
// const partnerOptions = ['Partner A', 'Partner B', 'Partner C'];

const CreateEquipmentIn = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const isFocused = useIsFocused();

  const [items, setItems] = useState<EquipmentInItem[]>([]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [type, setType] = useState('');
  const [partner, setPartner] = useState('');
  const [selectedPartnerId, setSelectedPartnerId] = useState('');
  const [filteredTypes, setFilteredTypes] = useState<string[]>(typeOptions);
  const [filteredPartners, setFilteredPartners] = useState<any[]>([]);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showPartnerDropdown, setShowPartnerDropdown] = useState(false);

  const {partners, getPartners} = useSuperadmin();

  const {createEquipment, loading} = useEquipmentInOrOut();

  const isEquipmentIn = route.name === 'CreateEquipmentIn';
  const {projectId} = useSelector((state: RootState) => state.auth);

  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const handleTypeChange = (text: string) => {
    setType(text);
    setShowTypeDropdown(true);
    debouncedFilterTypes(text);
  };

  const handlePartnerChange = (text: string) => {
    setPartner(text);
    setShowPartnerDropdown(true);
    debouncedFilterPartners(text);
  };

  const filterTypes = (text: string) => {
    const filtered = typeOptions.filter(option =>
      option.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredTypes(filtered);
  };

  const filterPartners = (text: string) => {
    const filtered = partners.filter(option =>
      option.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredPartners(filtered);
  };

  const debouncedFilterTypes = debounce(filterTypes, 300);
  const debouncedFilterPartners = debounce(filterPartners, 300);

  useEffect(() => {
    const mergeItems = async () => {
      if (isFocused && route.params?.updatedItems) {
        const newItems = route.params.updatedItems;

        try {
          const stored = await AsyncStorage.getItem('equipmentInItems');
          const parsedStored: EquipmentInItem[] = stored
            ? JSON.parse(stored)
            : [];

          const merged = [...parsedStored];

          newItems.forEach((newItem: EquipmentInItem) => {
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
            'equipmentInItems',
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
  const saveCallBack = async () => {
    try {
      console.log('Saving items:', items);

      await AsyncStorage.removeItem('equipmentInItems');

      setItems([]);

      navigation.navigate('MainTabs', {
        screen: 'EquipmentIn',
      });
    } catch (err) {
      console.error('Error clearing AsyncStorage:', err);
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        formItems: items.map(item => ({
          item: item.id,
          qty: item.qty,
          uom: item.uomId,
          notes: item?.description,
        })),
        date: date.toISOString().split('T')[0],
        type,
        project_id: projectId,
        partner: isEquipmentIn || type === 'Repair' ? selectedPartnerId : '',

        data_type: isEquipmentIn ? EquipmentDataType.IN : EquipmentDataType.OUT,
      };
      console.log('Saving items:', items);

      await createEquipment(payload, saveCallBack);
    } catch (err) {
      console.error('Error saving create equipment:', err);
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
            const storedItems = await AsyncStorage.getItem('equipmentInItems');
            const parsedItems = storedItems ? JSON.parse(storedItems) : [];

            const updatedItems = parsedItems.filter(
              (item: any) => item.id !== id,
            );

            await AsyncStorage.setItem(
              'equipmentInItems',
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
    item: EquipmentInItem;
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
              targetScreen: 'CreateEquipment',
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

  useEffect(() => {
    getPartners();
  }, []);

  console.log(route.name, 'route name');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{flex: 1}}>
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{paddingBottom: 40}}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('MainTabs', {
                screen: 'EquipmentIn',
              })
            }
            style={{
              padding: 10,
              marginLeft: -10,
            }}>
            <Icon name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            {' '}
            {route.name === 'CreateEquipmentIn'
              ? 'Create Equipment In'
              : 'Create Equipment Out'}
          </Text>
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

        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: '#ccc',
            paddingVertical: 6,
            marginBottom: 8,
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

        <View>
          <Text style={styles.label}>Type</Text>
          <TextInput
            style={styles.input}
            placeholder="Start typing to select a Type"
            placeholderTextColor="#A0A0A0"
            value={type}
            onChangeText={handleTypeChange}
          />
          {showTypeDropdown && (
            <FlatList
              data={filteredTypes}
              keyExtractor={item => item}
              style={styles.dropdown}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setType(item);
                    setShowTypeDropdown(false);
                  }}>
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>

        <View>
          <Text style={styles.label}>Partner</Text>
          <TextInput
            style={styles.input}
            placeholder="Start typing to select a Partner"
            placeholderTextColor="#A0A0A0"
            value={partner}
            onChangeText={handlePartnerChange}
          />
          {showPartnerDropdown && (
            <FlatList
              data={filteredPartners}
              keyExtractor={item => item}
              style={styles.dropdown}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setPartner(item);
                    setPartner(item.name);
                    setSelectedPartnerId(item.id);
                    setShowPartnerDropdown(false);
                  }}>
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            navigation.navigate('AddItem', {
              existingItems: items,
              targetScreen: 'CreateEquipmentIn',
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

export default CreateEquipmentIn;
