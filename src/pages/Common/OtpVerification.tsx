import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';

const OtpVerification = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const phoneNumber = route.params?.phoneNumber || 'your number';

  const [otp, setOtp] = useState(['', '', '', '']);
  // Use 'any' type for the ref array
  const inputsRef = useRef<any[]>([]);

  const handleOtpChange = (value: string, index: number): void => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }

    if (!value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length === 4) {
      Alert.alert('Success', 'OTP verified successfully!');
    } else {
      Alert.alert('Error', 'Please enter a 4-digit OTP');
    }
  };

  const handleResend = () => {
    Alert.alert('OTP Resent', 'A new OTP has been sent to your number');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <View style={styles.backIconContainer}>
            <MaterialIcons name="keyboard-arrow-left" size={28} color="#000" />
          </View>
        </TouchableOpacity>

        {/* Image */}
        <Image
          source={require('../../assets/OtpVerification.png')}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.title}>OTP Verification</Text>
        <Text style={styles.subtitle}>Enter the OTP sent to {phoneNumber}</Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputsRef.current[index] = ref)} 
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={handleVerify}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleResend}>
          <Text style={styles.resendText}>
            Don’t receive OTP? <Text style={styles.resendLink}>Resend OTP</Text>
          </Text>
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
    height: 180,
    alignSelf: 'center',
    marginBottom: 24,
    marginTop: 54,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  otpInput: {
    width: 50,
    height: 55,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 18,
    textAlign: 'center',
    fontSize: 20,
    backgroundColor: '#f9f9f9',
  },
  continueButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 20,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resendText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
  },
  resendLink: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default OtpVerification;
