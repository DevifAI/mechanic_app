import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainTabs from '../components/MainTabs';
import Approve from '../pages/MechanicIncharge/Approve';


const Stack = createNativeStackNavigator();

const MechanicInchargeNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Tabs or Home screen */}
      <Stack.Screen name="MainTabs" component={MainTabs} />
      
      {/* Extra screens accessible by mechanic */}
      {/* <Stack.Screen name="CreateRequisition" component={CreateRequisition} />
      <Stack.Screen name="CreateReceipt" component={CreateReceipt} /> */}
       <Stack.Screen name="Approve" 
          component={Approve} />
    </Stack.Navigator>
  );
};

export default MechanicInchargeNavigator;
