import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
import Splash from './pages/Splash';
import Login from './pages/Login';
import Home from './pages/Home';
import MainTabs from './components/MainTabs';
import ForgotPassword from './pages/ForgotPassword';
import OtpVerification from './pages/OtpVerification';
import CreateRequisition from './pages/CreateRequisition';
import CreateReceipt from './pages/CreateReceipt';
import DoneScreen from './pages/DoneScreen';
// import MainTabs from './components/MainTabs';

const Stack = createNativeStackNavigator();

const Routes = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  console.log("isAuthenticated:", isAuthenticated);
  console.log("App loaded");

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate splash screen loading time (2 seconds)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Splash />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName='Home'
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="OtpVerification" component={OtpVerification} />

        <Stack.Screen name="DoneScreen" 
          component={isAuthenticated ? DoneScreen : Login} />

        <Stack.Screen name="Home" 
          component={isAuthenticated ? MainTabs : Login} />

      <Stack.Screen name="CreateRequisition" 
          component={isAuthenticated ? CreateRequisition : Login} />

      <Stack.Screen name="CreateReceipt" 
          component={isAuthenticated ? CreateReceipt : Login} />

          </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;