import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useRoute, useIsFocused} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import {styles} from '../../styles/Mechanic/CreateRequisitionStyles';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import useDPR from '../../hooks/useDPR';

type DPRSubformItem = {
  id: string;
  timeFrom: string;
  timeTo: string;
  timeTotal?: string;
  jobDone: string;
  jobTag: string;
  revenueCode: string;
};

const CreateDPR = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const isFocused = useIsFocused();

  const [items, setItems] = useState<DPRSubformItem[]>([]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {projectId} = useSelector((state: RootState) => state.auth);

  const {createDPRByRole, loading} = useDPR();

  const [dprNo, setDprNo] = useState(uuid.v4());
  const [customerRep, setCustomerRep] = useState('');
  const [shiftCode, setShiftCode] = useState('');
  const [filteredShiftCodes, setFilteredShiftCodes] = useState<string[]>([]);
  const [showShiftDropdown, setShowShiftDropdown] = useState(false);
  const [shiftStartTime, setShiftStartTime] = useState('');
  const [shiftEndTime, setShiftEndTime] = useState('');
  const [shiftIncharge, setShiftIncharge] = useState('');
  const [shiftMechanic, setShiftMechanic] = useState('');
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const dummyShiftCodes = [
    'ShiftM-101',
    'ShiftM-102',
    'ShiftA-201',
    'ShiftB-301',
  ];

  useEffect(() => {
    const mergeItems = async () => {
      if (isFocused && route.params?.updatedItems) {
        const newItems: DPRSubformItem[] = route.params.updatedItems;

        try {
          const stored = await AsyncStorage.getItem('DPRItems');
          const parsedStored: DPRSubformItem[] = stored
            ? JSON.parse(stored)
            : [];
          const merged = [...parsedStored];

          newItems.forEach((newItem: DPRSubformItem) => {
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
          await AsyncStorage.setItem('DPRItems', JSON.stringify(merged));
          navigation.setParams({updatedItems: undefined});
        } catch (err) {
          console.error('Failed to merge items:', err);
        }
      }
    };

    mergeItems();
  }, [isFocused, route.params?.updatedItems]);

  const onChangeDate = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  // Converts 'hh:mm AM/PM' string to Date object (today's date with that time)
  const parseTimeToDate = (timeStr: string) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  // Formats Date object to 'hh:mm AM/PM' string
  const formatTime = (date: Date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours || 12; // the hour '0' should be '12'

    const strMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${strMinutes} ${ampm}`;
  };

  const handleSave = async () => {
    if (
      !date ||
      !dprNo ||
      !customerRep ||
      !shiftCode ||
      !shiftStartTime ||
      !shiftEndTime ||
      !shiftIncharge ||
      !shiftMechanic
    ) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const payload: any = {
      date: date.toLocaleDateString('en-GB'),
      dpr_no: dprNo,
      project_id: projectId,
      customer_representative: customerRep,
      shift_code: shiftCode,
      shift_incharge: shiftIncharge,
      shift_mechanic: shiftMechanic,

      forms: items.map(item => ({
        time_from: item.timeFrom,
        time_to: item.timeTo,
        time_total: item.timeTotal,
        job_done: item.jobDone,
        // job_tag: item.jobTag,
        revenue_code: item.revenueCode,
      })),
    };

    await createDPRByRole(payload);
    console.log('Saving DPR:', payload);

    try {
      await AsyncStorage.removeItem('DPRItems');
      setItems([]);
      navigation.navigate('MainTabs', {screen: 'DPR'});
    } catch (err) {
      console.error('Error saving DPR:', err);
    }
  };

  const confirmDelete = async (id: string) => {
    Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const storedItems = await AsyncStorage.getItem('DPRItems');
          const parsedItems: DPRSubformItem[] = storedItems
            ? JSON.parse(storedItems)
            : [];
          const updatedItems = parsedItems.filter(item => item.id !== id);
          await AsyncStorage.setItem('DPRItems', JSON.stringify(updatedItems));
          setItems(updatedItems);
        },
      },
    ]);
  };

  const renderItem = ({item}: {item: DPRSubformItem}) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <TouchableOpacity
          onPress={() => confirmDelete(item.id)}
          style={styles.deleteIcon}>
          <Icon name="close-circle-outline" size={24} color="#d11a2a" />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          }}
          onPress={() =>
            navigation.navigate('DPRSubform', {
              item,
              existingItems: items,
            })
          }>
          <View style={styles.leftSection}>
            <Text style={styles.itemName}>{item.jobTag}</Text>
            <Text style={styles.itemSub}>Total Time: {item.timeTotal}</Text>
          </View>

          {/* <View style={styles.leftSection}>
            <Text style={styles.itemName}>{item.jobTag}</Text>
            <Text style={styles.itemSub}>Total Time: {item.timeTotal}</Text>
          </View> */}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{flex: 1}}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{paddingBottom: 40}}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('MainTabs', {screen: 'DprScreen'})
            }
            style={{padding: 10, marginLeft: -10}}>
            <Icon name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Create DPR</Text>

          <TouchableOpacity
            onPress={handleSave}
            disabled={loading}
            style={{
              backgroundColor: '#007AFF',
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 6,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {loading && <ActivityIndicator size="small" color="#fff" />}
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
          {/* Label */}
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

        <Text style={styles.label}>DPR No.</Text>
        <TextInput
          style={styles.input}
          value={dprNo}
          onChangeText={text => setDprNo(text)}
          editable={true}
        />

        <Text style={styles.label}>Customer Representative</Text>
        <TextInput
          placeholder="Enter Customer Representative "
          placeholderTextColor="#A0A0A0"
          style={styles.input}
          value={customerRep}
          onChangeText={setCustomerRep}
        />

        <Text style={styles.label}>Shift Code</Text>
        <TextInput
          style={styles.input}
          placeholder="Start typing to select a Shift Code"
          placeholderTextColor="#A0A0A0"
          value={shiftCode}
          onChangeText={text => {
            setShiftCode(text);
            setShowShiftDropdown(true);
            setFilteredShiftCodes(
              dummyShiftCodes.filter(code =>
                code.toLowerCase().includes(text.toLowerCase()),
              ),
            );
          }}
        />

        {showShiftDropdown && (
          <FlatList
            data={filteredShiftCodes}
            keyExtractor={item => item}
            style={styles.dropdown}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setShiftCode(item);
                  setShowShiftDropdown(false);
                }}>
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        <TouchableOpacity
          onPress={() => setShowStartTimePicker(true)}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: '#ccc',
            paddingVertical: 6,
            marginBottom: 8,
          }}>
          {/* Label */}
          <Text
            style={{
              color: '#007AFF',
              fontWeight: 'bold',
              marginBottom: 12,
              fontSize: 16,
            }}>
            Shift Start Time <Text style={{color: 'red', fontSize: 16}}>*</Text>
          </Text>

          {/* Time + Icon */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 16,
                color: shiftStartTime ? '#000' : '#A0A0A0',
              }}>
              {shiftStartTime || 'Select start time'}
            </Text>
            <Icon name="time-outline" size={22} color="#000" />
          </View>
        </TouchableOpacity>

        {showStartTimePicker && (
          <DateTimePicker
            value={
              shiftStartTime ? parseTimeToDate(shiftStartTime) : new Date()
            }
            mode="time"
            is24Hour={false}
            display="spinner"
            onChange={(event, selectedTime) => {
              setShowStartTimePicker(false);
              if (selectedTime) {
                setShiftStartTime(formatTime(selectedTime));
              }
            }}
          />
        )}

        <TouchableOpacity
          onPress={() => setShowEndTimePicker(true)}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: '#ccc',
            paddingVertical: 6,
            marginBottom: 8,
          }}>
          {/* Label */}
          <Text
            style={{
              color: '#007AFF',
              fontWeight: 'bold',
              marginBottom: 8,
              fontSize: 16,
            }}>
            Shift End Time <Text style={{color: 'red', fontSize: 16}}>*</Text>
          </Text>

          {/* Time + Icon */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{fontSize: 16, color: shiftEndTime ? '#000' : '#A0A0A0'}}>
              {shiftEndTime || 'Select end time'}
            </Text>
            <Icon name="time-outline" size={22} color="#000" />
          </View>
        </TouchableOpacity>

        {showEndTimePicker && (
          <DateTimePicker
            value={shiftEndTime ? parseTimeToDate(shiftEndTime) : new Date()}
            mode="time"
            is24Hour={false}
            display="spinner"
            onChange={(event, selectedTime) => {
              setShowEndTimePicker(false);
              if (selectedTime) {
                setShiftEndTime(formatTime(selectedTime));
              }
            }}
          />
        )}

        <Text style={styles.label}>Shift Incharge</Text>
        <TextInput
          placeholder="Enter Shift Incharge"
          placeholderTextColor="#A0A0A0"
          style={styles.input}
          value={shiftIncharge}
          onChangeText={setShiftIncharge}
        />

        <Text style={styles.label}>Shift Mechanic</Text>
        <TextInput
          placeholder="Enter Shift Mechanic"
          placeholderTextColor="#A0A0A0"
          style={styles.input}
          value={shiftMechanic}
          onChangeText={setShiftMechanic}
        />

        <TouchableOpacity
          style={[styles.addButton, {marginTop: 24}]}
          onPress={() =>
            navigation.navigate('DPRSubform', {
              existingItems: items,
            })
          }>
          <Icon name="add-circle-outline" size={24} color="#1271EE" />
          <Text style={styles.addButtonText}>Add Jobs</Text>
        </TouchableOpacity>

        {items.length > 0 && (
          <View style={styles.headerRow}>
            <Text style={styles.headerText}>Added Items</Text>
          </View>
        )}

        <FlatList
          data={items}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{marginTop: 10, paddingBottom: 10}}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateDPR;
