import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, TextInput,
  Platform, KeyboardAvoidingView, FlatList, Alert, SafeAreaView,
  ActivityIndicator, BackHandler
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused, useRoute, useFocusEffect } from '@react-navigation/native';
import { styles } from '../../styles/Mechanic/CreateRequisitionStyles';
import useMaterialBill from '../../hooks/useMaterialBill';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

type ActionType = 'draft' | 'invoiced' | 'rejected';

const CreateMaterialBill = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const route = useRoute<any>();
  const document = route.params?.document;
  const { projectId, userId } = useSelector((state: RootState) => state.auth);

  const { createMaterialBillById } = useMaterialBill();

  // Form state
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [invoiceNo, setInvoiceNo] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [basicValue, setBasicValue] = useState('');
  const [tax, setTax] = useState('');
  const [total, setTotal] = useState('');
  const [items, setItems] = useState<any[]>([]);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Data state
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [materialTransactionId, setMaterialTransactionId] = useState<string | null>(null);

  const storageKey = 'MaterialBillItems';
  const formStorageKey = 'MaterialBillFormData';

  // Handle hardware back button
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigateToMaterialBill();
        return true; // Prevent default behavior
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription?.remove();
    }, [])
  );

  // Navigation helper
  const navigateToMaterialBill = useCallback(() => {
    navigation.navigate('MainTabs', { screen: 'MaterialBill' });
  }, [navigation]);

  // Calculate total when basic value or tax changes
  useEffect(() => {
    setTotal(((parseFloat(basicValue) || 0) + (parseFloat(tax) || 0)).toString());
  }, [basicValue, tax]);

  // Handle updated items from AddItem screen
  useEffect(() => {
    if (route.params?.updatedItems) {
      setItems(route.params.updatedItems);
      AsyncStorage.setItem(storageKey, JSON.stringify(route.params.updatedItems));
      navigation.setParams({ updatedItems: undefined });
    }
  }, [route.params?.updatedItems, navigation]);

  // Load initial data on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const storedFormData = await AsyncStorage.getItem(formStorageKey);
        const storedItems = await AsyncStorage.getItem(storageKey);
        
        if (document) {
          // Load document data
          setDate(new Date(document.date || new Date()));
          setPartnerName(document?.partnerDetails?.partner_name || '');
          setInvoiceNo(document.challan_no || '');
          setBasicValue(document.inv_basic_value || '');
          setTax(document.inv_tax || '');
          setTotal(document.total_invoice_value || '');
          setMaterialTransactionId(document?.id || null);
          setSelectedPartnerId(document?.partner || null);

          const prefilledItems = document.formItems?.map((item: any) => ({
            id: item.item,
            name: item.consumableItem?.item_name || '',
            uom: item.unitOfMeasure?.unit_name || '',
            uomId: item.unitOfMeasure?.id || '',
            qty: item.qty?.toString() || '',
            notes: item.notes || '',
            unitRate: item.unitRate || '',
            totalValue: item.totalValue || '',
          })) || [];

          setItems(prefilledItems);
          
          // Save document data as draft
          const formData = {
            date: new Date(document.date || new Date()).toISOString(),
            invoiceNo: document.challan_no || '',
            partnerName: document?.partnerDetails?.partner_name || '',
            basicValue: document.inv_basic_value || '',
            tax: document.inv_tax || '',
            total: document.total_invoice_value || '',
            selectedPartnerId: document?.partner || null,
            materialTransactionId: document?.id || null,
            isFromDocument: true,
          };
          await AsyncStorage.setItem(formStorageKey, JSON.stringify(formData));
          await AsyncStorage.setItem(storageKey, JSON.stringify(prefilledItems));
        } else {
          // Load draft data if available
          if (storedFormData) {
            const data = JSON.parse(storedFormData);
            if (data.date) setDate(new Date(data.date));
            setInvoiceNo(data.invoiceNo || '');
            setPartnerName(data.partnerName || '');
            setBasicValue(data.basicValue || '');
            setTax(data.tax || '');
            setTotal(data.total || '');
            setSelectedPartnerId(data.selectedPartnerId || null);
            setMaterialTransactionId(data.materialTransactionId || null);
          }

          if (storedItems) {
            const parsedItems = JSON.parse(storedItems);
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

  // Auto-save form data (debounced)
  useEffect(() => {
    const saveFormData = async () => {
      try {
        const formData = {
          date: date.toISOString(),
          invoiceNo,
          partnerName,
          basicValue,
          tax,
          total,
          selectedPartnerId,
          materialTransactionId,
          isFromDocument: !!document,
        };
        await AsyncStorage.setItem(formStorageKey, JSON.stringify(formData));
      } catch (e) {
        console.error('Failed to save form data:', e);
      }
    };

    const timer = setTimeout(saveFormData, 500);
    return () => clearTimeout(timer);
  }, [date, invoiceNo, partnerName, basicValue, tax, total, selectedPartnerId, materialTransactionId, document]);

  // Auto-save items (debounced)
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

  // Generate backend payload
  const generatePayload = useCallback((status: ActionType) => {
    console.log('Generating payload with:', {
      selectedPartnerId,
      materialTransactionId,
      status
    });

    return {
      project_id: projectId,
      date: date.toISOString().split('T')[0],
      createdBy: userId,
      partner: selectedPartnerId,
      partner_inv_no: invoiceNo,
      inv_basic_value: parseFloat(basicValue) || 0,
      inv_tax: parseFloat(tax) || 0,
      total_invoice_value: parseFloat(total) || 0,
      materialTransactionId: materialTransactionId,
      isInvoiced: status,
      forms: items.map(item => ({
        item: item.id,
        qty: parseFloat(item.qty || '0'),
        uom: item.uomId,
        unit_price: parseFloat(item.unitRate || '0'),
        totalValue: parseFloat(item.totalValue || '0'),
        notes: item.description || ''
      }))
    };
  }, [projectId, date, userId, selectedPartnerId, invoiceNo, basicValue, tax, total, materialTransactionId, items]);

  // Unified save function
  const handleSave = useCallback(async (actionType: ActionType) => {
    try {
      setLoading(true);
      setShowDropdown(false);

      // Validation for invoice
      if (actionType === 'invoiced') {
        if (!invoiceNo || !basicValue || items.length === 0) {
          Alert.alert('Validation Error', 'Please fill in all required fields and add at least one item.');
          return;
        }
      }

      const payload = generatePayload(actionType);
      console.log(`${actionType} Payload:`, JSON.stringify(payload, null, 2));

      if (actionType === 'draft') {
        // Save draft to AsyncStorage
        await AsyncStorage.setItem('MaterialBillDraft', JSON.stringify(payload));
        Alert.alert('Success', 'Material Bill saved as draft successfully!');
      } else if (actionType === 'rejected') {
        // Handle rejection (save locally or send to API based on requirements)
        await AsyncStorage.setItem('MaterialBillRejected', JSON.stringify(payload));
        Alert.alert('Success', 'Material Bill rejected successfully!');
        navigateToMaterialBill();
        return;
      } else {
        // Save as invoice via API
        await createMaterialBillById(payload, async () => {
          // Clear draft data after successful save
          await AsyncStorage.removeItem(storageKey);
          await AsyncStorage.removeItem(formStorageKey);
          await AsyncStorage.removeItem('MaterialBillDraft');
          setItems([]);
          navigateToMaterialBill();
        });
        return; // Exit early as navigation is handled in callback
      }
    } catch (error) {
      console.error(`Error with ${actionType}:`, error);
      Alert.alert('Error', `Failed to ${actionType === 'invoiced' ? 'create invoice' : actionType === 'draft' ? 'save draft' : 'reject bill'}.`);
    } finally {
      setLoading(false);
    }
  }, [generatePayload, createMaterialBillById, navigateToMaterialBill, invoiceNo, basicValue, items.length]);

  // Handle reject with confirmation
  const handleReject = useCallback(() => {
    Alert.alert(
      'Reject Material Bill',
      'Are you sure you want to reject this material bill?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => handleSave('rejected'),
        },
      ]
    );
  }, [handleSave]);

  // Clear all data
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
              await AsyncStorage.removeItem('MaterialBillDraft');
              
              // Reset all form fields
              setDate(new Date());
              setInvoiceNo('');
              setPartnerName('');
              setBasicValue('');
              setTax('');
              setTotal('');
              setItems([]);
              setSelectedPartnerId(null);
              setMaterialTransactionId(null);
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

  // Delete item with confirmation
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

  // Date picker handler
  const onChangeDate = useCallback((_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  }, []);

  // Dropdown menu item renderer
  const renderDropdownItem = useCallback((title: string, onPress: () => void, iconName: string) => (
    <TouchableOpacity
      style={{
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
      }}
      onPress={onPress}
    >
      <Icon name={iconName} size={18} color="#333" style={{ marginRight: 12 }} />
      <Text style={{ fontSize: 16, color: '#333' }}>{title}</Text>
    </TouchableOpacity>
  ), []);

  // Item list renderer
  const renderItem = useCallback(({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('AddItem', {
          mode: 'edit',
          item: item,  
          itemToEdit: item,
          index: index,
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
            {item.unitRate && (
              <Text style={styles.itemSub}>Unit Price: {item.unitRate}</Text>
            )}
            {item.totalValue && (
              <Text style={styles.itemSub}>Total: {item.totalValue}</Text>
            )}
          </View>
          <View style={styles.rightSection}>
            <Text style={styles.qtyText}>Qty: {item.qty || ''}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  ), [navigation, items, route.name, confirmDelete]);

  return (
    <SafeAreaView style={{ flexGrow: 1, paddingTop: 20, paddingBottom: 40, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={navigateToMaterialBill} style={{ padding: 10, marginLeft: -10 }}>
              <Icon name="arrow-back" size={28} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Material Bill</Text>
            <View style={{ position: 'relative' }}>
              {loading ? (
                <View style={{
                  backgroundColor: '#007AFF',
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 6,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <ActivityIndicator size="small" color="#fff" />
                </View>
              ) : (
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
              )}
              
              {/* Dropdown Menu */}
              {showDropdown && !loading && (
                <View style={{
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
                }}>
                  {renderDropdownItem('Save as Invoice', () => handleSave('invoiced'), 'receipt-outline')}
                  {renderDropdownItem('Clear Data', handleClearData, 'trash-outline')}
                </View>
              )}
            </View>
          </View>

          {/* Date Picker */}
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', paddingVertical: 6, marginBottom: 8 }}>
            <Text style={{ color: '#007AFF', fontWeight: 'bold', marginBottom: 6, fontSize: 16 }}>
              Date <Text style={{ color: 'red' }}>*</Text>
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, color: '#000' }}>{date.toLocaleDateString('en-GB')}</Text>
              <Icon name="calendar-outline" size={22} color="#000" />
            </View>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker value={date} mode="date" display="default" onChange={onChangeDate} maximumDate={new Date()} />
          )}

          {/* Form Fields */}
          {partnerName && (
            <>
              <Text style={styles.label}>Partner</Text>
              <TextInput
                value={partnerName}
                onChangeText={setPartnerName}
                placeholder="Enter Partner Name"
                placeholderTextColor="#A0A0A0"
                style={styles.input}
              />

              <Text style={styles.label}>Partner Invoice No</Text>
              <TextInput
                value={invoiceNo}
                onChangeText={setInvoiceNo}
                placeholder="Enter Invoice No"
                placeholderTextColor="#A0A0A0"
                style={styles.input}
              />
            </>
          )}

          <Text style={styles.label}>Invoice Basic Value</Text>
          <TextInput
            value={basicValue}
            onChangeText={setBasicValue}
            placeholder="Enter Basic Value"
            keyboardType="decimal-pad"
            placeholderTextColor="#A0A0A0"
            style={styles.input}
          />

          <Text style={styles.label}>Invoice Tax</Text>
          <TextInput
            value={tax}
            onChangeText={setTax}
            placeholder="Enter Tax"
            keyboardType="decimal-pad"
            placeholderTextColor="#A0A0A0"
            style={styles.input}
          />

          <Text style={styles.label}>Total Invoice Value</Text>
          <TextInput
            value={total}
            placeholder="Enter Total Value"
            keyboardType="decimal-pad"
            placeholderTextColor="#A0A0A0"
            style={styles.input}
            editable={false}
          />

          {/* Items List */}
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

export default CreateMaterialBill;