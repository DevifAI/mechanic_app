import React, {useEffect, useState} from 'react';
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
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {styles} from '../../styles/Mechanic/AddItemsStyles';
import useSuperadmin from '../../hooks/useSuperadmin';

// const dummyItems = [
//   {uomId: 101, name: 'Hammer', uom: 'pcs'},
//   {uomId: 102, name: 'Screwdriver', uom: 'pcs'},
//   {uomId: 103, name: 'Wrench', uom: 'pcs'},
//   {uomId: 104, name: 'Cement', uom: 'kg'},
//   {uomId: 105, name: 'Paint', uom: 'litre'},
//   {uomId: 106, name: 'Tool Kit', uom: 'set'},
//   {uomId: 107, name: 'Nails', uom: 'kg'},
//   {uomId: 108, name: 'Lubricant Oil', uom: 'litre'},
//   {uomId: 109, name: 'Drill Set', uom: 'set'},
//   {uomId: 110, name: 'Sand', uom: 'kg'},
//   {uomId: 111, name: 'Diesel', uom: 'litre'},
// ];

// const dummyEquipments = [
//   {name: 'Hydraulic Brake'},
//   {name: 'Engine Pump'},
//   {name: 'Clutch Plate'},
//   {name: 'Air Filter'},
//   {name: 'Fuel Injector'},
//   {name: 'Hydraulic Pump'},
// ];

const AddItem = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const {
    consumabaleItems,
    getConsumableItems,
    loading,
    equipments,
    getEquipments,
  } = useSuperadmin();

  const editingItem = route.params?.item || null;
  const editingIndex = route.params?.index ?? null;
  const targetScreen = route.params?.targetScreen || 'CreateRequisition';

  const [item, setItem] = useState(editingItem?.name || '');
  const [itemId, setitemId] = useState(editingItem?.id || '');
  const [qty, setQty] = useState(editingItem?.qty || '');
  const [description, setdescription] = useState(
    editingItem?.description || '',
  );
  const [uom, setUom] = useState(editingItem?.uom || '');
  const [uomId, setUomId] = useState(editingItem?.uomId || '');
  const [filteredItems, setFilteredItems] = useState(consumabaleItems);
  const [showDropdown, setShowDropdown] = useState(false);

  const [equipment, setEquipment] = useState(editingItem?.equipment || '');
  const [equipmentId, setEquipmentId] = useState(editingItem?.id || '');
  const [filteredEquipments, setFilteredEquipments] = useState(equipments);
  const [showEquipDropdown, setShowEquipDropdown] = useState(false);

  const [readingMeterUom, setReadingMeterUom] = useState('');
  const [readingMeterNo, setReadingMeterNo] = useState('');

  const [unitRate, setUnitRate] = useState('');
  const [totalValue, SetTotalValue] = useState('');

  useEffect(() => {
    const qtyNumber = parseFloat(qty || '0');
    const rateNumber = parseFloat(unitRate || '0');
    const total = qtyNumber * rateNumber;

    SetTotalValue(total ? total.toFixed(2).toString() : '0.00');
  }, [qty, unitRate]);

  const handleItemChange = (text: string) => {
    setItem(text);
    setQty('');
    setdescription('');
    setUom('');
    setUomId('');
    if (text.length > 0) {
      const matches = consumabaleItems.filter(d =>
        d.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredItems(matches);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleItemSelect = (selectedItem: any) => {
    console.log('Selected item:', selectedItem);
    setitemId(selectedItem.id);
    setItem(selectedItem.name);
    setQty(selectedItem.qty || '');
    setdescription(selectedItem.description || '');
    setUom(selectedItem.uom);
    setUomId(selectedItem.uomId);
    setShowDropdown(false);
  };

  const handleEquipChange = (text: string) => {
    setEquipment(text);
    if (text.length > 0) {
      const matches = equipments.filter(e =>
        e.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredEquipments(matches);
      setShowEquipDropdown(true);
    } else {
      setShowEquipDropdown(false);
    }
  };

  const handleEquipSelect = (equip: any) => {
    console.log(equip);
    setEquipment(equip?.name);
    setEquipmentId(equip.id);
    setShowEquipDropdown(false);
  };

  const handleSave = () => {
    if (!item || !qty) {
      Alert.alert('Item name and quantity are required.');
      return;
    }

    const newItem: any = {
      equipment: equipmentId,
      id: editingItem?.id ?? itemId,
      name: item,
      qty,
      description,
      uom,
      uomId,
    };

    if (targetScreen === 'CreateConsumption') {
      newItem.equipment = equipmentId;
      if (item.toLowerCase() === 'diesel') {
        newItem.readingMeterUom = readingMeterUom;
        newItem.readingMeterNo = readingMeterNo;
      }
    }

    let updatedItems: any[] = [];

    if (editingIndex !== null && editingIndex >= 0) {
      updatedItems = [...(route.params?.existingItems || [])];
      updatedItems[editingIndex] = newItem;
    } else {
      console.log('here ', newItem);
      updatedItems = [...(route.params?.existingItems || []), newItem];
    }
    console.log(updatedItems, " ooosossosososooosos ")
    navigation.navigate(targetScreen, {updatedItems});

    setItem('');
    setQty('');
    setdescription('');
    setUom('');
    setUomId('');
    setEquipment('');
    setReadingMeterUom('');
    setReadingMeterNo('');
    setShowDropdown(false);
  };

  useEffect(() => {
    getConsumableItems();
    getEquipments();
    console.log('Consumable items fetched:', consumabaleItems, equipments);
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{flex: 1}}>
      {loading ? (
      <ActivityIndicator size={'large'} style={{marginTop: '50%'}} color="#007AFF"/>
      ) : (
        <ScrollView
          style={styles.container}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{paddingBottom: 40}}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{padding: 10, marginLeft: -10}}>
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
              }}>
              <Text style={{color: 'white', fontSize: 16, fontWeight: '600'}}>
                Save
              </Text>
            </TouchableOpacity>
          </View>

          {/* Equipment input (only for CreateConsumption) */}
          {(targetScreen === 'CreateConsumption' ||
            targetScreen === 'CreateEquipmentIn' ||
            targetScreen === 'CreateEquipmentOut') && (
            <>
              <Text style={[styles.label]}>Equipment</Text>
              <TextInput
                style={[styles.input, {marginBottom: 8}]}
                placeholder="Start typing to select Equipment"
                placeholderTextColor="#A0A0A0"
                value={equipment}
                onChangeText={handleEquipChange}
              />
              {showEquipDropdown && (
                <FlatList
                  data={filteredEquipments}
                  keyExtractor={item => item.name}
                  style={styles.dropdown}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => handleEquipSelect(item)}>
                      <Text>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
              )}
            </>
          )}

          {targetScreen !== 'CreateEquipmentIn' &&
            targetScreen !== 'CreateEquipmentOut' && (
              <>
                <Text style={styles.label}>Item</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Start typing to select an Item"
                    placeholderTextColor="#A0A0A0"
                    value={item}
                    onChangeText={handleItemChange}
                  />
                </View>
                {showDropdown && (
                  <FlatList
                    data={filteredItems}
                    keyExtractor={item => item.name}
                    style={styles.dropdown}
                    renderItem={({item}) => (
                      <TouchableOpacity
                        style={styles.dropdownItem}
                        onPress={() => handleItemSelect(item)}>
                        <Text>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                  />
                )}
              </>
            )}

          {/* Quantity */}
          <Text style={[styles.label, {marginTop: 8}]}>
            Quantity <Text style={{color: 'red'}}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter quantity"
            placeholderTextColor="#A0A0A0"
            value={qty}
            onChangeText={setQty}
            keyboardType="numeric"
          />

          {/* UOM */}
          <Text style={[styles.label, {marginTop: 8}]}>UOM</Text>
          <TextInput
            style={styles.input}
            value={uom}
            placeholder="Unit of measurement"
            placeholderTextColor="#A0A0A0"
            onChangeText={setUom}
            editable={false}
          />

          {/* Diesel-specific fields */}
          {targetScreen === 'CreateConsumption' &&
            item.toLowerCase() === 'diesel' && (
              <>
                <Text style={[styles.label, {marginTop: 8}]}>
                  Reading Meter UOM
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter reading meter UOM"
                  placeholderTextColor="#A0A0A0"
                  value={readingMeterUom}
                  onChangeText={setReadingMeterUom}
                />

                <Text style={[styles.label, {marginTop: 8}]}>
                  Reading Meter No
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter reading meter number"
                  placeholderTextColor="#A0A0A0"
                  value={readingMeterNo}
                  onChangeText={setReadingMeterNo}
                  keyboardType="numeric"
                />
              </>
            )}

          {targetScreen === 'CreateDieselInvoice' && (
            <>
              <Text style={[styles.label, {marginTop: 8}]}>Unit Rate</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter reading meter UOM"
                placeholderTextColor="#A0A0A0"
                value={unitRate}
                onChangeText={setUnitRate}
              />

              <Text style={[styles.label, {marginTop: 8}]}>Total Value</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter reading meter number"
                placeholderTextColor="#A0A0A0"
                value={totalValue}
                onChangeText={SetTotalValue}
                keyboardType="numeric"
                editable={false}
              />
            </>
          )}

          {/* Notes */}
          <Text style={[styles.label, {marginTop: 8}]}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter notes"
            placeholderTextColor="#A0A0A0"
            value={description}
            onChangeText={setdescription}
            multiline
            numberOfLines={4}
          />
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
};

export default AddItem;
