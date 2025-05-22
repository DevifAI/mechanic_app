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


const CreateReceipt = () => {
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
      const stored = await AsyncStorage.getItem('ReceiptItems');
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
      await AsyncStorage.setItem('ReceiptItems', JSON.stringify(merged));

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

    await AsyncStorage.removeItem('ReceiptItems'); 

    setItems([]);

  navigation.navigate('MainTabs', {
  screen: 'Receipt',
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
            const storedItems = await AsyncStorage.getItem('ReceiptItems');
            const parsedItems = storedItems ? JSON.parse(storedItems) : [];

            // 2. Filter out the item with the given id
            const updatedItems = parsedItems.filter((item: any) => item.id !== id);

            // 3. Save updated list to AsyncStorage
            await AsyncStorage.setItem('ReceiptItems', JSON.stringify(updatedItems));

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
          targetScreen: 'CreateReceipt',
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
  screen: 'Receipt',
})
}
          style={{
            padding: 10,
            marginLeft: -10, // Adjust as needed for alignment
          }}
        >
          <Icon name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>


        <Text style={styles.headerTitle}>Create Receipt</Text>
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
             targetScreen: 'CreateReceipt',
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
    </ScrollView>
        </KeyboardAvoidingView>

  );
};

export default CreateReceipt;

// const { width } = Dimensions.get('window');

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     paddingHorizontal: width * 0.05,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingTop: width * 0.1,
//     paddingBottom: width * 0.08,
//   },
//   cancelText: {
//     color: 'red',
//     fontSize: width * 0.04,
//   },
//     saveText: {
//     color: '#007AFF',
//     fontSize: width * 0.04,
//   },
//   headerTitle: {
//     fontSize: width * 0.05,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     flex: 1,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 10,
//     borderBottomWidth: 0.5,
//     borderBottomColor: '#ccc',
//   },
//   row2: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   label: {
//     fontSize: width * 0.038,
//     fontWeight: '500',
//     color: '#555',
//     width: 60,
//   },
//   value: {
//     fontSize: width * 0.038,
//     color: '#222',
//     flexShrink: 1,
//   },
//   addButton: {
//     borderWidth:1,
//     borderColor: '#1271EE',
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 20,
//     flexDirection:'row',
//     justifyContent:'center',
//     gap:4
//   },
//   addButtonText: {
//     color: '#1271EE',
//     fontWeight: '600',
//     fontSize:16
//   },
//   // card: {
//   //   flexDirection: 'row',
//   //   padding: 12,
//   //   backgroundColor: '#f7f7f7',
//   //   borderRadius: 8,
//   //   marginBottom: 10,
//   //   elevation: 2,
//   // },
//   title: {
//     fontSize: width * 0.045,
//     fontWeight: '600',
//     marginBottom: 6,
//   },
//   deleteBtn: {
//     justifyContent: 'center',
//     paddingLeft: 4,
//     marginRight:8
//   },
//   saveBtnContainer: {
//     position: 'absolute',
//     bottom: 20,
//     left: width * 0.05,
//     right: width * 0.05,
//   },
//   saveBtn: {
//     backgroundColor: '#34C759',
//     padding: 14,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   saveBtnText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   headerRow: {
//     flexDirection: 'row',
//     paddingBottom: 10,
//     marginTop:16,
//      display:'flex',
//     textAlign:'center',
//     justifyContent:"center",
//     alignItems:"center",
//   },
//   headerText: {
//     fontWeight: '600',
//     fontSize: 16,
//     color: '#6b7280',
//     display:'flex',
//     textAlign:'center',
//     justifyContent:"center",
//     alignItems:"center",
//   },
//   itemRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 8,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical:22,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     shadowOffset: { width: 0, height: 2 },
//   },

//   itemContent: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   centerContent: {
//     flexDirection: 'column',
//   },
 
//   itemDetails: {
//     fontSize: 14,
//     color: '#777',
//     marginTop: 2,
//   },
//   amountText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#000',
//     textAlign: 'right',
//     minWidth: 70,
//   },
//   separator: {
//     height: 1,
//     backgroundColor: '#e5e7eb',
//     marginVertical: 10,
//   },
//   subTotalRow: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     paddingTop: 6,
//     gap:32,
//     paddingHorizontal:10
//   },
//   subTotalText: {
//     fontWeight: 'bold',
//     fontSize: 16,
//     color: '#111827',
//   },

//   //card

//    card: {
//     backgroundColor: '#fff',
//     marginHorizontal: 16,
//     marginVertical: 8,
//     borderRadius: 12,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//   },
//   cardContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 12,
//   },
//   deleteIcon: {
//     marginRight: 12,
//   },
//   itemInfo: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   leftSection: {
//     flex: 1,
//   },
//   itemName: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#222',
//   },
//   itemSub: {
//     fontSize: 14,
//     color: '#777',
//     marginTop: 6,
//     fontWeight: '600',
//   },
//   rightSection: {
//     alignItems: 'flex-end',
//   },
//   qtyText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   uomText: {
//     fontSize: 14,
//     color: '#666',
//     fontWeight: '600',
//     marginTop: 6,
//   },
// });
