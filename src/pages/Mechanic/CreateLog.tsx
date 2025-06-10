import React, {useCallback, useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useRoute, useIsFocused, useFocusEffect} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {styles} from '../../styles/Mechanic/CreateRequisitionStyles'; // Adjust path if needed
import uuid from 'react-native-uuid';
import useSuperadmin from '../../hooks/useSuperadmin';
import useMaintanance from '../../hooks/useMaintanance';

import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';

type LogItem = {
  description: any;
  id: string;
  uom: string;
  uomId: string;
  name: string;
  qty: number;
};

const FORM_DATA_KEY = 'createLog_formData';

const CreateLog = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const isFocused = useIsFocused();
  const isInitialized = useRef(false);
  const {loading, equipments, getEquipments} = useSuperadmin();
  const {createMaintananceLog} = useMaintanance();
  
  const [items, setItems] = useState<LogItem[]>([]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [nextDate, setNextDate] = useState(new Date());
  const [showNextDatePicker, setShowNextDatePicker] = useState(false);
  const [logNumber, setLogNumber] = useState('');
  const [equipment, setEquipment] = useState('');
  const [equipmentId, setEquipmentId] = useState('');
  const [filteredEquipments, setFilteredEquipments] = useState(equipments);
  const [showEquipDropdown, setShowEquipDropdown] = useState(false);
  const [note, setNote] = useState('');
  const [actionPlan, setActionPlan] = useState('');
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const {orgId, userId, projectId} = useSelector(
    (state: RootState) => state.auth,
  );

  // Save all form data to AsyncStorage
  const saveFormData = useCallback(async () => {
    if (!isDataLoaded) return; // Don't save until data is loaded
    
    try {
      const formData = {
        date: date.toISOString(),
        nextDate: nextDate.toISOString(),
        logNumber,
        equipment,
        equipmentId,
        note,
        actionPlan,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(FORM_DATA_KEY, JSON.stringify(formData));
      console.log('Form data saved successfully');
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  }, [date, nextDate, logNumber, equipment, equipmentId, note, actionPlan, isDataLoaded]);

  // Load all form data from AsyncStorage
  const loadFormData = useCallback(async () => {
    try {
      const savedData = await AsyncStorage.getItem(FORM_DATA_KEY);
      if (savedData) {
        const formData = JSON.parse(savedData);
        console.log('Loading form data:', formData);
        
        // Restore all form fields
        if (formData.date) setDate(new Date(formData.date));
        if (formData.nextDate) setNextDate(new Date(formData.nextDate));
        if (formData.logNumber) setLogNumber(formData.logNumber);
        if (formData.equipment) setEquipment(formData.equipment);
        if (formData.equipmentId) setEquipmentId(formData.equipmentId);
        if (formData.note) setNote(formData.note);
        if (formData.actionPlan) setActionPlan(formData.actionPlan);
        
        console.log('Form data loaded successfully');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error loading form data:', error);
      return false;
    }
  }, []);

  // Clear form data from AsyncStorage
  const clearFormData = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(FORM_DATA_KEY);
      console.log('Form data cleared');
    } catch (error) {
      console.error('Error clearing form data:', error);
    }
  }, []);

  // Initialize form data on first load
  useEffect(() => {
    const initializeForm = async () => {
      console.log('Initializing form...');
      
      // Try to load existing form data first
      const hasExistingData = await loadFormData();
      
      // If no existing data, generate new log number
      if (!hasExistingData) {
        const generatedId = uuid.v4();
        setLogNumber(generatedId.toString());
        console.log('Generated new log number:', generatedId);
      }
      
      // Load items from storage
      try {
        const stored = await AsyncStorage.getItem('logItems');
        if (stored) {
          const parsedItems = JSON.parse(stored);
          setItems(parsedItems);
          console.log('Loaded items:', parsedItems.length);
        }
      } catch (error) {
        console.error('Error loading items:', error);
      }
      
      // Get equipments
      await getEquipments();
      
      setIsDataLoaded(true);
      isInitialized.current = true;
      console.log('Form initialization complete');
    };

    if (!isInitialized.current) {
      initializeForm();
    }
  }, [loadFormData, getEquipments]);

  // Save form data whenever any field changes (debounced)
  useEffect(() => {
    if (isDataLoaded && isInitialized.current) {
      const timeoutId = setTimeout(() => {
        saveFormData();
      }, 500); // Debounce to avoid too many saves

      return () => clearTimeout(timeoutId);
    }
  }, [saveFormData, isDataLoaded]);

  // Handle screen focus - restore data when coming back from other screens
  useFocusEffect(
    useCallback(() => {
      console.log('Screen focused, restoring data...');
      
      const restoreData = async () => {
        // Always reload form data when screen comes into focus
        if (isInitialized.current) {
          await loadFormData();
        }
        
        // Reload items
        try {
          const stored = await AsyncStorage.getItem('logItems');
          if (stored) {
            const parsedItems = JSON.parse(stored);
            setItems(parsedItems);
            console.log('Restored items on focus:', parsedItems.length);
          }
        } catch (error) {
          console.error('Error loading items on focus:', error);
        }
      };

      if (isFocused) {
        restoreData();
      }
    }, [isFocused, loadFormData])
  );

  // Handle updated items from AddItem screen
  useEffect(() => {
    const mergeItems = async () => {
      if (isFocused && route.params?.updatedItems) {
        const newItems = route.params.updatedItems;
        console.log('Merging updated items:', newItems.length);

        try {
          const stored = await AsyncStorage.getItem('logItems');
          const parsedStored: LogItem[] = stored ? JSON.parse(stored) : [];

          const merged = [...parsedStored];
          newItems.forEach((newItem: LogItem) => {
            const existingIndex = merged.findIndex(
              item => item.id === newItem.id,
            );
            if (existingIndex !== -1) {
              merged[existingIndex] = newItem;
            } else {
              merged.push(newItem);
            }
          });

          setItems(merged);
          await AsyncStorage.setItem('logItems', JSON.stringify(merged));
          navigation.setParams({updatedItems: undefined});
          console.log('Items merged successfully');
        } catch (err) {
          console.error('Failed to merge items:', err);
        }
      }
    };

    mergeItems();
  }, [isFocused, route.params?.updatedItems, navigation]);

  const onChangeDate = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const onChangeNextDate = (_: any, selectedDate?: Date) => {
    setShowNextDatePicker(false);
    if (selectedDate) {
      setNextDate(selectedDate);
    }
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
    setEquipmentId(equip.id);
    setEquipment(equip.name);
    setShowEquipDropdown(false);
  };

  const handleSave = async () => {
    try {
      console.log('Saving log with:', {
        date,
        logNumber,
        equipment,
        note,
        nextDate,
        actionPlan,
        items,
      });
      
      if (!date || !logNumber || !equipment || !nextDate) {
        Alert.alert('Error', 'Please fill in all required fields.');
        return;
      }
      
      const data = {
        is_approve_mic: 'pending',
        is_approve_sic: 'pending',
        is_approve_pm: 'pending',
        date: date.toISOString().split('T')[0],
        notes: note,
        next_date: nextDate.toISOString().split('T')[0],
        action_planned: actionPlan,
        equipment: equipmentId,
        createdBy: userId,
        org_id: orgId,
        project_id: projectId,
        items: items.map(item => ({
          item: item.id,
          quantity: item.qty,
          uom_id: item.uomId,
          notes: item.description,
        })),
      };
      
      await createMaintananceLog(data, maintananceCreationSuccessCallback);
    } catch (err) {
      console.error('Error saving log:', err);
    }
  };

  const maintananceCreationSuccessCallback = async () => {
    try {
      // Clear all stored data after successful save
      await AsyncStorage.removeItem('logItems');
      await clearFormData();
      setItems([]);
      
      // Reset form state
      setDate(new Date());
      setNextDate(new Date());
      setLogNumber('');
      setEquipment('');
      setEquipmentId('');
      setNote('');
      setActionPlan('');
      
      navigation.navigate('MainTabs', {screen: 'Logs'});
    } catch (error) {
      console.error('Error in success callback:', error);
    }
  };

  const confirmDelete = (id: string) => {
    Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const storedItems = await AsyncStorage.getItem('logItems');
            const parsedItems = storedItems ? JSON.parse(storedItems) : [];
            const updatedItems = parsedItems.filter(
              (item: any) => item.id !== id,
            );

            await AsyncStorage.setItem(
              'logItems',
              JSON.stringify(updatedItems),
            );
            setItems(updatedItems);
          } catch (error) {
            console.error('Error deleting item:', error);
          }
        },
      },
    ]);
  };

  const renderItem = ({item}: {item: LogItem}) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <TouchableOpacity
          onPress={() => confirmDelete(item.id)}
          style={styles.deleteIcon}>
          <Icon name="close-circle-outline" size={24} color="#d11a2a" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.itemInfo}
          onPress={() =>
            navigation.navigate('AddItem', {
              item,
              existingItems: items,
              targetScreen: 'CreateLog',
            })
          }>
          <View style={styles.leftSection}>
            <Text style={styles.itemName}>{item.name}</Text>
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

  // Show loading until data is loaded
  if (!isDataLoaded) {
    return (
      <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'}}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{marginTop: 16, color: '#666'}}>Loading form data...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flexGrow: 1,
        paddingTop: 20,
        paddingBottom: 40,
        backgroundColor: '#fff',
      }}>
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
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => navigation.navigate('MainTabs', {screen: 'Log'})}
                style={{padding: 10, marginLeft: -10}}>
                <Icon name="arrow-back" size={28} color="#000" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Create Maintainance Log</Text>
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

            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={{
                borderBottomWidth: 1,
                borderBottomColor: '#ccc',
                paddingVertical: 6,
                marginBottom: 8,
              }}>
              {/* Date */}
              <Text
                style={{
                  color: '#007AFF',
                  fontWeight: 'bold',
                  marginBottom: 6,
                  fontSize: 16,
                }}>
                Date <Text style={{color: 'red', fontSize: 16}}>*</Text>
              </Text>

              {/* Date + Icon */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={{fontSize: 16, color: '#000'}}>
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

            {/* Maintenance Log Number */}
            <Text
              style={{
                color: '#007AFF',
                fontWeight: 'bold',
                marginBottom: 2,
                fontSize: 16,
              }}>
              Maintenance Log Number{' '}
              <Text style={{color: 'red', fontSize: 16}}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Maintaince Log Number"
              placeholderTextColor="#A0A0A0"
              value={logNumber}
              onChangeText={setLogNumber}
            />

            {/* Equipment */}
            <Text style={styles.label}>Equipment</Text>
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
                keyExtractor={item => item.id}
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

            {/* Note */}
            <Text style={styles.label}>Note</Text>
            <TextInput
              style={[styles.textArea, {height: 100, textAlignVertical: 'top'}]}
              multiline
              placeholder="Write notes here..."
              placeholderTextColor="#A0A0A0"
              value={note}
              onChangeText={setNote}
            />

            {/* Action Plan */}
            <Text style={styles.label}>Action Plan</Text>
            <TextInput
              style={[styles.textArea, {height: 100, textAlignVertical: 'top'}]}
              multiline
              placeholder="Enter action plan"
              placeholderTextColor="#A0A0A0"
              value={actionPlan}
              onChangeText={setActionPlan}
            />

            {/* Next Date */}
            <TouchableOpacity
              onPress={() => setShowNextDatePicker(true)}
              style={{
                borderBottomWidth: 1,
                borderBottomColor: '#ccc',
                paddingVertical: 6,
                marginBottom: 24,
              }}>
              <Text
                style={{
                  color: '#007AFF',
                  fontWeight: 'bold',
                  marginBottom: 6,
                  fontSize: 16,
                }}>
                Next Date <Text style={{color: 'red', fontSize: 16}}>*</Text>
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={{fontSize: 16, color: '#000'}}>
                  {nextDate.toLocaleDateString('en-GB')}
                </Text>
                <Icon name="calendar-outline" size={22} color="#000" />
              </View>
            </TouchableOpacity>

            {showNextDatePicker && (
              <DateTimePicker
                value={nextDate}
                mode="date"
                display="default"
                onChange={onChangeNextDate}
                minimumDate={new Date(Date.now() + 24 * 60 * 60 * 1000)} // only allow future dates
              />
            )}

            {/* Add Item */}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() =>
                navigation.navigate('AddItem', {
                  existingItems: items,
                  targetScreen: 'CreateLog',
                })
              }>
              <Icon name="add-circle-outline" size={24} color="#1271EE" />
              <Text style={styles.addButtonText}>Add Items</Text>
            </TouchableOpacity>

            {items.length > 0 && (
              <View style={styles.headerRow}>
                <Text style={styles.headerText}>Added Items</Text>
              </View>
            )}

            <FlatList
              data={items}
              keyExtractor={(_, index) => index.toString()}
              renderItem={renderItem}
              contentContainerStyle={{marginTop: 10, paddingBottom: 10}}
            />
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateLog;