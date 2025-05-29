import React, {useState} from 'react';
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
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {login} from '../../redux/slices/authSlice';
import useAuth from '../../hooks/useAuth';

const Login = () => {
  const navigation = useNavigation<any>();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const dispatch = useDispatch();

  const {handleLogin, loading} = useAuth();

  const onLoginPress = () => {
    if (!userId.trim() || !password.trim()) {
      Alert.alert('Error', 'User ID and Password are required');
      return;
    }

    handleLogin({emp_id: userId, password});
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        <Image
          source={require('../../assets/logo.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <Image
          source={require('../../assets/companylogo.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.subtitle}>
          Welcome back!
          {'\n'}
          Please log in to continue to your account.
        </Text>

        <TextInput
          placeholder="Enter User Id"
          placeholderTextColor="#999"
          style={[styles.input, {color: '#000'}]}
          value={userId}
          onChangeText={setUserId}
          autoCapitalize="none"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Enter Password"
            placeholderTextColor="#999"
            secureTextEntry={secureText}
            style={[styles.passwordInput, {color: '#000'}]}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />
          <Pressable onPress={() => setSecureText(!secureText)}>
            <Icon
              name={secureText ? 'eye-off' : 'eye'}
              size={22}
              color="#888"
            />
          </Pressable>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={onLoginPress}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.borderDiv}
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
  logo: {
    alignSelf: 'center',
    width: 120,
    height: 120,
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
    paddingBottom: 4,
  },
});

export default Login;
