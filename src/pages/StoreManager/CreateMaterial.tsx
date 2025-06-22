import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, KeyboardAvoidingView,
  ScrollView, TextInput, Alert, Platform, ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../../styles/Mechanic/CreateRequisitionStyles';
import useMaterialInOrOut, { MaterialDataType } from '../../hooks/useMaterialInOrOut';
import useSuperadmin from '../../hooks/useSuperadmin';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const typeOptions1 = ['New', 'Repair', 'Transfer', 'Site Return'];
const typeOptions2 = ['Consumption', 'Repair', 'Rent', 'Site Return'];

const CreateMaterial = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const isFocused = useIsFocused();
  const isMaterialIn = route.name === 'CreateMaterialIn';
  const { orgId, userId, projectId } = useSelector((state: RootState) => state.auth);

  const { createMaterial } = useMaterialInOrOut();
  const { partners, getPartners } = useSuperadmin();

  const typeOptions = isMaterialIn ? typeOptions1 : typeOptions2;

  const [items, setItems] = useState<any[]>([]);
  const [date, setDate] = useState(new Date());
  const [challanNo, setChallanNo] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [type, setType] = useState('');
  const [partner, setPartner] = useState('');
  const [selectedPartnerId, setSelectedPartnerId] = useState('');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showPartnerDropdown, setShowPartnerDropdown] = useState(false);
  const [filteredTypes, setFilteredTypes] = useState<string[]>(typeOptions);
  const [filteredPartners, setFilteredPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const isInitialized = useRef(false);

  const storageKey = isMaterialIn ? 'MaterialInItems' : 'items';
  const formStorageKey = `${storageKey}-form`;

  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const filterTypes = (text: string) => {
    setFilteredTypes(typeOptions.filter(opt => opt.toLowerCase().includes(text.toLowerCase())));
  };

  const filterPartners = (text: string) => {
    const filtered = partners.filter(p =>
      p.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredPartners(filtered);
  };

  const debouncedFilterTypes = debounce(filterTypes, 300);
  const debouncedFilterPartners = debounce(filterPartners, 300);

  const handleTypeChange = (text: string) => {
    setType(text);
    if (!showTypeDropdown) setShowTypeDropdown(true);
    debouncedFilterTypes(text);
  };

  const handlePartnerChange = (text: string) => {
    setPartner(text);
    if (!showPartnerDropdown) setShowPartnerDropdown(true);
    debouncedFilterPartners(text);
  };

  const initializeMaterialForm = async () => {
    try {
      await getPartners();
      setFilteredPartners(partners);
    } catch (e) {
      console.error('Error getting partners:', e);
    }

    try {
      const stored = await AsyncStorage.getItem(storageKey);
      if (stored) {
        const parsedItems = JSON.parse(stored);
        setItems(parsedItems);
      }

      const storedForm = await AsyncStorage.getItem(formStorageKey);
      if (storedForm) {
        const { type, partner, selectedPartnerId, challanNo } = JSON.parse(storedForm);
        if (type) setType(type);
        if (partner) setPartner(partner);
        if (selectedPartnerId) setSelectedPartnerId(selectedPartnerId);
        if (challanNo) setChallanNo(challanNo);
      }
    } catch (error) {
      console.error('Error loading items or form:', error);
    }

    isInitialized.current = true;
  };

  useEffect(() => {
    if (!isInitialized.current) {
      initializeMaterialForm();
    }
  }, []);

  useEffect(() => {
    const mergeItems = async () => {
      if (isFocused && route.params?.updatedItems) {
        const newItems = route.params.updatedItems;
        try {
          const stored = await AsyncStorage.getItem(storageKey);
          const parsedStored: any[] = stored ? JSON.parse(stored) : [];
          const merged = [...parsedStored];

          newItems.forEach((newItem: any) => {
            const existingIndex = merged.findIndex(item => item.id === newItem.id);
            if (existingIndex !== -1) merged[existingIndex] = newItem;
            else merged.push(newItem);
          });

          setItems(merged);
          await AsyncStorage.setItem(storageKey, JSON.stringify(merged));
          navigation.setParams({ updatedItems: undefined });
        } catch (err) {
          console.error('Failed to merge items:', err);
        }
      }
    };
    mergeItems();
  }, [isFocused, route.params?.updatedItems]);

  useEffect(() => {
    const saveForm = async () => {
      const data = { type, partner, selectedPartnerId, challanNo };
      await AsyncStorage.setItem(formStorageKey, JSON.stringify(data));
    };
    saveForm();
  }, [type, partner, selectedPartnerId, challanNo]);

  useEffect(() => {
    setFilteredTypes(typeOptions);
  }, [typeOptions]);

  const onChangeDate = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleSave = async () => {
    setLoading(true);

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
      partner: (isMaterialIn && (type === 'Repair' || type === 'Site Return')) ||
        (!isMaterialIn && (type === 'Repair' || type === 'Rent')) ? selectedPartnerId : null,
      challan_no: isMaterialIn ? challanNo : '',
      data_type: isMaterialIn ? MaterialDataType.IN : MaterialDataType.OUT,
    };

    await createMaterial(payload, async () => {
      await AsyncStorage.removeItem(storageKey);
      await AsyncStorage.removeItem(formStorageKey);
      setItems([]);
      setLoading(false);
      navigation.navigate('MainTabs', {
        screen: isMaterialIn ? 'MaterialIn' : 'MaterialOut',
      });
    });
  };

  const confirmDelete = (id: string) => {
    Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            const stored = await AsyncStorage.getItem(storageKey);
            const parsed = stored ? JSON.parse(stored) : [];
            const updated = parsed.filter((item: any) => item.id !== id);
            await AsyncStorage.setItem(storageKey, JSON.stringify(updated));
            setItems(updated);
          } catch (err) {
            console.error('Error deleting item:', err);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <TouchableOpacity onPress={() => confirmDelete(item.id)} style={styles.deleteIcon}>
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
              targetScreen: route.name,
            })
          }
        >
          <View style={styles.leftSection}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.uomText}>UOM: {item.uom}</Text>
            <Text style={styles.itemSub}>Notes: {item.description}</Text>
          </View>
          <View style={styles.rightSection}>
            <Text style={styles.qtyText}>Quantity: {item.qty}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
      <SafeAreaView
              style={{
                flexGrow: 1,
                paddingTop: 20,
                paddingBottom: 40,
                backgroundColor: '#fff',
              }}>
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate('MainTabs', { screen: isMaterialIn ? 'MaterialIn' : 'MaterialOut' })}
            style={{ padding: 10, marginLeft: -10 }}
          >
            <Icon name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create {isMaterialIn ? 'Material In' : 'Material Out'}</Text>
          <TouchableOpacity
            onPress={handleSave}
            disabled={loading}
            style={{
              backgroundColor: loading ? '#A0A0A0' : '#007AFF',
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 6,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 80,
            }}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Save</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Date */}
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', paddingVertical: 6, marginBottom: 8 }}>
          <Text style={{ color: '#007AFF', fontWeight: 'bold', marginBottom: 6, fontSize: 16 }}>
            Date <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, color: '#000' }}>{date.toLocaleDateString('en-GB')}</Text>
            <Icon name="calendar-outline" size={22} color="#000" />
          </View>
        </TouchableOpacity>
        {showDatePicker && <DateTimePicker value={date} mode="date" display="default" onChange={onChangeDate} maximumDate={new Date()} />}

        {/* Type */}
        <View>
          <Text style={styles.label}>Type</Text>
          <TextInput style={styles.input} placeholder="Start typing to select a Type" placeholderTextColor="#A0A0A0" value={type} onChangeText={handleTypeChange} />
          {showTypeDropdown && (
            <FlatList data={filteredTypes} keyExtractor={(item) => item} style={styles.dropdown} renderItem={({ item }) => (
              <TouchableOpacity style={styles.dropdownItem} onPress={() => { setType(item); setShowTypeDropdown(false); }}>
                <Text>{item}</Text>
              </TouchableOpacity>
            )} />
          )}
        </View>

        {/* Partner */}
        {(isMaterialIn && (type === 'Repair' || type === 'Site Return')) ||
          (!isMaterialIn && (type === 'Repair' || type === 'Rent')) ? (
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
                keyExtractor={(item) => item.id.toString()}
                style={styles.dropdown}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setPartner(item.name);
                      setSelectedPartnerId(item.id);
                      setShowPartnerDropdown(false);
                    }}
                  >
                    <Text>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        ) : null}

        {/* Challan No */}
        {isMaterialIn && (
          <View>
            <Text style={styles.label}>Challan No.</Text>
            <TextInput placeholder="Enter Challan No" placeholderTextColor="#A0A0A0" style={styles.input} value={challanNo} onChangeText={setChallanNo} />
          </View>
        )}

        {/* Add Items */}
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddItem', { existingItems: items, targetScreen: route.name })}>
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
          contentContainerStyle={{ marginTop: 10, paddingBottom: 10 }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateMaterial;
