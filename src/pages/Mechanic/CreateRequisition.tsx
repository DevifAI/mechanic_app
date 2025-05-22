import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, StyleSheet,
  Dimensions, Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import { useNavigation, useRoute, useIsFocused, useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from "../../styles/Mechanic/CreateRequisitionStyles"

type RequisitionItem = {
  description: any;
  id: string,
  uom: string;
  uomId: string;
  name: string;
  qty: number;
};


const CreateRequisition = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const isFocused = useIsFocused();

  const [items, setItems] = useState<RequisitionItem[]>([]);
  const [items2, setItems2] = useState<RequisitionItem[]>([]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Update items when navigation params updatedItems changes
useEffect(() => {
const mergeItems = async () => {
  if (isFocused && route.params?.updatedItems) {
    const newItems = route.params.updatedItems;

    try {
      const stored = await AsyncStorage.getItem('items');
      const parsedStored: RequisitionItem[] = stored ? JSON.parse(stored) : [];

      // Create a copy to mutate
      const merged = [...parsedStored];

      newItems.forEach((newItem: RequisitionItem) => {
        const existingIndex = merged.findIndex(item => item.id === newItem.id);

        if (existingIndex !== -1) {
          // If item exists, replace it
          merged[existingIndex] = newItem;
        } else {
          // Otherwise, add it
          merged.push(newItem);
        }
      });

      setItems(merged);
      await AsyncStorage.setItem('items', JSON.stringify(merged));

      navigation.setParams({ updatedItems: undefined }); // Prevent rerun
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
    }
  };

 const handleSave = async () => {
  try {

    console.log('Saving items:', items);

    await AsyncStorage.removeItem('items'); 

    setItems([]);

    navigation.navigate('MainTabs', {
  screen: 'Requisition',
})
  } catch (err) {
    console.error('Error clearing AsyncStorage:', err);
  }
};
  
const confirmDelete = (id: string) => {
  Alert.alert(
    'Delete Item',
    'Are you sure you want to delete this item?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            // 1. Read existing items from AsyncStorage
            const storedItems = await AsyncStorage.getItem('items');
            const parsedItems = storedItems ? JSON.parse(storedItems) : [];

            // 2. Filter out the item with the given id
            const updatedItems = parsedItems.filter((item: any) => item.id !== id);

            // 3. Save updated list to AsyncStorage
            await AsyncStorage.setItem('items', JSON.stringify(updatedItems));

            // 4. Update local state
            setItems(updatedItems);
          } catch (error) {
            console.error('Error deleting item:', error);
          }
        },
      },
    ]
  );
};
  
// const getTotal = () => {
//   const total = items.reduce((sum, item) => {
//     const qty = Number(item.qty || 0);
//     const rate = Number(item.rate || 0);
//     return sum + qty * rate;
//   }, 0);
//   return total.toFixed(2);
// };


console.log(items)


const renderItem = ({ item, index }: { item: RequisitionItem; index: number }) => (
 <View style={styles.card}>
  <View style={styles.cardContent}>
    {/* Delete Button on the Left */}
    <TouchableOpacity onPress={() => confirmDelete((item.id))} style={styles.deleteIcon}>
      <Icon name="close-circle-outline" size={24} color="#d11a2a" />
    </TouchableOpacity>

    {/* Item Details */}
    <TouchableOpacity
      style={styles.itemInfo}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('AddItem', {
          item,
          index,
          existingItems: items,
          targetScreen: 'CreateRequisition',
        })
      }
    >
      <View style={styles.leftSection}>
        <Text style={styles.itemName}>{item.name}</Text>
        {/* <Text style={styles.itemSub}>UOM: {item.uom}</Text> */}
        <Text style={styles.itemSub}>UOM ID: {item.uomId}</Text>
      </View>

      <View style={styles.rightSection}>
        <Text style={styles.qtyText}>Quantity: {item.qty}</Text>
        <Text style={styles.uomText}>UOM: {item.uom}</Text>
      </View>
    </TouchableOpacity>
  </View>
</View>


);             



  return (
     <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            style={styles.container}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 40 }}
          >

      {/* Header */}
      <View style={styles.header}>
          <TouchableOpacity 
          onPress={() => navigation.navigate('MainTabs', {
  screen: 'Requisition',
})
}
          style={{
            padding: 10,
            marginLeft: -10, // Adjust as needed for alignment
          }}
        >
          <Icon name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>


        <Text style={styles.headerTitle}>Create Requisition</Text>
       <TouchableOpacity 
        onPress={handleSave}
        style={{
          backgroundColor: '#007AFF',
          paddingVertical: 6,
          paddingHorizontal: 12,
          borderRadius: 6,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
          Save
        </Text>
      </TouchableOpacity>
      </View>

      {/* Date picker */}
       <TouchableOpacity
      onPress={() => setShowDatePicker(true)}
      style={{
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 6,
        marginBottom: 24,
      }}
    >
      {/* Label */}
      <Text style={{ color: '#007AFF', fontWeight: 'bold', marginBottom: 6 , fontSize:16 }}>
        Date <Text style={{ color: 'red', fontSize:16 }}>*</Text>
      </Text>

      {/* Date + Icon */}
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

      {/* Add Items Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          navigation.navigate('AddItem', {
            existingItems: items,
            targetScreen: 'CreateRequisition',
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


      {/* Item List */}
      <FlatList
        data={items}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ marginTop: 10, paddingBottom: 10 }}
      />

 {/* {items.length > 0 && (
         <View style={styles.subTotalRow}>
        <Text style={styles.subTotalText}>Sub Total :</Text>
        <Text style={styles.subTotalText}>₹ {getTotal()}</Text>
      </View>
 )} */}

      {/* Save Button */}
      {/* <View style={styles.saveBtnContainer}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </View> */}
    </ScrollView>
        </KeyboardAvoidingView>

  );
};

export default CreateRequisition;
