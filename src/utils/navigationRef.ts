// navigation/navigationRef.ts
import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<any>();

export const navigate = (name: string, params?: object) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
};

export const resetNavigation = (routeName: string) => {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name: routeName }],
    });
  }
};


// src/utils/notificationQueue.ts
let pendingNavigation: { screen: string; params?: any } | null = null;

export const setPendingNavigation = (screen: string, params?: any) => {
  pendingNavigation = { screen, params };
};

export const consumePendingNavigation = () => {
  const nav = pendingNavigation;
  pendingNavigation = null;
  return nav;
};
