import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {styles} from '../../styles/Mechanic/AddItemsStyles';
import useSuperadmin from '../../hooks/useSuperadmin';

type ConsumableItem = {
  id: string;
  name: string;
  qty?: string;
  description?: string;
  uom: string;
  uomId: string;
};

type EquipmentItem = {
  id: string;
  name: string;
};

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
  const [description, setdescription] = useState(editingItem?.description || '');
  const [uom, setUom] = useState(editingItem?.uom || '');
  const [uomId, setUomId] = useState(editingItem?.uomId || '');
  const [filteredItems, setFilteredItems] = useState<ConsumableItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [equipment, setEquipment] = useState(editingItem?.equipment || '');
  const [equipmentId, setEquipmentId] = useState(editingItem?.equipmentId || '');
  const [filteredEquipments, setFilteredEquipments] = useState<EquipmentItem[]>([]);
  const [showEquipDropdown, setShowEquipDropdown] = useState(false);

  const [readingMeterUom, setReadingMeterUom] = useState('');
  const [readingMeterNo, setReadingMeterNo] = useState('');
  const [unitRate, setUnitRate] = useState('');
  const [totalValue, SetTotalValue] = useState('');

  useEffect(() => {
    getConsumableItems();
    getEquipments();
  }, []);

  useEffect(() => {
    setFilteredItems(consumabaleItems);
    setFilteredEquipments(equipments);
  }, [consumabaleItems, equipments]);

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
    setShowEquipDropdown(false);

    const matches = consumabaleItems.filter(d =>
      d.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredItems(matches);
    setShowDropdown(true);
  };

  const handleItemSelect = (selectedItem: ConsumableItem) => {
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
    setShowDropdown(false);

    const matches = equipments.filter(e =>
      e.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredEquipments(matches);
    setShowEquipDropdown(matches.length > 0);
  };

  const handleEquipSelect = (equip: EquipmentItem) => {
    setEquipment(equip.name);
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
      updatedItems = [...(route.params?.existingItems || []), newItem];
    }

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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{flex: 1}}>
      {loading ? (
        <ActivityIndicator
          size={'large'}
          style={{marginTop: '50%'}}
          color="#007AFF"
        />
      ) : (
        <ScrollView
          style={styles.container}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{paddingBottom: 40}}>
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
              }}>
              <Text style={{color: 'white', fontSize: 16, fontWeight: '600'}}>
                Save
              </Text>
            </TouchableOpacity>
          </View>

          {/* Equipment Field - CreateConsumption only */}
          {targetScreen === 'CreateConsumption' && (
            <>
              <Text style={[styles.label]}>Equipment</Text>
              <TextInput
                style={[styles.input, {marginBottom: 8}]}
                placeholder="Start typing to select Equipment"
                placeholderTextColor="#A0A0A0"
                value={equipment}
                onChangeText={handleEquipChange}
                onFocus={() => {
                  setShowDropdown(false);
                  if (equipment.length === 0) {
                    setFilteredEquipments(equipments);
                    setShowEquipDropdown(equipments.length > 0);
                  }
                }}
              />
              {showEquipDropdown && filteredEquipments.length > 0 && (
                <FlatList
                  data={filteredEquipments}
                  keyExtractor={item => item.id}
                  style={styles.dropdown}
                   nestedScrollEnabled
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

          {/* Item Field */}
          <Text style={styles.label}>
            {(targetScreen === 'CreateEquipmentIn' || targetScreen === 'CreateEquipmentOut')
              ? 'Equipment'
              : 'Item'}
          </Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Start typing to select an Item"
              placeholderTextColor="#A0A0A0"
              value={item}
              onChangeText={handleItemChange}
              onFocus={() => {
                setShowEquipDropdown(false);
                if (item.length === 0) {
                  setFilteredItems(consumabaleItems);
                  setShowDropdown(consumabaleItems.length > 0);
                }
              }}
            />
          </View>

          {showDropdown && filteredItems.length > 0 && (
            <FlatList
              data={filteredItems}
              keyExtractor={item => item.id}
              style={styles.dropdown}
              keyboardShouldPersistTaps="handled"
               nestedScrollEnabled
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleItemSelect(item)}>
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
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

          {/* Diesel-Specific Fields */}
          {targetScreen === 'CreateConsumption' && item.toLowerCase() === 'diesel' && (
            <>
              <Text style={[styles.label, {marginTop: 8}]}>Reading Meter UOM</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter reading meter UOM"
                placeholderTextColor="#A0A0A0"
                value={readingMeterUom}
                onChangeText={setReadingMeterUom}
              />

              <Text style={[styles.label, {marginTop: 8}]}>Reading Meter No</Text>
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

          {/* Pricing Fields for Diesel Invoice & Material Bill */}
          {(targetScreen === 'CreateDieselInvoice' ||
            targetScreen === 'CreateMaterialBill') && (
            <>
              <Text style={[styles.label, {marginTop: 8}]}>
                {targetScreen === 'CreateDieselInvoice' ? 'Unit Rate' : 'Unit Price'}
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter unit price"
                placeholderTextColor="#A0A0A0"
                value={unitRate}
                onChangeText={setUnitRate}
                keyboardType="numeric"
              />

              <Text style={[styles.label, {marginTop: 8}]}>
                {targetScreen === 'CreateDieselInvoice'
                  ? 'Total Value'
                  : 'Total Price for Line'}
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Total"
                placeholderTextColor="#A0A0A0"
                value={totalValue}
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
