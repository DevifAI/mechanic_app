import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  FlatList,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  BackHandler
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { styles } from '../../styles/Mechanic/CreateRequisitionStyles';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import useDieselInvoice from '../../hooks/useDieselInvoice';

const CreateDieselInvoice = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const document = route.params?.document;
  const { projectId, userId } = useSelector((state: RootState) => state.auth);
  const { createDieselInvoiceById } = useDieselInvoice();

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [dieselInvoiceId, setDieselInvoiceId] = useState<string | null>(null);
  const storageKey = 'DieselInvoiceItems';
  const formStorageKey = 'DieselInvoiceFormData';

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('MainTabs', { screen: 'DieselInvoice' });
        return true;
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription?.remove();
    }, [])
  );

  useEffect(() => {
    if (route.params?.updatedItems) {
      console.log("route.params.updatedItems" , route.params.updatedItems)
      setItems(route.params.updatedItems);
      AsyncStorage.setItem(storageKey, JSON.stringify(route.params.updatedItems));
      navigation.setParams({ updatedItems: undefined });
    }
  }, [route.params?.updatedItems, navigation]);

  useEffect(() => {
  const loadInitialData = async () => {
    try {
      const storedFormData = await AsyncStorage.getItem(formStorageKey);
      const storedItems = await AsyncStorage.getItem(storageKey);

      if (document) {
        setDate(new Date(document.date || new Date()));
        setDieselInvoiceId(document?.id || null);
        
        console.log('Document items structure:', document.items);
        
        // Debug: Check each item structure
        document.items?.forEach((item : any, index : number) => {
          console.log(`Document item ${index}:`, item);
          console.log(`Document item ${index} consumableItem:`, item.consumableItem);
          console.log(`Document item ${index} consumableItem.id:`, item.consumableItem?.id);
        });
        
        const prefilledItems = document.items?.map((item: any) => {
          console.log("itemssssss" , document.items)
          const mappedItem = {
            id: item.id,
            item_id: item.consumableItem.id || '',
            name: item.consumableItem?.item_name || '',
            uom: item.unitOfMeasurement?.unit_code || '',
            uomId: item.unitOfMeasurement?.id || '',
            qty: item.quantity?.toString() || '',
            notes: item.description || '',
            unitRate: item.unitRate || '',
            totalValue: item.totalValue || '',
          };
          
          console.log('Mapped item:', mappedItem);
          return mappedItem;
        }) || [];

        console.log('Final prefilledItems:', prefilledItems);
        setItems(prefilledItems);

        const formData = {
          date: new Date(document.date || new Date()).toISOString(),
          dieselInvoiceId: document?.id || null,
          isFromDocument: true,
        };
        await AsyncStorage.setItem(formStorageKey, JSON.stringify(formData));
        await AsyncStorage.setItem(storageKey, JSON.stringify(prefilledItems));
      } else {
        if (storedFormData) {
          const data = JSON.parse(storedFormData);
          if (data.date) setDate(new Date(data.date));
          setDieselInvoiceId(data.dieselInvoiceId || null);
        }

        if (storedItems) {
          const parsedItems = JSON.parse(storedItems);
          console.log('Loaded items from storage:', parsedItems);
          console.log("parsed dtaa ", parsedItems)
          setItems(parsedItems);
        }
      }
    } catch (e) {
      console.error('Failed to load data:', e);
    }
  };

  if (!route.params?.updatedItems) {
    loadInitialData();
  }
}, [document, route.params?.updatedItems]);

  useEffect(() => {
    const saveFormData = async () => {
      try {
        const formData = {
          date: date.toISOString(),
          dieselInvoiceId,
          isFromDocument: !!document,
        };
        await AsyncStorage.setItem(formStorageKey, JSON.stringify(formData));
      } catch (e) {
        console.error('Failed to save form data:', e);
      }
    };

    const timer = setTimeout(saveFormData, 500);
    return () => clearTimeout(timer);
  }, [date, dieselInvoiceId, document]);

  useEffect(() => {
    const saveItems = async () => {
      try {
        await AsyncStorage.setItem(storageKey, JSON.stringify(items));
      } catch (e) {
        console.error('Failed to save items:', e);
      }
    };

    if (items.length > 0) {
      const timer = setTimeout(saveItems, 500);
      return () => clearTimeout(timer);
    }
  }, [items]);

  const onChangeDate = useCallback((_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  }, []);

  const generatePayload = useCallback((status: 'draft' | 'invoiced' | 'rejected') => {

    console.log("items,,,,,,,,,,,,,,,,," , items)
    return {
      project_id: projectId,
      date: date.toISOString().split('T')[0],
      dieselInvoiceId,
      isInvoiced: status,
      formItems: items.map(item => ({
        item: item.itemId,
        qty: parseFloat(item.qty || '0'),
        uom: item.uomId,
        unit_rate: parseFloat(item.unitRate || '0'),
        total_value: parseFloat(item.totalValue || '0'),
        notes: item.description || ''
      }))
    };
  }, [projectId, date, userId, dieselInvoiceId, items]);

  const handleSave = useCallback(async (actionType: 'draft' | 'invoiced' | 'rejected') => {
    try {
      setLoadingMessage(
        actionType === 'draft' ? 'Saving as draft...' :
        actionType === 'rejected' ? 'Rejecting...' :
        'Creating invoice...'
      );
      setLoading(true);
      setShowDropdown(false);

      if (actionType === 'invoiced' && items.length === 0) {
        Alert.alert('Validation Error', 'Please add at least one item.');
        return;
      }

      const payload = generatePayload(actionType);
        console.log(`${actionType} Payload:`, JSON.stringify(payload, null, 2));

      if (actionType === 'draft') {
        await AsyncStorage.setItem('DieselInvoiceDraft', JSON.stringify(payload));
        Alert.alert('Success', 'Diesel Invoice saved as draft successfully!');
      } else if (actionType === 'rejected') {
        await AsyncStorage.setItem('DieselInvoiceRejected', JSON.stringify(payload));
        Alert.alert('Success', 'Diesel Invoice rejected successfully!');
        navigation.navigate('MainTabs', { screen: 'DieselInvoice' });
        return;
      } else {
        await createDieselInvoiceById(payload, async () => {
          await AsyncStorage.removeItem(storageKey);
          await AsyncStorage.removeItem(formStorageKey);
          await AsyncStorage.removeItem('DieselInvoiceDraft');
          setItems([]);
          navigation.navigate('MainTabs', { screen: 'DieselInvoice' });
        });
        return;
      }
    } catch (error) {
      console.error(`Error with ${actionType}:`, error);
      Alert.alert('Error', `Failed to ${actionType}.`);
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  }, [generatePayload, createDieselInvoiceById, navigation, items.length]);

  const handleReject = useCallback(() => {
    Alert.alert(
      'Reject Diesel Invoice',
      'Are you sure you want to reject this diesel invoice?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reject', style: 'destructive', onPress: () => handleSave('rejected') },
      ]
    );
  }, [handleSave]);

  const handleClearData = useCallback(() => {
    Alert.alert(
      'Clear Data',
      'Are you sure you want to clear all data? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(storageKey);
              await AsyncStorage.removeItem(formStorageKey);
              await AsyncStorage.removeItem('DieselInvoiceDraft');
              setDate(new Date());
              setItems([]);
              setDieselInvoiceId(null);
              setShowDropdown(false);
              Alert.alert('Success', 'All data cleared successfully.');
            } catch (e) {
              console.error('Failed to clear data:', e);
              Alert.alert('Error', 'Failed to clear data.');
            }
          },
        },
      ]
    );
  }, []);

  const confirmDelete = useCallback((id: string) => {
    Alert.alert('Delete Item', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updatedItems = items.filter((item: any) => item.id !== id);
          setItems(updatedItems);
          await AsyncStorage.setItem(storageKey, JSON.stringify(updatedItems));
        },
      },
    ]);
  }, [items]);

  const renderDropdownItem = (
    label: string,
    onPress: () => void,
    iconName: string
  ) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fff',
      }}
    >
      <Icon name={iconName} size={18} color="#333" style={{ marginRight: 10 }} />
      <Text style={{ fontSize: 16, color: '#333' }}>{label}</Text>
    </TouchableOpacity>
  );

  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('AddItem', {
            mode: 'edit',
            itemToEdit: item,
            index,
            existingItems: items,
            targetScreen: route.name,
          })
        }
        style={styles.card}
      >
        <View style={styles.cardContent}>
          <TouchableOpacity onPress={() => confirmDelete(item.id)} style={styles.deleteIcon}>
            <Icon name="close-circle-outline" size={24} color="#d11a2a" />
          </TouchableOpacity>

          <View style={styles.itemInfo}>
            <View style={styles.leftSection}>
              <Text style={styles.itemName}>{item.name || ''}</Text>
              <Text style={styles.itemSub}>UOM: {item.uom || ''}</Text>
              {item.unitRate && <Text style={styles.itemSub}>Unit Price: {item.unitRate}</Text>}
              {item.totalValue && <Text style={styles.itemSub}>Total: {item.totalValue}</Text>}
            </View>
            <View style={styles.rightSection}>
              <Text style={styles.qtyText}>Qty: {item.quantity || ''}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [items, navigation, route.name]
  );

  // Add floating action button for adding items
  const renderAddButton = () => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('AddItem', {
          mode: 'add',
          existingItems: items,
          targetScreen: route.name,
        })
      }
      style={{
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
      }}
    >
      <Icon name="add" size={30} color="#fff" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flexGrow: 1, paddingTop: 20, paddingBottom: 40, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.navigate('DieselInvoice')}
              style={{ padding: 10, marginLeft: -10 }}
            >
              <Icon name="arrow-back" size={28} color="#000" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Create Diesel Invoice</Text>

            <View style={{ position: 'relative' }}>
              <TouchableOpacity
                onPress={() => setShowDropdown(!showDropdown)}
                style={{
                  backgroundColor: '#007AFF',
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 6,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="ellipsis-vertical" size={20} color="#fff" />
              </TouchableOpacity>

              {showDropdown && (
                <View
                  style={{
                    position: 'absolute',
                    top: 45,
                    right: 0,
                    backgroundColor: '#fff',
                    borderRadius: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    minWidth: 180,
                    zIndex: 1000,
                  }}
                >
                  {renderDropdownItem('Save as Draft', () => handleSave('draft'), 'document-outline')}
                  {renderDropdownItem('Save as Invoice', () => handleSave('invoiced'), 'receipt-outline')}
                  {/* {renderDropdownItem('Reject', handleReject, 'close-circle-outline')} */}
                  {renderDropdownItem('Clear Data', handleClearData, 'trash-outline')}
                </View>
              )}
            </View>
          </View>

          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={{
              borderBottomWidth: 1,
              borderBottomColor: '#ccc',
              paddingVertical: 6,
              marginBottom: 24,
            }}
          >
            <Text style={{ color: '#007AFF', fontWeight: 'bold', marginBottom: 6, fontSize: 16 }}>
              Date <Text style={{ color: 'red', fontSize: 16 }}>*</Text>
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, color: '#000' }}>
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

          {items.length > 0 && (
            <View style={styles.headerRow}>
              <Text style={styles.headerText}>Items</Text>
            </View>
          )}

          {items.length === 0 && (
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Text style={{ fontSize: 16, color: '#666', marginBottom: 20 }}>
                No items added yet
              </Text>
            </View>
          )}

          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ marginTop: 10, paddingBottom: 10 }}
          />
        </ScrollView>

        {/* Loading Overlay */}
        {loading && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 9999,
            }}
          >
            <View
              style={{
                backgroundColor: '#fff',
                padding: 30,
                borderRadius: 10,
                alignItems: 'center',
                minWidth: 200,
              }}
            >
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={{ marginTop: 15, fontSize: 16, color: '#333' }}>
                {loadingMessage}
              </Text>
            </View>
          </View>
        )}

        {/* Add Item Button */}
        {renderAddButton()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateDieselInvoice;