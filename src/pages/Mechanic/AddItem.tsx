import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  FlatList,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const dummyItems = [
  { uomId: 101, name: 'Hammer', uom: 'pcs' },
  { uomId: 102, name: 'Screwdriver', uom: 'pcs' },
  { uomId: 103, name: 'Wrench', uom: 'pcs' },
  { uomId: 104, name: 'Cement', uom: 'kg' },
  { uomId: 105, name: 'Paint', uom: 'litre' },
  { uomId: 106, name: 'Tool Kit', uom: 'set' },
  { uomId: 107, name: 'Nails', uom: 'kg' },
  { uomId: 108, name: 'Lubricant Oil', uom: 'litre' },
  { uomId: 109, name: 'Drill Set', uom: 'set' },
  { uomId: 110, name: 'Sand', uom: 'kg' },
  { uomId: 111, name: 'Diesel', uom: 'litre' }
];


const AddItem = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const editingItem = route.params?.item || null;
  const editingIndex = route.params?.index ?? null;

  const [item, setItem] = useState(editingItem?.name || '');
  const [qty, setQty] = useState(editingItem?.qty || '');
  const [description, setdescription] = useState(editingItem?.description || '');
  const [uom, setUom] = useState(editingItem?.uom || '');
  const [uomId, setUomId] = useState(editingItem?.uomId || '');
  const [filteredItems, setFilteredItems] = useState(dummyItems);
  const [showDropdown, setShowDropdown] = useState(false);
const [itemsList, setItemsList] = useState(editingItem ? [editingItem] : []);


  const handleItemChange = (text: string) => {
    setItem(text);
    setQty('');
    setdescription('');
    setUom('')
    setUomId('')
    if (text.length > 0) {
      const matches = dummyItems.filter((d) =>
        d.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredItems(matches);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleItemSelect = (selectedItem: any) => {
    setItem(selectedItem.name);
    setQty(selectedItem.qty);
    setdescription(selectedItem.description);
    setUom(selectedItem.uom)
    setUomId(selectedItem.uomId)
    setShowDropdown(false);
  };

// const handleAddItem = () => {
//   if (!item || !qty) return;

//   // Generate next id based on current itemsList
//   const nextId = itemsList.length > 0
//     ? Math.max(...itemsList.map(i => i.id || 0)) + 1
//     : 1;

//   const newItem = {
//     id: nextId,
//     name: item,
//     qty,
//     description,
//     rate,
//   };

//   setItemsList([...itemsList, newItem]);
//   setItem('');
//   setQty('');
//   setdescription('');
//   setRate('');
//   setShowDropdown(false);
// };

const handleSave = () => {
  if (!item || !qty) {
    Alert.alert('Item name and quantity are required.');
    return;
  }

  const newItem = {
    id: editingItem?.id || Date.now(),
    name: item,
    qty,
    description,
    uom,
    uomId
  };

  let updatedItems: any[] = [];

 if (editingIndex !== null && editingIndex >= 0) {
    updatedItems = [...(route.params?.existingItems || [])];
    updatedItems[editingIndex] = newItem; // replaces old item
  } else {
    updatedItems = [...(route.params?.existingItems || []), newItem]; // adds new item
  }

  // Navigate back with updated items
  navigation.navigate('CreateRequisition', { updatedItems });

  // Optional: Reset form fields (if staying on same screen for adding more items)
  setItem('');
  setQty('');
  setdescription('');
  setUom('');
  setUomId('')
  setShowDropdown(false);
};



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
  onPress={() => navigation.goBack()}
  style={{
    padding: 10,
    marginLeft: -10, // Adjust as needed for alignment
  }}
>
  <Icon name="arrow-back" size={28} color="#000" />
</TouchableOpacity>
          <Text style={styles.headerTitle}>
            {editingItem ? 'Edit Item' : 'Add Items'}
          </Text>
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

        {/* Item input */}
<View style={styles.inputContainer}>
  <Text style={styles.label}>Item</Text>
  <View style={styles.inputWrapper}>
    <TextInput
      style={styles.input}
      placeholder="Start typing to select an Item"
      placeholderTextColor="#A0A0A0"
      value={item}
      onChangeText={handleItemChange}
    />
    {/* <TouchableOpacity 
      style={styles.addButton2}
      onPress={() => console.log('Add pressed')}
    >
      <Text style={styles.addButtonText2}>+</Text>
    </TouchableOpacity> */}
  </View>
</View>
        {showDropdown && (
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.name}
            style={styles.dropdown}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleItemSelect(item)}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}

         <Text style={[styles.label, { marginTop: 8 }]}>Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter description"
           placeholderTextColor="#A0A0A0"
          value={description}
          onChangeText={setdescription}
        />

        {/* Qty */}
        <Text style={[styles.label, { marginTop: 8 }]}>Quantity <Text style={{ color: 'red' , marginLeft:4 , fontSize:18}}>*</Text> </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter quantity"
           placeholderTextColor="#A0A0A0"
          value={qty}
          onChangeText={setQty}
          keyboardType="numeric"
        />

        {/* description */}
       <Text style={[styles.label, { marginTop: 8 }]}>UOM</Text>
        <TextInput
          style={styles.input}
          value={uom}
          placeholder="Unit of mesaurment"
          placeholderTextColor="#A0A0A0"
          onChangeText={setUom}
          editable={false} 
        />

        {/* Add Item Button */}
        {/* <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
          <Icon name="add" size={24} color="#ffff" />
          <Text style={styles.addButtonText}>
             Add Item</Text>
        </TouchableOpacity> */}

        {/* Item Preview */}
        {/* {itemsList.length > 0 && (
          <View style={{ marginTop: 16 }}>
            <Text style={styles.label}>Added Items</Text>
            {itemsList.map((itm, idx) => (
    <View 
      key={idx} 
      style={{
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 8,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#EEE'
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#222' }}>{itm.name}</Text>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#2563EB' }}>{itm.rate}</Text>
      </View>
      <View style={{ marginTop: 4 }}>
        <Text style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>Qty: {itm.qty}</Text>
        {itm.description && (
          <Text style={{ fontSize: 14, color: '#666', lineHeight: 20 }}>{itm.description}</Text>
        )}
      </View>
    </View>
  ))}

          </View>
        )} */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddItem;

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.05,
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
    fontSize: width * 0.05,
  },
  saveText: {
    color: '#007AFF',
    fontSize: width * 0.04,
  },
    inputContainer: {
    marginTop: 20,
    marginBottom: 4,
    width: '100%' // ensures full width
  },
  label: {
    fontSize: 16,
    fontWeight: '600', // semi-bold
     color: '#007AFF',
    marginBottom: 4,
    fontFamily: 'System', // default iOS font
  },
input: {
    height: 44,
    borderBottomWidth: 1, // Only bottom border
    borderColor: '#C6C6C8',
    paddingHorizontal: 2,
    fontSize: 16,
    backgroundColor: 'transparent', // Remove white background
    fontFamily: 'System',
    flex:2,
},
 inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width:'auto',
    //  borderWidth: 1,
    // borderColor: '#999',
  },
  addButton2: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText2: {
    color: 'black',
    fontSize: 28,
    fontWeight: '400',
    lineHeight: 24,
    marginRight:10
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 10,
    padding: 10,
    minHeight: width * 0.3,
    textAlignVertical: 'top',
    marginTop: 6,
  },
  dropdown: {
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 4,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap:8 ,
    marginTop: 24,
  },
  addButtonText: {
    color: '#fff',
    fontSize: width * 0.05,
    fontWeight: '600',
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap:8 ,
  },
  itemPreview: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginTop: 6,
  },
});
