import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../styles/MechanicIncharge/ApproveStyles';

const Approve = () => {
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigation = useNavigation<any>();

  const formatDate = (dateObj: Date) => {
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = String(dateObj.getFullYear()).slice(2);
    return `${day}/${month}/${year}`;
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios'); // for iOS keep picker open
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>For Approval</Text>
        <TouchableOpacity>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Form Fields */}
      <View style={styles.form}>
        {/* Date Row */}
        <TouchableOpacity 
          style={styles.row} 
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.label}>Date</Text>
          <View style={styles.rowRight}>
            <Text style={styles.value}>{formatDate(date)}</Text>
            <Icon name="calendar" size={18} color="#000" style={{ marginLeft: 8 }} />
          </View>
        </TouchableOpacity>

        {/* Show Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            maximumDate={new Date()}
            onChange={onChangeDate}
          />
        )}

        {/* Item Row */}
        <TouchableOpacity style={styles.row}>
          <Text style={styles.label}>Item</Text>
          <Icon name="chevron-forward" size={18} color="#000" />
        </TouchableOpacity>

        {/* Qty Row */}
        <TouchableOpacity style={styles.row}>
          <Text style={styles.label}>Qty</Text>
          <Icon name="chevron-forward" size={18} color="#000" />
        </TouchableOpacity>

        {/* Notes Input */}
        <Text style={[styles.label, { marginTop: 24 }]}>Notes</Text>
        <TextInput
          style={styles.notesInput}
          multiline
          numberOfLines={4}
          placeholder="Enter notes here..."
          value={notes}
          onChangeText={setNotes}
        />
      </View>
    </ScrollView>
  );
};

export default Approve;
