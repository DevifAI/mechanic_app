import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ForgotPassword = () => {
  const navigation = useNavigation<any>();

  const [userId, setUserId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^[6-9]\d{9}$/; // Validates Indian 10-digit numbers starting with 6-9
    return phoneRegex.test(phone);
  };

  const handleContinue = () => {
    if (!userId || !phoneNumber) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setPhoneError('Enter a valid 10-digit Indian phone number starting with 6–9');
      Alert.alert('Invalid Phone Number', 'Please enter a valid 10-digit phone number.');
      return;
    }

    setPhoneError('');
    navigation.navigate('OtpVerification', {
      userId,
      phoneNumber,
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Back Button using MaterialIcons */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <View style={styles.backIconContainer}>
            <MaterialIcons name="keyboard-arrow-left" size={28} color="#000" />
          </View>
        </TouchableOpacity>

        {/* Top Image */}
        <Image
          source={require('../../assets/ForgotPassword.png')}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.title}>Forgot Password</Text>

        <Text style={styles.description}>
          In id cursus mi pretium tellus duis convallis.
          {"\n"}
          Tempus leo eu aenean urna tempor.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter User ID"
          placeholderTextColor="#999"
          value={userId}
          onChangeText={setUserId}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter Phone Number"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          maxLength={10}
          value={phoneNumber}
          onChangeText={(text) => {
            const filtered = text.replace(/[^0-9]/g, '').slice(0, 10);
            setPhoneNumber(filtered);
          }}
        />

        {phoneError ? (
          <Text style={styles.errorText}>{phoneError}</Text>
        ) : null}

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  backIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 180,
    alignSelf: 'center',
    marginBottom: 24,
    marginTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    lineHeight: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    fontSize: 16,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 48,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 16,
    marginLeft: 8,
  },
  continueButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ForgotPassword;
