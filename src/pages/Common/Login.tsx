import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/authSlice';
import { mockLogin } from '../../mockApi';


const Login = () => {
    const navigation = useNavigation<any>()
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const dispatch = useDispatch()

  const handleLogin = async () => {
 
    if (userId && password) {
        try {
           const response = await mockLogin(userId, password);
      dispatch(login({ userId: response.userId, role: response.role }));
          
          Alert.alert('Logged in', `Welcome, ${userId}`);
          navigation.navigate('DoneScreen');
        } catch (error) {
          console.log('Login error', error);
          Alert.alert('Error', 'Failed to log in');
        }
      } else {
        Alert.alert('Error', 'Please enter both User ID and Password');
      }
    }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
         <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        <Image
          source={require('../../assets/logo.png')}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>
          In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean urna tempor.
        </Text>

        <TextInput
          placeholder="Enter User Id"
          placeholderTextColor="#999"
          style={[styles.input, { color: '#000' }]}
          value={userId}
          onChangeText={setUserId}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Enter Password"
            placeholderTextColor="#999"
            secureTextEntry={secureText}
            style={[styles.passwordInput, { color: '#000' }]}
            value={password}
            onChangeText={setPassword}
          />
          <Pressable onPress={() => setSecureText(!secureText)}>
          <Icon
          name={secureText ? 'eye-off' : 'eye'}
          size={22}
          color="#888"
        />
          </Pressable>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.borderDiv}
         onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgot}>Forgot Password</Text>
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
  image: {
    height: 200,
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 48,
    marginBottom: 24,
    backgroundColor: '#f9f9f9',
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  borderDiv: {
    alignSelf: 'center',
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#007AFF',
  },
  forgot: {
    color: '#007AFF',
    fontSize: 16,
    paddingBottom: 4, // creates the gap between text and underline
  },
});

export default Login;
