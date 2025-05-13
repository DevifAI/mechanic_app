import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';

// Common Screens
import Splash from './pages/Common/Splash';
import Login from './pages/Common/Login';
import ForgotPassword from './pages/Common/ForgotPassword';
import OtpVerification from './pages/Common/OtpVerification';
import DoneScreen from './pages/Common/DoneScreen';

// Main Tabs (Home)
import MainTabs from './components/MainTabs';

// Optional Additional Screens
import Approve from './pages/MechanicIncharge/Approve';
import CreateRequisition from './pages/Mechanic/CreateRequisition';
import CreateReceipt from './pages/Mechanic/CreateReceipt';
import Consumption from './pages/Mechanic/Consumption';
import Log from './pages/Mechanic/Log';
// import CreateRequisition from './pages/Mechanic/CreateRequisition';
// import CreateReceipt from './pages/Mechanic/CreateReceipt';

const Stack = createNativeStackNavigator();

const Routes = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <Splash />;

  return (
    <NavigationContainer>
      <Stack.Navigator 
       initialRouteName="MainTabs"
      screenOptions={{ headerShown: false }}>
       
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="OtpVerification" component={OtpVerification} />
        
 <Stack.Screen
  name="DoneScreen"
  component={isAuthenticated ? DoneScreen : Login}
/>
           <Stack.Screen
  name="MainTabs"
  component={isAuthenticated ? MainTabs : Login}
/>
<Stack.Screen
  name="Approve"
  component={isAuthenticated ? Approve : Login}
/>
<Stack.Screen
  name="CreateRequisition"
  component={isAuthenticated ? CreateRequisition : Login}
/>
<Stack.Screen
  name="CreateReceipt"
  component={isAuthenticated ? CreateReceipt : Login}
/>
<Stack.Screen
  name="Consumption"
  component={isAuthenticated ? Consumption : Login}
/>
<Stack.Screen
  name="Log"
  component={isAuthenticated ? Log : Login}
/>



      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
