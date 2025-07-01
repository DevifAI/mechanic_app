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
  ActivityIndicator,
  SafeAreaView,
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

const materialInTypeOptions = ['New', 'Transfer', 'Site Return'];
const materialOutTypeOptions = ['Rent', 'Site Return', 'Repair'];

const CreateEquipmentIn = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const isFocused = useIsFocused();

  const activetype =
    route.name === 'CreateEquipmentIn'
      ? materialInTypeOptions
      : materialOutTypeOptions;

  const [items, setItems] = useState<EquipmentInItem[]>([]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [type, setType] = useState('');
  const [partner, setPartner] = useState('');
  const [selectedPartnerId, setSelectedPartnerId] = useState('');
  const [filteredTypes, setFilteredTypes] = useState<string[]>(activetype);
  const [filteredPartners, setFilteredPartners] = useState<any[]>([]);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showPartnerDropdown, setShowPartnerDropdown] = useState(false);
  const [loader, setLoader] = useState(false)
  const {partners, getPartners} = useSuperadmin();

  const {createEquipment, loading} = useEquipmentInOrOut();

  const isEquipmentIn = route.name === 'CreateEquipmentIn';
  const {projectId , userId} = useSelector((state: RootState) => state.auth);

  // Storage keys for draft data
  const DRAFT_FORM_KEY = `equipmentFormDraft_${route.name}`;
  const DRAFT_ITEMS_KEY = `equipmentInItems`;

  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Save form data to AsyncStorage
  const saveDraftFormData = async (formData: any) => {
    try {
      await AsyncStorage.setItem(DRAFT_FORM_KEY, JSON.stringify(formData));
    } catch (error) {
      console.error('Error saving draft form data:', error);
    }
  };

  // Load form data from AsyncStorage
  const loadDraftFormData = async () => {
    try {
      const stored = await AsyncStorage.getItem(DRAFT_FORM_KEY);
      if (stored) {
        const formData = JSON.parse(stored);
        setType(formData.type || '');
        setPartner(formData.partner || '');
        setSelectedPartnerId(formData.selectedPartnerId || '');
        setDate(formData.date ? new Date(formData.date) : new Date());
      }
    } catch (error) {
      console.error('Error loading draft form data:', error);
    }
  };

  // Clear draft data
  const clearDraftData = async () => {
    try {
      await AsyncStorage.removeItem(DRAFT_FORM_KEY);
      await AsyncStorage.removeItem(DRAFT_ITEMS_KEY);
    } catch (error) {
      console.error('Error clearing draft data:', error);
    }
  };

  const handleTypeChange = (text: string) => {
    setType(text);
    setShowTypeDropdown(true);
    debouncedFilterTypes(text);
    
    // Save to draft
    saveDraftFormData({
      type: text,
      partner,
      selectedPartnerId,
      date: date.toISOString(),
    });
  };

  const handlePartnerChange = (text: string) => {
    setPartner(text);
    setShowPartnerDropdown(true);
    debouncedFilterPartners(text);
    
    // Save to draft
    saveDraftFormData({
      type,
      partner: text,
      selectedPartnerId,
      date: date.toISOString(),
    });
  };

  const filterTypes = (text: string) => {
    const filtered = activetype.filter(option =>
      option?.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredTypes(filtered);
  };

  const filterPartners = (text: string) => {
    console.log('Filtering partners with text:', text, partners);
    const filtered = partners?.filter(option =>
      option?.name?.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredPartners(filtered);
  };

  const debouncedFilterTypes = debounce(filterTypes, 300);
  const debouncedFilterPartners = debounce(filterPartners, 300);

  // Load draft data when component mounts
  useEffect(() => {
    const loadDraftData = async () => {
      await loadDraftFormData();
      
      // Load items
      try {
        const storedItems = await AsyncStorage.getItem(DRAFT_ITEMS_KEY);
        if (storedItems) {
          const parsedItems = JSON.parse(storedItems);
          setItems(parsedItems);
        }
      } catch (error) {
        console.error('Error loading draft items:', error);
      }
    };

    if (isFocused) {
      loadDraftData();
    }
  }, [isFocused]);

  useEffect(() => {
    const mergeItems = async () => {
      if (isFocused && route.params?.updatedItems) {
        const newItems = route.params.updatedItems;

        try {
          const stored = await AsyncStorage.getItem(DRAFT_ITEMS_KEY);
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
            DRAFT_ITEMS_KEY,
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
      
      // Save to draft
      saveDraftFormData({
        type,
        partner,
        selectedPartnerId,
        date: selectedDate.toISOString(),
      });
    }
  };

  const saveCallBack = async () => {
    try {
      console.log('Saving items:', items);

      // Clear all draft data after successful save
      await clearDraftData();

      setItems([]);
      setType('');
      setPartner('');
      setSelectedPartnerId('');

      navigation.navigate('MainTabs', {
        screen: isEquipmentIn ? 'EquipmentIn' : 'EquipmentOut',
      });
    } catch (err) {
      console.error('Error clearing AsyncStorage:', err);
    }
  };

  const getPartnerValue = (text: string) => {
    if (
      (isEquipmentIn && text === 'Site Return') ||
      (!isEquipmentIn && (text === 'Repair ' || text === 'Rent'))
    ) {
      return true;
    }
    return false;
  };

  const handleSave = async () => {
    try {
      setLoader(true)
      const payload = {
        formItems: items.map(item => ({
          equipment: item.id,
          qty: item.qty,
          uom: item.uomId,
          notes: item?.description,
        })),
        date: date.toISOString().split('T')[0],
        type,
        createdBy: userId,
        project_id: projectId,
        partner: getPartnerValue(type) ? selectedPartnerId : null,
        data_type: isEquipmentIn ? EquipmentDataType.IN : EquipmentDataType.OUT,
      };
      console.log('Saving items:', items);

      await createEquipment(payload, saveCallBack);
    } catch (err) {
      console.error('Error saving create equipment:', err);
    } finally {
      setLoader(false);
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
            const storedItems = await AsyncStorage.getItem(DRAFT_ITEMS_KEY);
            const parsedItems = storedItems ? JSON.parse(storedItems) : [];

            const updatedItems = parsedItems.filter(
              (item: any) => item.id !== id,
            );

            await AsyncStorage.setItem(
              DRAFT_ITEMS_KEY,
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

  useEffect(() => {
    const fetchPartners = async () => {
      await getPartners();
    };
    fetchPartners();
  }, []);

  console.log(route.name, 'route name');

  return (
     <SafeAreaView
                  style={{
                    flexGrow: 1,
                    paddingTop: 20,
                    paddingBottom: 40,
                    backgroundColor: '#fff',
                  }}>
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
            {loading ? (
                         <ActivityIndicator size="small" color="#fff" />
                       ) : (
                         <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Save</Text>
                       )}
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
    onFocus={() => {
      if (type.length === 0) {
         setFilteredTypes(activetype); // fallback to all types
      }
      setShowTypeDropdown(true);
      setShowPartnerDropdown(false); // close other dropdown
    }}
  />

  {showTypeDropdown && filteredTypes.length > 0 && (
    <FlatList
      data={filteredTypes}
      keyExtractor={item => item}
      style={[styles.dropdown, { maxHeight: 200 }]} // scrollable
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.dropdownItem}
          onPress={() => {
            setType(item);
            setShowTypeDropdown(false);
            setShowPartnerDropdown(false); // close partner dropdown

            // Save to draft
            saveDraftFormData({
              type: item,
              partner,
              selectedPartnerId,
              date: date.toISOString(),
            });

            console.log('Type changed:', item, getPartnerValue(item));
            if (getPartnerValue(item)) {
              setPartner('');
              setSelectedPartnerId('');
              setShowPartnerDropdown(true);
            }
          }}
        >
          <Text>{item}</Text>
        </TouchableOpacity>
      )}
    />
  )}
</View>

        {getPartnerValue(type) && (
          <View>
  <Text style={styles.label}>Partner</Text>
  <TextInput
    style={styles.input}
    placeholder="Start typing to select a Partner"
    placeholderTextColor="#A0A0A0"
    value={partner}
    onChangeText={handlePartnerChange}
    onFocus={() => {
      if (partner.length === 0) {
        setFilteredPartners(partners); // fallback to full list
      }
      setShowPartnerDropdown(true);
      setShowTypeDropdown(false); // close Type dropdown if open
    }}
  />
  {showPartnerDropdown && filteredPartners.length > 0 && (
    <FlatList
      data={filteredPartners}
      keyExtractor={(item) => item.id.toString()}
      style={[styles.dropdown, { maxHeight: 200 }]} // scrollable
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.dropdownItem}
          onPress={() => {
            setPartner(item.name);
            setSelectedPartnerId(item.id);
            setShowPartnerDropdown(false);
            setShowTypeDropdown(false); // close Type if open
            
            // Save to draft
            saveDraftFormData({
              type,
              partner: item.name,
              selectedPartnerId: item.id,
              date: date.toISOString(),
            });
          }}
        >
          <Text>{item.name}</Text>
        </TouchableOpacity>
      )}
    />
  )}
</View>
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            navigation.navigate('AddItem', {
              existingItems: items,
              targetScreen: route.name,
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
    </SafeAreaView>
  );
};

export default CreateEquipmentIn;