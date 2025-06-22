import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import {RootState} from './redux/store';

// Common Screens
import Splash from './pages/Common/Splash';
import Login from './pages/Common/Login';
import ForgotPassword from './pages/Common/ForgotPassword';
import OtpVerification from './pages/Common/OtpVerification';
import DoneScreen from './pages/Common/DoneScreen';

// Main Tabs (Home)
import MainTabs from './components/MainTabs';

// Optional Additional Screens

import Consumption from './pages/Mechanic/Consumption';
import Log from './pages/Mechanic/Log';
import AddItem from './pages/Mechanic/AddItem';

import ViewItems from './pages/Mechanic/ViewItems';
import CreateConsumption from './pages/Mechanic/CreateConsumption';
import CreateLog from './pages/Mechanic/CreateLog';
import DPRSubform from './pages/SiteIncharge/DPRSubform';
import CreateDPR from './pages/SiteIncharge/CreateDPR';
import ViewDPR from './pages/SiteIncharge/ViewDPR';
import CreateMaterialIn from './pages/StoreManager/CreateMaterial';
import CreateMaterialOut from './pages/StoreManager/CreateMaterialOut';
import CreateEquipmentIn from './pages/StoreManager/CreateEquipmentIn';
import CreateEquipmentOut from './pages/StoreManager/CreateEquipmentOut';
import EquipmentIn from './pages/StoreManager/EquipmentScreen';
import EquipmentOut from './pages/StoreManager/EquipmentOut';
import CreateDieselInvoice from './pages/AccountManager/CreateDieselInvoice';
import CreateRequisitionOrReceiptPage from './pages/Mechanic/CreateRequisitionorReceipt';
import CreateMaterial from './pages/StoreManager/CreateMaterial';
import MaterialScreen from './pages/StoreManager/MaterialScreen';
import EquipmentScreen from './pages/StoreManager/EquipmentScreen';
import DPR from './pages/SiteIncharge/Dpr';

// import CreateRequisition from './pages/Mechanic/CreateRequisition';
// import CreateReceipt from './pages/Mechanic/CreateReceipt';

const Stack = createNativeStackNavigator();

const Routes = () => {
  const {isAuthenticated, role} = useSelector((state: RootState) => state.auth);
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
        screenOptions={{headerShown: false}}>
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
          component={isAuthenticated ? CreateRequisitionOrReceiptPage : Login}
        />

        <Stack.Screen
          name="ViewItems"
          component={isAuthenticated ? ViewItems : Login}
        />

        <Stack.Screen
          name="AddItem"
          component={isAuthenticated ? AddItem : Login}
        />

        <Stack.Screen
          name="CreateReceipt"
          component={isAuthenticated ? CreateRequisitionOrReceiptPage : Login}
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
        <Stack.Screen
          name="CreateDPR"
          component={isAuthenticated ? CreateDPR : Login}
        />

        <Stack.Screen
          name="DPRSubform"
          component={isAuthenticated ? DPRSubform : Login}
        />

        <Stack.Screen
          name="ViewDPR"
          component={isAuthenticated ? ViewDPR : Login}
        />

        <Stack.Screen
          name="CreateMaterialIn"
          component={isAuthenticated ? CreateMaterial : Login}
        />
        <Stack.Screen
          name="CreateMaterialOut"
          component={isAuthenticated ? CreateMaterial : Login}
        />

        <Stack.Screen
          name="CreateEquipmentIn"
          component={isAuthenticated ? CreateEquipmentIn : Login}
        />
        {role === 'projectManager' && (
          <>
            <Stack.Screen
              name="MaterialIn"
              component={isAuthenticated ? MaterialScreen : Login}
            />
            <Stack.Screen
              name="MaterialOut"
              component={isAuthenticated ? MaterialScreen : Login}
            />
            <Stack.Screen
              name="DprScreen"
              component={isAuthenticated ? DPR : Login}
            />
            <Stack.Screen
              name="EquipmentIn"
              component={isAuthenticated ? EquipmentScreen : Login}
            />
            <Stack.Screen
              name="EquipmentOut"
              component={isAuthenticated ? EquipmentScreen : Login}
            />
          </>
        )}
        <Stack.Screen
          name="CreateEquipmentOut"
          component={isAuthenticated ? CreateEquipmentIn : Login}
        />

        {role === 'accountManager' && (
          <>
            <Stack.Screen
              name="EquipmentIn"
              component={isAuthenticated ? EquipmentScreen : Login}
            />
            <Stack.Screen
              name="EquipmentOut"
              component={isAuthenticated ? EquipmentScreen : Login}
            />
          </>
        )}

        <Stack.Screen
          name="CreateDieselInvoice"
          component={isAuthenticated ? CreateDieselInvoice : Login}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
