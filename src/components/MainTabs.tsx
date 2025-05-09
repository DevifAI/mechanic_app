import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from '../pages/Home';
import Requisition from '../pages/Requisition';
import Receipt from '../pages/Receipt';
import Consumption from '../pages/Consumption';
import Log from '../pages/Log';

import HomeLogo from '../assets/Icons/HomeLogo.png';
import RequisitionLogo from '../assets/Icons/RequisitionLogo.png';
import ReceiptLogo from '../assets/Icons/ReceiptLogo.png';
import ConsumptionLogo from '../assets/Icons/ConsumptionLogo.png';
import LogLogo from '../assets/Icons/LogLogo.png';

const Tab = createBottomTabNavigator();
const tabRoutes = [
  { name: 'Home', component: Home, icon: HomeLogo },
  { name: 'Requisition', component: Requisition, icon: RequisitionLogo },
  { name: 'Receipt', component: Receipt, icon: ReceiptLogo },
  { name: 'Consumption', component: Consumption, icon: ConsumptionLogo },
  { name: 'Log', component: Log, icon: LogLogo },
];

const windowWidth = Dimensions.get('window').width;

const CustomTabBar = ({ state, descriptors, navigation }: any) => {

  const indicatorPosition = useRef(new Animated.Value(0)).current;
  const tabWidth = windowWidth / state.routes.length;

  React.useEffect(() => {
    Animated.timing(indicatorPosition, {
      toValue: state.index * tabWidth,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [state.index]);

  return (
    <View style={styles.tabBar}>
      <Animated.View
        style={[
          styles.indicator,
          {
            width: tabWidth,
            transform: [{ translateX: indicatorPosition }],
          },
        ]}
      />
    {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const icon = tabRoutes.find((tab) => tab.name === route.name)?.icon;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <View key={route.key} style={styles.tabItem}>
          <TouchableOpacity onPress={onPress} style={styles.tabPressable}>
  <Image
    source={icon}
    style={[
      styles.icon,
      { tintColor: isFocused ? '#1271EE' : '#000' },
    ]}
  />
  <Text
    style={[
      styles.label,
      { color: isFocused ? '#1271EE' : '#000' },
    ]}
  >
    {route.name}
  </Text>
</TouchableOpacity>

          </View>
        );
      })}
    </View>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      {tabRoutes.map((route) => (
        <Tab.Screen
          key={route.name}
          name={route.name}
          component={route.component}
        />
      ))}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 70,
    borderTopWidth: 0.5,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
    elevation: 8,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: -3 },
  },
  indicator: {
    position: 'absolute',
    top: 0,
    height: 3,
    backgroundColor: '#1271EE',
    borderRadius: 2,
    left: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
  },
  icon: {
    width: 24,
    height: 24,
    marginBottom: 3,
  },
  label: {
    fontSize: 12,
    textAlign: 'center',
  },
  pressable: {
    justifyContent:'center',
    alignItems: 'center',
  },
  tabPressable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
});

export default MainTabs;
