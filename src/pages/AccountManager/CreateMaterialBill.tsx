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

const CreateMaterialBill = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const route = useRoute<any>();
  const { partners, getPartners } = useSuperadmin();

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

  useEffect(() => {
    getPartners().then(() => setFilteredPartners(partners));
  }, []);

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

  const handleSave = async () => {
    const data = {
      date: date.toISOString().split('T')[0],
      partnerId,
      invoiceNo,
      basicValue,
      tax,
      total,
      items,
    };

    console.log('Saved Material Bill:', data);
    await AsyncStorage.removeItem(storageKey);
    setItems([]);
    navigation.navigate('MainTabs', { screen: 'MaterialBill' });
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
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10, marginLeft: -10 }}>
              <Icon name="arrow-back" size={28} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Material Bill</Text>
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

          {/* Partner */}
          <Text style={styles.label}>Partner</Text>
          <TextInput
            placeholder="Start typing to select a Partner"
            placeholderTextColor="#A0A0A0"
            style={styles.input}
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
                    setPartnerId(item.id);
                    setShowPartnerDropdown(false);
                  }}
                >
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          {/* Other Inputs */}
          <Text style={styles.label}>Partner Invoice No</Text>
          <TextInput
            value={invoiceNo}
            onChangeText={setInvoiceNo}
            placeholder="Enter Invoice No"
            placeholderTextColor="#A0A0A0"
            style={styles.input}
          />

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
            onChangeText={setTotal}
            placeholder="Enter Total Value"
            keyboardType="decimal-pad"
            placeholderTextColor="#A0A0A0"
            style={styles.input}
          />

          {/* Add Item */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() =>
              navigation.navigate('AddItem', {
                existingItems: items,
                targetScreen: route.name,
              })
            }
          >
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

export default CreateMaterialBill;
