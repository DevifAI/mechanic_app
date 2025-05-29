import React, {useState} from 'react';
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
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useAuth from '../../hooks/useAuth';

const ForgotPassword = () => {
  const navigation = useNavigation<any>();
  const {handleForgotPassword} = useAuth();

  const [userId, setUserId] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!userId || !oldPassword || !newPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    console.log('📤 Requesting password reset for:', userId);

    try {
      await handleForgotPassword(
        {emp_id: userId, oldPassword: oldPassword, newPassword: newPassword},
        () => {
          console.log('✅ Password changed successfully');
          Alert.alert('Success', 'Password changed successfully');
          navigation.goBack();
        },
      );
    } catch (error) {
      console.log('❌ Password change failed:', error);
      Alert.alert('Error', 'Password change failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <View style={styles.backIconContainer}>
            <MaterialIcons name="keyboard-arrow-left" size={28} color="#000" />
          </View>
        </TouchableOpacity>

        <Image
          source={require('../../assets/ForgotPassword.png')}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.title}>Reset Password</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter User ID"
          placeholderTextColor="#999"
          value={userId}
          onChangeText={setUserId}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter Old Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={oldPassword}
          onChangeText={setOldPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter New Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <TouchableOpacity
          style={[styles.continueButton, loading && {opacity: 0.6}]}
          onPress={handleContinue}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.continueButtonText}>Change Password</Text>
          )}
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
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
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
