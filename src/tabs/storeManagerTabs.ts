import Home from '../pages/Mechanic/Home';

import HomeLogo from '../assets/Icons/HomeLogo.png';
import MaterialLogo from '../assets/Icons/MaterialLogo.png';
import EquipmentLogo from '../assets/Icons/EquipmentLogo.png';

import MaterialScreen from '../pages/StoreManager/MaterialScreen';
// import  MaterialOut  from '../pages/StoreManager/MaterialOut';
import EquipmentScreen from '../pages/StoreManager/EquipmentScreen';
// import  EquipmentOut from '../pages/StoreManager/EquipmentOut';

export const storeManagerTabs = [
  {name: 'Home', component: Home, icon: HomeLogo},
  {name: 'MaterialIn', component: MaterialScreen, icon: MaterialLogo},
  {name: 'MaterialOut', component: MaterialScreen, icon: MaterialLogo},
  {name: 'EquipmentIn', component: EquipmentScreen, icon: EquipmentLogo},
  {name: 'EquipmentOut', component: EquipmentScreen, icon: EquipmentLogo},
];
