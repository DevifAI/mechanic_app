import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
// Adjust path as needed

const { width } = Dimensions.get('window');

const DoneScreen = () => {
  const navigation = useNavigation<any>();
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Scale up animation
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // Navigate after 2 seconds
    const timer = setTimeout(() => {
      navigation.navigate('MainTabs');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.circle,
          {
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
        <Icon name="check" size={width * 0.3} color="#fff" />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    backgroundColor: '#1473e6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});

export default DoneScreen;