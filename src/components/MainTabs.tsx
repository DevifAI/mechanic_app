import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { mechanicTabs } from '../tabs/mechanicTabs';
import { mechanicInchargeTabs } from '../tabs/mechanicInchargeTabs';
import { logout } from '../redux/authSlice';
import { siteInchargeTabs } from '../tabs/siteIncharge';
import { useNavigation } from '@react-navigation/native';

// import other role tabs as needed

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const windowWidth = Dimensions.get('window').width;

const { width, height } = Dimensions.get('window');

type TabItem = {
  name: string;
  component: React.ComponentType<any>;
  icon: any;
};



// Custom Tab Bar (for iOS)
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

// Bottom Tab Navigator (for iOS)
const TabNavigator = () => {
  const { role } = useSelector((state: RootState) => state.auth);

  const tabRoutes: TabItem[] =
    role === 'mechanicIncharge' ? mechanicInchargeTabs :
    // role === 'admin' ? adminTabs :
    // role === 'site manager' ? siteManagerTabs :
    // role === 'store manager' ? storeManagerTabs :
    role === 'siteIncharge' ? siteInchargeTabs :
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

// Drawer Navigator (for Android)
const DrawerNavigator = () => {
  const { role } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

const handleLogout = () => {
  console.log('Logout pressed');
  dispatch(logout()); // Dispatch your Redux logout action
  navigation.reset({
    index: 0,
    routes: [{ name: 'Login' }],
  });
};

  const tabRoutes: TabItem[] =
    role === 'mechanicIncharge' ? mechanicInchargeTabs :
    // role === 'admin' ? adminTabs :
    // role === 'site manager' ? siteManagerTabs :
    // role === 'store manager' ? storeManagerTabs :
    role === 'siteIncharge' ? siteInchargeTabs :
    mechanicTabs;

    const iconSize = width * 0.07;
const fontSize = width * 0.045;
const topPadding = height * 0.05;

  const appVersion = '1.0.0'

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerType: 'slide',
        drawerStyle: {
          width: '70%',
          paddingTop: topPadding,
        },
        headerShown: false,
      }}
      drawerContent={(props) => (
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <View>
            {tabRoutes.map((tab) => {
              const focused = props.state.routeNames[props.state.index] === tab.name;

              return (
                <TouchableOpacity
                  key={tab.name}
                  onPress={() => props.navigation.navigate(tab.name)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: width * 0.05,
                  }}
                >
                  <Image
                    source={tab.icon}
                    style={{
                      width: iconSize,
                      height: iconSize,
                      marginRight: width * 0.04,
                      tintColor: focused ? '#1271EE' : '#000',
                    }}
                    resizeMode="contain"
                  />
                  <Text style={{
                    fontSize: fontSize,
                    color: focused ? '#1271EE' : '#000',
                  }}>
                    {tab.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
             <TouchableOpacity
              onPress={handleLogout}
              style={{
                padding: width * 0.05,
                flexDirection:'row',
                gap: width * 0.04,
              }}
            >
                <MaterialIcons name="logout" size={iconSize} color="red" />
              <Text style={{ color: 'red', fontSize: fontSize }}>Logout</Text>
            </TouchableOpacity>
          </View>

          <View>
           

            <View style={{ alignItems: 'center', paddingVertical: width * 0.06 }}>
              <Text style={{ fontSize: width * 0.05, color: '#888' }}>
                Version {appVersion}
              </Text>
            </View>
          </View>
        </View>
      )}
    >
      {tabRoutes.map((tab) => (
        <Drawer.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
        />
      ))}
    </Drawer.Navigator>
  );
};

// Main Navigator - chooses between drawer and tab based on platform
const MainTabs = () => {
  return Platform.OS === 'ios' ? <TabNavigator /> : <DrawerNavigator />;
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