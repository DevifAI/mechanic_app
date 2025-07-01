
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/redux/store';
import Routes from './src/routes';
import 'react-native-reanimated';

import { Text, TextInput } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/components/toastconfig';
import { PermissionsAndroid, Platform } from 'react-native';
import {OneSignal} from 'react-native-onesignal';


export const fontFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
});


(Text as any).defaultProps = {
  ...(Text as any).defaultProps,
  style: [{ fontFamily }],
};

(TextInput as any).defaultProps = {
  ...(TextInput as any).defaultProps,
  style: [{ fontFamily }],
};



const App = () => {


  const requestNotificationPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      {
        title: 'Notification Permission',
        message: 'This app needs notification access to send you updates.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      }
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('✅ Notification permission granted');
    } else {
      console.warn('❌ Notification permission denied');
    }
  }
};

useEffect(() => {
  requestNotificationPermission();

  OneSignal.initialize('28193111-0035-4a40-af5f-8ed7db24072f');
  OneSignal.Notifications.requestPermission(true); // iOS only

  const onForegroundWillDisplay = (event: any) => {
    event.preventDefault();
    event.notification.display();
  };

  const onClick = (event: any) => {
    console.log('📬 Notification opened:', event);
  };

  OneSignal.Notifications.addEventListener('foregroundWillDisplay', onForegroundWillDisplay);
  OneSignal.Notifications.addEventListener('click', onClick);

  return () => {
    OneSignal.Notifications.removeEventListener('foregroundWillDisplay', onForegroundWillDisplay);
    OneSignal.Notifications.removeEventListener('click', onClick);
  };
}, []);


  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Routes />
        <Toast config={toastConfig} />
      </PersistGate>
    </Provider>
  );
};

export default App;
