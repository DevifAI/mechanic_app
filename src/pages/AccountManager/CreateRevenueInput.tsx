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

const CreateRevenueInput = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const isFocused = useIsFocused();
  const { accounts, getAccounts } = useSuperadmin();

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [hoInvoice, setHoInvoice] = useState('');
  const [accountCode, setAccountCode] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountId, setAccountId] = useState('');

  const [basicAmount, setBasicAmount] = useState('');
  const [taxValue, setTaxValue] = useState('');
  const [totalAmount, setTotalAmount] = useState('');

  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [filteredAccounts, setFilteredAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const storageKey = 'RevenueInputData';

  useEffect(() => {
    getAccounts().then(() => setFilteredAccounts(accounts));
  }, []);

  useEffect(() => {
    const loadStored = async () => {
      try {
        const stored = await AsyncStorage.getItem(storageKey);
        if (stored) {
          const data = JSON.parse(stored);
          setDate(new Date(data.date));
          setHoInvoice(data.hoInvoice);
          setAccountCode(data.accountCode);
          setAccountName(data.accountName);
          setAccountId(data.accountId);
          setBasicAmount(data.basicAmount);
          setTaxValue(data.taxValue);
          setTotalAmount(data.totalAmount);
        }
      } catch (e) {
        console.error('Load storage error', e);
      }
    };
    loadStored();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(storageKey, JSON.stringify({
      date, hoInvoice, accountCode, accountName, accountId,
      basicAmount, taxValue, totalAmount
    }));
  }, [date, hoInvoice, accountCode, accountName, basicAmount, taxValue, totalAmount]);

  useEffect(() => {
    const basic = parseFloat(basicAmount) || 0;
    const tax = parseFloat(taxValue) || 0;
    setTotalAmount((basic + tax).toFixed(2));
  }, [basicAmount, taxValue]);

  const onChangeDate = (_: any, sel?: Date) => {
    setShowDatePicker(false);
    if (sel) setDate(sel);
  };

  const handleAccountChange = (text: string) => {
    setAccountCode(text);
    setShowAccountDropdown(true);
    setFilteredAccounts(accounts.filter((a : any) =>
      a.code.toLowerCase().includes(text.toLowerCase())
    ));
  };

  const confirmSave = () => {
    Alert.alert('Save Revenue?', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Save', onPress: saveRevenue }
    ]);
  };
  const saveRevenue = async () => {
    setLoading(true);
    const payload = {
      date: date.toISOString().split('T')[0],
      hoInvoice, accountId, accountCode, accountName,
      basicAmount, taxValue, totalAmount
    };
    console.log('Save revenue input:', payload);
    await AsyncStorage.removeItem(storageKey);
    setLoading(false);
    navigation.goBack();
  };

  const renderAccount = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => {
        setAccountCode(item.code);
        setAccountName(item.name);
        setAccountId(item.id);
        setShowAccountDropdown(false);
      }}>
      <Text>{item.code} – {item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10, marginLeft: -10 }}>
              <Icon name="arrow-back" size={28} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Revenue Input</Text>
            <TouchableOpacity
              onPress={confirmSave}
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


          {/* HO Invoice */}
          <Text style={styles.label}>HO Invoice</Text>
          <TextInput
            style={styles.input}
            value={hoInvoice}
            onChangeText={setHoInvoice}
            placeholder="Enter HO Invoice"
            placeholderTextColor="#A0A0A0"
          />

          {/* Account Code */}
          <Text style={styles.label}>Account Code</Text>
          <TextInput
            style={styles.input}
            placeholder="Start typing account code"
            placeholderTextColor="#A0A0A0"
            value={accountCode}
            onChangeText={handleAccountChange}
          />
          {showAccountDropdown && (
            <FlatList
              data={filteredAccounts}
              keyExtractor={item => item.id}
              style={styles.dropdown}
              renderItem={renderAccount}
            />
          )}

          {/* Account Name (read only) */}
          <Text style={styles.label}>Account Name</Text>
          <TextInput
            style={[styles.input, { backgroundColor: '#f0f0f0' }]}
            value={accountName}
            editable={false}
            placeholder="Select account code above"
            placeholderTextColor="#999"
          />

          {/* Amount fields */}
          <Text style={styles.label}>Basic Amount</Text>
          <TextInput
            style={styles.input}
            value={basicAmount}
            onChangeText={setBasicAmount}
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Tax Value</Text>
          <TextInput
            style={styles.input}
            value={taxValue}
            onChangeText={setTaxValue}
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Total Amount</Text>
          <TextInput
            style={[styles.input, { backgroundColor: '#f0f0f0' }]}
            value={totalAmount}
            editable={false}
            placeholder="Auto-calculated"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateRevenueInput;
