import React from 'react'
import { StatusBar, StyleSheet, Text, View } from 'react-native';

const Consumption = () => {
 return (
     <View style={styles.container}>
          <StatusBar backgroundColor="#fff" barStyle="dark-content" />
       <Text style={styles.text}>Consumption</Text>
     </View>
   );
 };
 
 const styles = StyleSheet.create({
   container: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: '#fff',
   },
   text: {
     fontSize: 24,
     fontWeight: 'bold',
   },
 });

export default Consumption