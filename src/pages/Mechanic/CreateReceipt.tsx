import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { styles } from "../../styles/Mechanic/CreateRequisitionStyles"
import { useNavigation } from '@react-navigation/native';

const CreateReceipt = () => {
  const [date, setDate] = useState('05/05/25');
  const [notes, setNotes] = useState('');
  const navigation = useNavigation<any>();

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
        <TouchableOpacity style={styles.row}>
          <Text style={styles.label}>Date</Text>
          <View style={styles.rowRight}>
            <Text style={styles.value}>{date}</Text>
            <Icon name="chevron-forward" size={18} color="#000" />
          </View>
        </TouchableOpacity>

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

export default CreateReceipt;
  