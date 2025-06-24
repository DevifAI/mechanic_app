import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, TextInput,
  Platform, KeyboardAvoidingView, FlatList, Alert, SafeAreaView,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused, useRoute } from '@react-navigation/native';
import { styles } from '../../styles/Mechanic/CreateRequisitionStyles';
import useSuperadmin from '../../hooks/useSuperadmin';
import useMaterialBill from '../../hooks/useMaterialBill';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const CreateMaterialBill = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const route = useRoute<any>();
  const { projectId, userId } = useSelector((state: RootState) => state.auth);

  const { partners, getPartners } = useSuperadmin();
  const { createMaterialBillById } = useMaterialBill();

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [partner, setPartner] = useState('');
  const [partnerId, setPartnerId] = useState('');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [basicValue, setBasicValue] = useState('');
  const [tax, setTax] = useState('');
  const [total, setTotal] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [showPartnerDropdown, setShowPartnerDropdown] = useState(false);
  const [filteredPartners, setFilteredPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const storageKey = 'MaterialBillItems';
  const formStorageKey = 'MaterialBillFormData';

  useEffect(() => {
    getPartners().then(() => setFilteredPartners(partners));
  }, []);

  useEffect(() => {
    setTotal((parseFloat(basicValue) || 0 + parseFloat(tax) || 0).toString());
  }, [basicValue, tax]);

  useEffect(() => {
    const mergeItems = async () => {
      if (isFocused && route.params?.updatedItems) {
        const newItems = route.params.updatedItems;
        try {
          const stored = await AsyncStorage.getItem(storageKey);
          const parsedStored = stored ? JSON.parse(stored) : [];
          const merged = [...parsedStored];

          newItems.forEach((newItem: any) => {
            const index = merged.findIndex((item: any) => item.id === newItem.id);
            if (index !== -1) merged[index] = newItem;
            else merged.push(newItem);
          });

          setItems(merged);
          await AsyncStorage.setItem(storageKey, JSON.stringify(merged));
          navigation.setParams({ updatedItems: undefined });
        } catch (err) {
          console.error('Error merging items:', err);
        }
      }
    };
    mergeItems();
  }, [isFocused, route.params?.updatedItems]);

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const stored = await AsyncStorage.getItem(formStorageKey);
        if (stored) {
          const data = JSON.parse(stored);
          if (data.date) setDate(new Date(data.date));
          setPartner(data.partner || '');
          setPartnerId(data.partnerId || '');
          setInvoiceNo(data.invoiceNo || '');
          setBasicValue(data.basicValue || '');
          setTax(data.tax || '');
          setTotal(data.total || '');
        }
      } catch (e) {
        console.error('Failed to load form data:', e);
      }
    };
    loadFormData();
  }, []);

  useEffect(() => {
    const saveFormData = async () => {
      const formData = {
        date: date.toISOString(),
        partner,
        partnerId,
        invoiceNo,
        basicValue,
        tax,
        total
      };
      await AsyncStorage.setItem(formStorageKey, JSON.stringify(formData));
    };
    saveFormData();
  }, [date, partner, partnerId, invoiceNo, basicValue, tax, total]);

  const handleSave = async () => {
    setLoading(true);
    const data = {
      project_id: projectId,
      date: date.toISOString().split('T')[0],
      createdBy: userId,
      partner: partnerId,
      partner_inv_no: invoiceNo,
      inv_basic_value: basicValue,
      inv_tax: tax,
      total_invoice_value: total,
      forms: items
    };

    try {
      await createMaterialBillById(data, async () => {
        console.log('Saved Material Bill:', data);
        await AsyncStorage.removeItem(storageKey);
        await AsyncStorage.removeItem(formStorageKey);
        setItems([]);
        setLoading(false);
        navigation.navigate('MainTabs', { screen: 'MaterialBill' });
      });
    } catch (error) {
      console.error('Error saving Material Bill:', error);
      Alert.alert('Error', 'Failed to save Material Bill.');
      setLoading(false);
    }
  };

  const confirmDelete = (id: string) => {
    Alert.alert('Delete Item', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const stored = await AsyncStorage.getItem(storageKey);
          const parsed = stored ? JSON.parse(stored) : [];
          const updated = parsed.filter((item: any) => item.id !== id);
          await AsyncStorage.setItem(storageKey, JSON.stringify(updated));
          setItems(updated);
        },
      },
    ]);
  };

  const onChangeDate = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handlePartnerChange = (text: string) => {
    setPartner(text);
    setShowPartnerDropdown(true);
    const filtered = partners.filter((p) =>
      p.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredPartners(filtered);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <TouchableOpacity onPress={() => confirmDelete(item.id)} style={styles.deleteIcon}>
          <Icon name="close-circle-outline" size={24} color="#d11a2a" />
        </TouchableOpacity>
        <View style={styles.itemInfo}>
          <View style={styles.leftSection}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemSub}>UOM: {item.uom}</Text>
          </View>
          <View style={styles.rightSection}>
            <Text style={styles.qtyText}>Qty: {item.qty}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Header + Inputs... (Same as before, omitted for brevity) */}
          {/* Use the same JSX code from your original input form here */}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateMaterialBill;
