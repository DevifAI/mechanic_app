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
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
// import { styles } from "../../styles/Mechanic/CreateRequisitionStyles";
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const CreateReceipt = () => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<string[]>([]);
  const [itemInput, setItemInput] = useState('');
  const navigation = useNavigation<any>();
  const [qtyInput, setQtyInput] = useState('');

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleAddItem = () => {
    if (itemInput.trim() !== '') {
      setItems([...items, itemInput.trim()]);
      setItemInput('');
    }
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const formattedDate = date.toLocaleDateString('en-GB'); // e.g., 13/05/2025

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Receipt</Text>
        <TouchableOpacity>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Form Fields */}
      <View style={styles.form}>
        {/* Date Row */}
        <TouchableOpacity style={styles.row} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.label}>Date</Text>
          <View style={styles.rowRight}>
            <Text style={styles.value}>{formattedDate}</Text>
            <Icon name="chevron-forward" size={18} color="#000" />
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

        {/* Item Input */}
        <Text style={[styles.label, { marginTop: 24 }]}>Items</Text>
        <View style={styles.itemInputContainer}>
          <TextInput
            style={styles.itemInput}
            placeholder="Enter Item and Add"
            value={itemInput}
            onChangeText={setItemInput}
            onSubmitEditing={handleAddItem}
            returnKeyType="done"
          />
           <TouchableOpacity  onPress={handleAddItem}>
            <Icon name="add-circle" size={28} color="#1271EE" />
          </TouchableOpacity>
        </View>

       

        {/* Render Added Items as Chips */}
        <View style={styles.chipsContainer}>
          {items.map((item, index) => (
            <View key={index} style={styles.chip}>
              <Text style={styles.chipText}>{item}</Text>
              <TouchableOpacity onPress={() => handleRemoveItem(index)}>
                <Icon name="close" size={16} color="#333" />
              </TouchableOpacity>
            </View>
          ))}
        </View>


 <Text style={[styles.label, { marginTop: 24 }]}>Quantity</Text>
        <TextInput
  style={[styles.qtyInput, { borderBottomWidth: 1, borderBottomColor: '#ccc', borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0, borderRadius: 0, width: 'auto' }]}
  placeholder="Qty"
  keyboardType="numeric"
  value={qtyInput}
  onChangeText={setQtyInput}
/>

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

export default CreateReceipt;



export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingHorizontal: width * 0.05,
      paddingTop:12
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: width * 0.1,
      paddingBottom: width * 0.05,
    },
    cancelText: {
      color: '#007AFF',
      fontSize: width * 0.04,
    },
    headerTitle: {
      fontWeight: 'bold',
      fontSize: width * 0.045,
    },
    saveText: {
      color: '#007AFF',
      fontSize: width * 0.04,
    },
    form: {
      marginTop: 12,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: width * 0.045,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    label: {
      fontSize: width * 0.04,
      fontWeight: '500',
    },
    value: {
      color: '#007AFF',
      fontSize: width * 0.04,
      marginRight: 6,
    },
    rowRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    notesInput: {
      borderWidth: 1,
      borderColor: '#999',
      borderRadius: 10,
      padding: 10,
      minHeight: width * 0.3,
      textAlignVertical: 'top',
      marginTop: 6,
    },
    itemInputContainer: {
  flexDirection: 'row',
  alignItems: 'center',
 borderBottomWidth: 1,
borderBottomColor: '#ccc',
borderWidth: 0, // optional but safe to ensure no other border is applied
  borderRadius: 8,
  paddingHorizontal: width * 0.03,
  paddingVertical: Platform.OS === 'ios' ? height * 0.012 : height * 0.005,

},

itemInput: {
  flex: 1,
  fontSize: width * 0.04,
  paddingVertical: 4,
},

addButton: {
  backgroundColor: '#1271EE',
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 6,
},

addButtonText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: width * 0.035,
},

qtyInput: {
  fontSize: width * 0.04,
  paddingVertical: Platform.OS === 'ios' ? height * 0.012 : height * 0.005,
  // No border here, handled inline or here if you prefer
  borderWidth: 0,
  marginTop:8
},

chipsContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 12,
  gap: 8,
},

chip: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#f0f0f0',
  paddingHorizontal: 10,
  paddingVertical: 6,
  borderRadius: 20,
},

chipText: {
  marginRight: 6,
  fontSize: width * 0.035,
  color: '#333',
},
  });
  