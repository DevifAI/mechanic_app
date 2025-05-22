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
import CreateReceipt from './pages/Mechanic/CreateReceipt';
import Consumption from './pages/MechanicIncharge/Consumption';
import Log from './pages/MechanicIncharge/Log';
import AddItem from './pages/Mechanic/AddItem';
import CreateRequisition from './pages/Mechanic/CreateRequisition';
import ViewItems from './pages/Mechanic/ViewItems';
import CreateConsumption from './pages/Mechanic/CreateConsumption';
import CreateLog from './pages/Mechanic/CreateLog';


// import CreateRequisition from './pages/Mechanic/CreateRequisition';
// import CreateReceipt from './pages/Mechanic/CreateReceipt';

const Stack = createNativeStackNavigator();

const Routes = () => {
  const { isAuthenticated , role } = useSelector((state: RootState) => state.auth);
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
  name="CreateRequisition"
  component={isAuthenticated ? CreateRequisition : Login}
/>

<Stack.Screen
  name="ViewItems"
  component={isAuthenticated ? ViewItems : Login}
/>

<Stack.Screen name="AddItem" component={ isAuthenticated ? AddItem : Login} />

<Stack.Screen
  name="CreateReceipt"
  component={isAuthenticated ? CreateReceipt : Login}
/>
<Stack.Screen
  name="CreateConsumption"
  component={isAuthenticated ? CreateConsumption : Login}
/>

<Stack.Screen
  name="CreateLog"
  component={isAuthenticated ? CreateLog : Login}
/>

{role === 'siteIncharge' && (
  <>
    <Stack.Screen
      name="Consumption"
      component={isAuthenticated ? Consumption : Login}
    />
    <Stack.Screen
      name="Log"
      component={isAuthenticated ? Log : Login}
    />
  </>
)}


      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
