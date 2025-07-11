import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../styles/Mechanic/CreateRequisitionStyles';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import useExpenseInput from '../../hooks/UseEquipmentInput';

const paidByOptions = ['Cash', 'HO'];
const allocationOptions = ['Site', 'Base Camp', 'Yard'];

const CreateExpenseInput = () => {
  const navigation = useNavigation<any>();
  const { projectId, userId } = useSelector((state: RootState) => state.auth);
  const { createExpenseInputById } = useExpenseInput();

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [paidBy, setPaidBy] = useState('');
  const [paidTo, setPaidTo] = useState('');
  const [expenseCode, setExpenseCode] = useState('');
  const [expenseName, setExpenseName] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [allocation, setAllocation] = useState('');
  const [notes, setNotes] = useState('');

  const [showPaidByDropdown, setShowPaidByDropdown] = useState(false);
  const [showAllocationDropdown, setShowAllocationDropdown] = useState(false);

  const [loading, setLoading] = useState(false);

  // Validation function to check if all required fields are filled
  const isFormValid = () => {
    return (
      paidBy.trim() !== '' &&
      paidTo.trim() !== '' &&
      expenseCode.trim() !== '' &&
      expenseName.trim() !== '' &&
      amount > 0 &&
      allocation.trim() !== ''
    );
  };

  const onChangeDate = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleSave = async () => {
    // Validate form before saving
    if (!isFormValid()) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);

    if (!paidByOptions.includes(paidBy)) {
      Alert.alert('Error', 'Please select a valid Paid By option (Cash or HO)');
      setLoading(false);
      return;
    }

    if (!allocationOptions.includes(allocation)) {
      Alert.alert('Error', 'Please select a valid Allocation (Site, Base Camp, or Yard)');
      setLoading(false);
      return;
    }

    const payload = {
      date: date.toISOString().split('T')[0],
      paid_to: paidTo,
      paid_by: paidBy,
      expense_code: expenseCode,
      expense_name: expenseName,
      amount,
      allocation,
      project_id: projectId,
      createdBy: userId,
      notes,
    };

    try {
      await createExpenseInputById(payload, async () => {
        setLoading(false);
        console.log('Success', 'Expense saved successfully');
        navigation.navigate('MainTabs', {
  screen: 'ExpenseInput',
});
      });
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to save expense');
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
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() =>  navigation.navigate('MainTabs', { screen: 'ExpenseInput' })} style={{ padding: 10, marginLeft: -10 }}>
              <Icon name="arrow-back" size={28} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Expense</Text>
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
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Save</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Date */}
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', paddingVertical: 6, marginBottom: 8 }}
          >
            <Text style={{ color: '#007AFF', fontWeight: 'bold', marginBottom: 6, fontSize: 16 }}>
              Date <Text style={{ color: 'red' }}>*</Text>
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, color: '#000' }}>{date.toLocaleDateString('en-GB')}</Text>
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

          {/* Paid By (Dropdown) */}
          <Text style={styles.label}>
            Paid By <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <TouchableOpacity onPress={() => setShowPaidByDropdown(true)} style={styles.input}>
            <Text style={{ color: paidBy ? '#000' : '#A0A0A0' }}>
              {paidBy || 'Select Paid By'}
            </Text>
          </TouchableOpacity>
          {showPaidByDropdown && (
            <FlatList
              data={paidByOptions}
              keyExtractor={(item) => item}
              style={styles.dropdown}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setPaidBy(item);
                    setShowPaidByDropdown(false);
                  }}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          {/* Paid To (Text Input) */}
          <Text style={styles.label}>
            Paid To <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={paidTo}
            onChangeText={setPaidTo}
            placeholder="Enter vendor or recipient"
            placeholderTextColor="#A0A0A0"
          />

          {/* Expense Code */}
          <Text style={styles.label}>
            Expense Code <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={expenseCode}
            onChangeText={setExpenseCode}
            placeholder="Enter Expense Code"
            placeholderTextColor="#A0A0A0"
          />

          {/* Expense Name */}
          <Text style={styles.label}>
            Expense Name <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={expenseName}
            onChangeText={setExpenseName}
            placeholder="Enter Expense Name"
            placeholderTextColor="#A0A0A0"
          />

          {/* Amount */}
          <Text style={styles.label}>
            Amount <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={amount.toString()}
            onChangeText={(text) => {
              const num = parseFloat(text);
              setAmount(isNaN(num) ? 0 : num);
            }}
            keyboardType="decimal-pad"
            placeholder="Enter Amount"
            placeholderTextColor="#A0A0A0"
          />

          {/* Allocation */}
          <Text style={styles.label}>
            Allocation <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <TouchableOpacity onPress={() => setShowAllocationDropdown(true)} style={styles.input}>
            <Text style={{ color: allocation ? '#000' : '#A0A0A0' }}>
              {allocation || 'Select Allocation'}
            </Text>
          </TouchableOpacity>
          {showAllocationDropdown && (
            <FlatList
              data={allocationOptions}
              keyExtractor={(item) => item}
              style={styles.dropdown}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setAllocation(item);
                    setShowAllocationDropdown(false);
                  }}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          {/* Notes */}
          <Text style={styles.label}>Note</Text>
          <TextInput
            style={[styles.textArea, { height: 100, textAlignVertical: 'top' }]}
            multiline
            placeholder="Write notes here..."
            placeholderTextColor="#A0A0A0"
            value={notes}
            onChangeText={setNotes}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateExpenseInput;