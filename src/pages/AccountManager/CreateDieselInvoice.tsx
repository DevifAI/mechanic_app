import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, Alert, Platform,
  KeyboardAvoidingView, ScrollView,
  SafeAreaView
} from 'react-native';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from "../../styles/Mechanic/CreateRequisitionStyles";

type DieselInvoiceItem = {
  description: any;
  id: string;
  uom: string;
  uomId: string;
  name: string;
  qty: number;
};

const CreateDieselInvoice = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const isFocused = useIsFocused();

  const [items, setItems] = useState<DieselInvoiceItem[]>([]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const mergeItems = async () => {
      if (isFocused && route.params?.updatedItems) {
        const newItems = route.params.updatedItems;

        try {
          const stored = await AsyncStorage.getItem('dieselInvoiceItems');
          const parsedStored: DieselInvoiceItem[] = stored ? JSON.parse(stored) : [];

          const merged = [...parsedStored];

          newItems.forEach((newItem: DieselInvoiceItem) => {
            const existingIndex = merged.findIndex(item => item.id === newItem.id);

            if (existingIndex !== -1) {
              merged[existingIndex] = newItem;
            } else {
              merged.push(newItem);
            }
          });

          setItems(merged);
          await AsyncStorage.setItem('dieselInvoiceItems', JSON.stringify(merged));
          navigation.setParams({ updatedItems: undefined });
        } catch (err) {
          console.error('Failed to merge diesel invoice items:', err);
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
      console.log('Saving diesel invoice items:', items);

      await AsyncStorage.removeItem('dieselInvoiceItems');
      setItems([]);

      navigation.navigate('MainTabs', {
        screen: 'DieselInvoice',
      });
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
              const storedItems = await AsyncStorage.getItem('dieselInvoiceItems');
              const parsedItems = storedItems ? JSON.parse(storedItems) : [];

              const updatedItems = parsedItems.filter((item: any) => item.id !== id);

              await AsyncStorage.setItem('dieselInvoiceItems', JSON.stringify(updatedItems));
              setItems(updatedItems);
            } catch (error) {
              console.error('Error deleting diesel invoice item:', error);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item, index }: { item: DieselInvoiceItem; index: number }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <TouchableOpacity onPress={() => confirmDelete(item.id)} style={styles.deleteIcon}>
          <Icon name="close-circle-outline" size={24} color="#d11a2a" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.itemInfo}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('AddItem', {
              item,
              index,
              existingItems: items,
              targetScreen: 'CreateDieselInvoice',
            })
          }
        >
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
      style={{ flex: 1 }}
    >
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('MainTabs', {
                screen: 'DieselInvoice',
              })
            }
            style={{ padding: 10, marginLeft: -10 }}
          >
            <Icon name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Create Diesel Invoice</Text>

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

        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: '#ccc',
            paddingVertical: 6,
            marginBottom: 24,
          }}
        >
          <Text style={{ color: '#007AFF', fontWeight: 'bold', marginBottom: 6, fontSize: 16 }}>
            Date <Text style={{ color: 'red', fontSize: 16 }}>*</Text>
          </Text>

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

        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            navigation.navigate('AddItem', {
              existingItems: items,
              targetScreen: 'CreateDieselInvoice',
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

        <FlatList
          data={items}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ marginTop: 10, paddingBottom: 10 }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateDieselInvoice;
