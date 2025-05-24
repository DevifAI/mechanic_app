import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

import { styles } from "../../styles/Mechanic/AddItemsStyles";

const dummyJobTags = [
  { name: 'Maintenance' },
  { name: 'Repair' },
  { name: 'Inspection' },
  { name: 'Cleaning' },
];

const dummyRevenueCodes = [
  { code: 'RC001', name: 'General Maintenance' },
  { code: 'RC002', name: 'Emergency Repair' },
  { code: 'RC003', name: 'Scheduled Inspection' },
];

const DPRSubform = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const editingItem = route.params?.item || null;
  const editingIndex = route.params?.index ?? null;
//   const targetScreen = route.params?.targetScreen || 'CreateRequisition';

  // States for time inputs as strings
  const [timeFrom, setTimeFrom] = useState(editingItem?.timeFrom || '');
  const [timeTo, setTimeTo] = useState(editingItem?.timeTo || '');
  const [jobDone, setJobDone] = useState(editingItem?.jobDone || '');
  const [jobTag, setJobTag] = useState(editingItem?.jobTag || '');
  const [filteredJobTags, setFilteredJobTags] = useState(dummyJobTags);
  const [showJobTagDropdown, setShowJobTagDropdown] = useState(false);

  const [revenueCode, setRevenueCode] = useState(editingItem?.revenueCode || '');
  const [filteredRevenueCodes, setFilteredRevenueCodes] = useState(dummyRevenueCodes);
  const [showRevenueCodeDropdown, setShowRevenueCodeDropdown] = useState(false);

  // States for DateTimePicker visibility
  const [showTimeFromPicker, setShowTimeFromPicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false); // renamed from showEndTimePicker

  // Helper: Convert "HH:mm" string to Date object for DateTimePicker
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

  // Calculate time difference between timeFrom and timeTo, format as "Xh Ym"
