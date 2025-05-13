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
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { RouteProp, ParamListBase } from '@react-navigation/native';

import { mechanicTabs } from '../tabs/mechanicTabs';
import { mechanicInchargeTabs } from '../tabs/mechanicInchargeTabs';
// import { adminTabs } from '../tabs/adminTabs';
// import { siteManagerTabs } from '../tabs/siteManagerTabs';
// import { storeManagerTabs } from '../tabs/storeManagerTabs';
// import { siteInchargeTabs } from '../tabs/siteInchargeTabs';

const Tab = createBottomTabNavigator();
const windowWidth = Dimensions.get('window').width;

// Properly typed TabItem
type TabItem = {
  name: string;
  component: React.ComponentType<any>;
  icon: any;
};

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
          { width: tabWidth, transform: [{ translateX: indicatorPosition }] },
        ]}
      />
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const tab: TabItem | undefined = options.tabData;

        if (!tab) return null;

        return (
          <View key={route.key} style={styles.tabItem}>
            <TouchableOpacity
              onPress={() => navigation.navigate(route.name)}
              style={styles.tabPressable}
            >
              <Image
                source={tab.icon}
                style={[styles.icon, { tintColor: isFocused ? '#1271EE' : '#000' }]}
              />
              <Text
                style={[styles.label, { color: isFocused ? '#1271EE' : '#000' }]}
              >
                {tab.name}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

const MainTabs = () => {
  const { role } = useSelector((state: RootState) => state.auth);

  const tabRoutes: TabItem[] =
    role === 'mechanic incharge' ? mechanicInchargeTabs :
    // role === 'admin' ? adminTabs :
    // role === 'site manager' ? siteManagerTabs :
    // role === 'store manager' ? storeManagerTabs :
    // role === 'site incharge' ? siteInchargeTabs :
    mechanicTabs;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const tab = tabRoutes.find((t) => t.name === route.name);
        return {
          headerShown: false,
          tabData: tab,
        };
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      {tabRoutes.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
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
  tabPressable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MainTabs;
