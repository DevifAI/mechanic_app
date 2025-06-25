import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, TextInput,
  Platform, KeyboardAvoidingView, Alert, SafeAreaView,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../styles/Mechanic/CreateRequisitionStyles';
import useRevenueInput from '../../hooks/useRevenueInput';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const CreateRevenueInput = () => {
  const navigation = useNavigation<any>();
  const { createRevenueInputById } = useRevenueInput();
  const { projectId, userId } = useSelector((state: RootState) => state.auth);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [hoInvoice, setHoInvoice] = useState('');
  const [accountCode, setAccountCode] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountId, setAccountId] = useState('');

const [basicAmount, setBasicAmount] = useState<number>(0);
const [taxValue, setTaxValue] = useState<number>(0);
const [totalAmount, setTotalAmount] = useState<number>(0);


  const [loading, setLoading] = useState(false);
  const storageKey = 'RevenueInputData';

  useEffect(() => {
    const loadStored = async () => {
      try {
        const stored = await AsyncStorage.getItem(storageKey);
        if (stored) {
          const data = JSON.parse(stored);
          setDate(new Date(data.date));
          setHoInvoice(data.hoInvoice || '');
          setAccountCode(data.accountCode || '');
          setAccountName(data.accountName || '');
          setAccountId(data.accountId || '');
          setBasicAmount(data.basicAmount || '');
          setTaxValue(data.taxValue || '');
          setTotalAmount(data.totalAmount || '');
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
  setTotalAmount(basicAmount + taxValue);
}, [basicAmount, taxValue]);


  const onChangeDate = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };



  const saveRevenue = async () => {
    setLoading(true);
   const payload = {
  project_id: projectId,
  createdBy: userId,
  date: date.toISOString().split('T')[0],
  ho_invoice: hoInvoice,
  account_code: accountCode,
  account_name: accountName,
  amount_basic: basicAmount,
  tax_value: taxValue,
  total_amount: totalAmount,
};

    try {
      await createRevenueInputById(payload, async () => {
        await AsyncStorage.removeItem(storageKey);
        Alert.alert('Success', 'Revenue input saved');
        navigation.navigate('RevenueInput');
      });
    } catch (e) {
      console.error('Error saving revenue input:', e);
      Alert.alert('Error', 'Failed to save revenue input');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
          style={{
            flexGrow: 1,
            paddingTop: 20,
            paddingBottom: 40,
            backgroundColor: '#fff',
          }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10, marginLeft: -10 }}>
              <Icon name="arrow-back" size={28} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Revenue Input</Text>
            <TouchableOpacity
              onPress={saveRevenue}
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
          {showDatePicker && <DateTimePicker value={date} mode="date" display="default" onChange={onChangeDate} maximumDate={new Date()} />}

          {/* Inputs */}
          <Text style={styles.label}>HO Invoice</Text>
          <TextInput
            style={styles.input}
            value={hoInvoice}
            onChangeText={setHoInvoice}
            placeholder="Enter HO Invoice"
            placeholderTextColor="#A0A0A0"
          />

          <Text style={styles.label}>Account Code</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Account Code"
            placeholderTextColor="#A0A0A0"
            value={accountCode}
            onChangeText={setAccountCode}
          />

          <Text style={styles.label}>Account Name</Text>
          <TextInput
            style={styles.input}
            value={accountName}
            onChangeText={setAccountName}
            placeholder="Enter Account Name"
            placeholderTextColor="#A0A0A0"
          />

          <Text style={styles.label}>Basic Amount</Text>
          <TextInput
            style={styles.input}
            value={basicAmount.toString()}
            onChangeText={(text) => {
           const num = parseFloat(text);
           setBasicAmount(isNaN(num) ? 0 : num);
            }}
            placeholder="Enter Basic Amount"
            placeholderTextColor="#A0A0A0"
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Tax Value</Text>
          <TextInput
            style={styles.input}
          value={taxValue.toString()}
           onChangeText={(text) => {
          const num = parseFloat(text);
          setTaxValue(isNaN(num) ? 0 : num);
            }}
            placeholder="Enter Tax Value"
            placeholderTextColor="#A0A0A0"
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Total Amount</Text>
          <TextInput
            style={styles.input}
            value={totalAmount.toString()}
            editable={false}
            placeholder="Auto-calculated"
            placeholderTextColor="#A0A0A0"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateRevenueInput;