const calculateTimeTotal = () => {
  if (!timeFrom || !timeTo) return '';

  const parseToMinutes = (timeStr: string) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    return hours * 60 + minutes;
  };

  const startMinutes = parseToMinutes(timeFrom);
  const endMinutes = parseToMinutes(timeTo);

  if (isNaN(startMinutes) || isNaN(endMinutes)) return '';

  let diff = endMinutes - startMinutes;
  if (diff < 0) diff += 24 * 60; // handle overnight shift

  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;

  return `${hours} hours ${minutes} minutes`;
};


  // Handlers for Job Tag input & selection
  const handleJobTagChange = (text: string) => {
    setJobTag(text);
    if (text.length > 0) {
      const matches = dummyJobTags.filter((jt) =>
        jt.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredJobTags(matches);
      setShowJobTagDropdown(true);
    } else {
      setShowJobTagDropdown(false);
    }
  };
  const handleJobTagSelect = (tag: any) => {
    setJobTag(tag.name);
    setShowJobTagDropdown(false);
  };

  // Handlers for Revenue Code input & selection
  const handleRevenueCodeChange = (text: string) => {
    setRevenueCode(text);
    if (text.length > 0) {
      const matches = dummyRevenueCodes.filter((rc) =>
        rc.code.toLowerCase().includes(text.toLowerCase()) || rc.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredRevenueCodes(matches);
      setShowRevenueCodeDropdown(true);
    } else {
      setShowRevenueCodeDropdown(false);
    }
  };
  const handleRevenueCodeSelect = (rc: any) => {
    setRevenueCode(rc.code);
    setShowRevenueCodeDropdown(false);
  };

  // Save handler
  const handleSave = () => {
    if (!timeFrom || !timeTo || !jobDone || !jobTag || !revenueCode) {
      Alert.alert('Please fill all required fields.');
      return;
    }

    const newItem: any = {
      id: editingItem?.id || Date.now(),
      timeFrom,
      timeTo,
      timeTotal: calculateTimeTotal(),
      jobDone,
      jobTag,
      revenueCode,
    };

    let updatedItems: any[] = [];

    if (editingIndex !== null && editingIndex >= 0) {
      updatedItems = [...(route.params?.existingItems || [])];
      updatedItems[editingIndex] = newItem;
      console.log(newItem)
    } else {
      updatedItems = [...(route.params?.existingItems || []), newItem];
    }

    navigation.navigate('CreateDPR', { updatedItems });

    // Reset fields
    setTimeFrom('');
    setTimeTo('');
    setJobDone('');
    setJobTag('');
    setRevenueCode('');
    setShowJobTagDropdown(false);
    setShowRevenueCodeDropdown(false);
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
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10, marginLeft: -10 }}>
            <Icon name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {editingItem ? 'Edit Job' : 'Add Job'}
          </Text>
          <TouchableOpacity onPress={handleSave} style={{
            backgroundColor: '#007AFF',
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 6,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
              Save
            </Text>
          </TouchableOpacity>
        </View>

        {/* Time From */}
        <Text style={styles.label}>Time From</Text>
        <TouchableOpacity
          onPress={() => setShowTimeFromPicker(true)}
          style={[styles.input, { justifyContent: 'center' }]}
        >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: timeFrom ? '#000' : '#A0A0A0' }}>
            {timeFrom || 'Select time from'}
          </Text>
          <Icon name="access-time" size={22} color="#000" />
            </View>
        </TouchableOpacity>
        {showTimeFromPicker && (
          <DateTimePicker
            value={timeFrom ? parseTimeToDate(timeFrom) : new Date()}
           mode="time"
           is24Hour={false}
           display="spinner"
            onChange={(event, selectedTime) => {
              setShowTimeFromPicker(false);
              if (selectedTime) {
                setTimeFrom(formatTime(selectedTime));
              }
            }}
          />
        )}

        {/* Time To */}
       <Text style={[styles.label, { marginTop: 8 }]}>Time To</Text>
<TouchableOpacity
  onPress={() => setShowStartTimePicker(true)} // Shows the "Time To" picker
  style={[styles.input, { justifyContent: 'center' }]}
>
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
    <Text style={{ fontSize: 16, color: timeTo ? '#000' : '#A0A0A0' }}>
      {timeTo || 'Select time to'}
    </Text>
    <Icon name="access-time" size={22} color="#000" />
  </View>
</TouchableOpacity>

{showStartTimePicker && (
  <DateTimePicker
    value={timeTo ? parseTimeToDate(timeTo) : new Date()}
    mode="time"
    is24Hour={false}
    display={'spinner'} // 👈 platform-specific display
    onChange={(event, selectedTime) => {
      setShowStartTimePicker(false);
      if (selectedTime) {
        setTimeTo(formatTime(selectedTime));
      }
    }}
  />
)}


        {/* Time Total */}
        <Text style={[styles.label, { marginTop: 8 }]}>Time Total</Text>
        <TextInput
          style={styles.input}
          value={calculateTimeTotal()}
          editable={false}
          placeholder="Time Total"
          placeholderTextColor="#A0A0A0"
        />

        {/* Job Done */}
        <Text style={[styles.label, { marginTop: 8 }]}>Job Done</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe the job done"
          placeholderTextColor="#A0A0A0"
          value={jobDone}
          onChangeText={setJobDone}
          multiline
          numberOfLines={4}
        />

        {/* Job Tag */}
        <Text style={[styles.label, { marginTop: 8 }]}>Job Tag</Text>
        <TextInput
          style={styles.input}
          placeholder="Start typing to select a Job Tag"
          placeholderTextColor="#A0A0A0"
          value={jobTag}
          onChangeText={handleJobTagChange}
        />
        {showJobTagDropdown && (
          <FlatList
            data={filteredJobTags}
            keyExtractor={(item) => item.name}
            style={styles.dropdown}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleJobTagSelect(item)}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        {/* Revenue Code */}
        <Text style={[styles.label, { marginTop: 8 }]}>Revenue Code</Text>
        <TextInput
          style={styles.input}
          placeholder="Start typing to select a Revenue Code"
          placeholderTextColor="#A0A0A0"
          value={revenueCode}
          onChangeText={handleRevenueCodeChange}
        />
        {showRevenueCodeDropdown && (
          <FlatList
            data={filteredRevenueCodes}
            keyExtractor={(item) => item.code}
            style={styles.dropdown}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleRevenueCodeSelect(item)}
              >
                <Text>{item.code} - {item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default DPRSubform;
