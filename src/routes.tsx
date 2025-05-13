// src/Routes.tsx

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';

import Splash from './pages/Common/Splash';
import CommonNavigator from './navigators/CommonNavigator';

import MechanicNavigator from './navigators/MechanicNavigator';
import MechanicInchargeNavigator from './navigators/MechanicInchargeNavigator';
// import SiteInchargeNavigator from './navigators/SiteInchargeNavigator';
// import SiteManagerNavigator from './navigators/SiteManagerNavigator';
// import StoreManagerNavigator from './navigators/StoreManagerNavigator';
// import AdminNavigator from './navigators/AdminNavigator';

const Routes = () => {
  const { isAuthenticated, role } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <Splash />;

  const getNavigator = () => {
if (!isAuthenticated || !role) return <CommonNavigator />;

    switch (role) {
      case 'mechanic': return <MechanicNavigator />;
      case 'mechanic incharge': return <MechanicInchargeNavigator />;
      // case 'site incharge': return <SiteInchargeNavigator />;
      // case 'site manager': return <SiteManagerNavigator />;
      // case 'store manager': return <StoreManagerNavigator />;
      // case 'admin': return <AdminNavigator />;
      default: return <CommonNavigator />;
    }
  };

  return <NavigationContainer>{getNavigator()}</NavigationContainer>;
};

export default Routes;
