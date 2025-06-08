import React from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {styles} from '../styles/Mechanic/RequisitionStyles';

type RequisitionType = 'requisition' | 'receipt';

type RequisitionItem = {
  id: string;
  mechanicName?: string;
  date: string;
  time: string;
  type: RequisitionType;
  items: {
    item: string;
    quantity: number;
    uom: string;
    notes: string;
  }[];
};

export const RenderRequisitionOrReceiptItem = ({
  item,
}: {
  item: RequisitionItem;
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          {item?.mechanicName && (
            <Text style={styles.date}>Mechanic name : {item.mechanicName}</Text>
          )}

          <Text style={styles.date}>Date : {item.date}</Text>
          <Text style={styles.itemCount}>
            Total No. of Items : {item.items.length}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={
            () => {}
            // navigation.navigate('ViewItems', {
            //   document: item,
            //   ScreenType:
            //     route.name === 'Requisition' ? 'requisition' : 'receipt',
            // })
          }>
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
