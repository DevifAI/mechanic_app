import React, { useEffect, useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import useAuth from '../../hooks/useAuth';
import DeviceInfo from 'react-native-device-info';
import {OneSignal} from 'react-native-onesignal';

const Login = () => {
  const navigation = useNavigation<any>();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [playerId, setPlayerId] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const { handleLogin, loading } = useAuth();
  const dispatch = useDispatch();

//  useEffect(() => {
//   const fetchDeviceDetails = async () => {
//     const id = DeviceInfo.getDeviceId();
//     const name = await DeviceInfo.getDeviceName();
//     setDeviceId(id);
//     setDeviceName(name);

//     try {
//       const state = await OneSignal.getDeviceState();
//       if (state?.userId) {
//         console.log('📲 OneSignal Player ID:', state.userId);
//         setPlayerId(state.userId);
//       }
//     } catch (error) {
//       console.error('❌ OneSignal error:', error);
//     }
//   };

//   fetchDeviceDetails();
// }, []);

//   useEffect(() => {
//   // ✅ Initialize
//   OneSignal.initialize("28193111-0035-4a40-af5f-8ed7db24072f");

//   // ✅ Foreground notification handler
//   OneSignal.Notifications.addEventListener('foregroundWillDisplay', (event) => {
//     console.log("Notification in foreground:", event);
//     event.preventDefault(); // Prevents default notification UI
//     event.notification.display(); // Show manually
//   });
//   const fetchDeviceDetails = async () => {
//     const id = DeviceInfo.getDeviceId();
//     const name = await DeviceInfo.getDeviceName();
//     setDeviceId(id);
//     setDeviceName(name);

//     try {
//       const deviceState = await (OneSignal.Notifications as any).getDeviceState();
//       if (deviceState?.userId) {
//         console.log('📲 OneSignal Player ID:', deviceState.userId);
//         setPlayerId(deviceState.userId);
//       }
//     } catch (error) {
//       console.error('❌ OneSignal error:', error);
//     }
//   };

//   fetchDeviceDetails();


//   // ✅ Notification opened handler
//   // OneSignal.Notifications.addEventListener('notificationOpened', (event) => {
//   //   console.log("Notification opened:", event);
//   // });

//   // ✅ Request permissions (for iOS)
//   OneSignal.Notifications.requestPermission(true);
// }, []);

useEffect(() => {
  // ✅ Initialize OneSignal with your App ID
  OneSignal.initialize('28193111-0035-4a40-af5f-8ed7db24072f');

  // ✅ Ask for push notification permission (important for Android 13+ and iOS)
  OneSignal.Notifications.requestPermission(true);

  // ✅ Foreground notification handler
  const onForegroundDisplay = (event: any) => {
    event.preventDefault();
    event.notification.display(); // <-- Important for showing in foreground
  };
  OneSignal.Notifications.addEventListener('foregroundWillDisplay', onForegroundDisplay);

  // ✅ Notification opened handler (optional, but useful for debugging)
  const onNotificationClick = (event: any) => {
    console.log("🔔 Notification clicked:", event);
  };
  OneSignal.Notifications.addEventListener('click', onNotificationClick);

  // ✅ Fetch OneSignal player ID + Device Info
  const fetchPlayerId = async () => {
    try {
      const DeviceId = DeviceInfo.getDeviceId();
      const DeviceName = await DeviceInfo.getDeviceName();
      setDeviceId(DeviceId);
      setDeviceName(DeviceName);

      await OneSignal.User.pushSubscription.optIn(); // make sure user is opted in

      const isSubscribed = await OneSignal.User.pushSubscription.getOptedIn();
      const playerId = OneSignal.User.pushSubscription.getPushSubscriptionId(); // <- this is what you need

      console.log("📲 Player ID:", playerId);
      console.log("🔔 Subscribed:", isSubscribed);

      if (playerId) {
        setPlayerId(playerId);
      } else {
        console.warn("🚫 No player ID yet.");
      }
    } catch (e) {
      console.error('❌ Error getting OneSignal player ID:', e);
    }
  };

  // ⏳ Add delay to let OneSignal initialize fully
  setTimeout(fetchPlayerId, 4000);
  // ✅ Cleanup listeners
  return () => {
    OneSignal.Notifications.removeEventListener('foregroundWillDisplay', onForegroundDisplay);
    OneSignal.Notifications.removeEventListener('click', onNotificationClick);
  };
}, []);



  const onLoginPress = () => {
    if (!userId.trim() || !password.trim()) {
      Alert.alert('Error', 'User ID and Password are required');
      return;
    }

    handleLogin({
      emp_id: userId,
      password,
      device_id: deviceId,
      device_name: deviceName,
      player_id: playerId,
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
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
          style={[styles.input, { color: '#000' }]}
          value={userId}
          onChangeText={setUserId}
          autoCapitalize="none"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Enter Password"
            placeholderTextColor="#999"
            secureTextEntry={secureText}
            style={[styles.passwordInput, { color: '#000' }]}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />
          <Pressable onPress={() => setSecureText(!secureText)}>
            <Icon name={secureText ? 'eye-off' : 'eye'} size={22} color="#888" />
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
