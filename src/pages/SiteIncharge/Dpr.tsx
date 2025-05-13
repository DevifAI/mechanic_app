import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { styles } from "../../styles/SiteInCharge/DprStyles"
const { width, height } = Dimensions.get('window');

// Responsive units
const scale = width / 375; // base width for design
const fontScale = height / 812; // base height

export default function DPRScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity  onPress={() => navigation.goBack()}>
                         <View style={styles.backIconContainer}>
                           <MaterialIcons name="keyboard-arrow-left" size={28} color="#000" />
                         </View>
                       </TouchableOpacity>
        <Text style={styles.headerTitle}>DPR</Text>
        <TouchableOpacity>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Info */}

     <View style={styles.cardContainer}>
  <TouchableOpacity style={styles.userRow}>
    <Text style={styles.userText}>G8sanju1982</Text>
    <Ionicons name="chevron-forward-outline" size={18 * scale} color="#000" />
  </TouchableOpacity>

  <View style={styles.divider} />

  <View style={styles.labelBlock}>
    {['DPR No.', 'Shift Code:', 'Shift Time:', 'Date'].map((label, idx) => (
      <Text key={idx} style={styles.labelText}>{label}</Text>
    ))}
  </View>
</View>

<View style={{ marginBottom: 12, marginTop: 20 ,  paddingHorizontal: 16, }}>
    <Text style={{fontWeight: 'bold' , fontSize: 16}}>Lorem Ipsum </Text>
</View>
        {/* Section - Daily Rig Cost */}
        <View style={styles.cardContainer}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Daily Rig Cost</Text>
            <View style={styles.rightAligned}>
              <Text style={styles.amountText}>₹86633</Text>
              <Text style={styles.subText}>In id cursus mi</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.addRow}>
            <Ionicons name="add-circle-outline" size={24 * scale} color="#1271EE" />
            <Text style={styles.addText}>Lorem Ipsum</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.costBlock}>
            <Text style={styles.sectionTitle}>Daily Rig Cost</Text>
            {[ 'R1:', 'R2:', 'R2_CSL:', 'R2_CD:', 'R3:', 'FM:', 'RO:', 'ILM:', 'IPM:', 'ILM/IPM COST:' ].map((item, idx) => (
              <View key={idx} style={styles.costRow}>
                <Text style={styles.labelText2}>{item}</Text>
                <Text style={styles.labelText2}>00</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.editRow}>
              <Text style={styles.editText}>Edit</Text>
              <Ionicons name="chevron-forward-outline" size={16 * scale} color="#1271EE" />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={[styles.labelText, { fontWeight: '600' }]}>Total (INR)</Text>
            <Text style={[styles.amountText, { fontWeight: '600' }]}>₹86633</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}


