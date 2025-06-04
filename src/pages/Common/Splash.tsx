import React from 'react';
import {View, Text, StyleSheet, StatusBar} from 'react-native';

const Splash = () => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#007AFF" barStyle="light-content" />
      <Text style={styles.logoText}>Mechanic App</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Splash;
