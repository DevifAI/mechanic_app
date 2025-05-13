// src/navigators/CommonNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../pages/Common/Login';
import ForgotPassword from '../pages/Common/ForgotPassword';
import OtpVerification from '../pages/Common/OtpVerification';
import DoneScreen from '../pages/Common/DoneScreen';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const Stack = createNativeStackNavigator();

const CommonNavigator = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Always accessible screens */}
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="OtpVerification" component={OtpVerification} />
        <Stack.Screen name="DoneScreen" 
          component={isAuthenticated ? DoneScreen : Login} />
    </Stack.Navigator>
  );
};

export default CommonNavigator;
