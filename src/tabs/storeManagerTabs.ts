import Home from '../pages/Mechanic/Home';


import HomeLogo from '../assets/Icons/HomeLogo.png';
import MaterialLogo from '../assets/Icons/MaterialLogo.png'
import EquipmentLogo from '../assets/Icons/EquipmentLogo.png'

import  MaterialScreen  from '../pages/StoreManager/MaterialScreen';
import  MaterialOut  from '../pages/StoreManager/MaterialOut';
import  EquipmentIn  from '../pages/StoreManager/EquipmentIn';
import  EquipmentOut from '../pages/StoreManager/EquipmentOut';

export const storeManagerTabs = [
  { name: 'Home', component: Home, icon: HomeLogo },
  { name: 'MaterialIn', component: MaterialScreen, icon: MaterialLogo },
  { name: 'MaterialOut', component: MaterialScreen, icon: MaterialLogo },
  { name: 'EquipmentIn', component: EquipmentIn, icon: EquipmentLogo },
  { name: 'EquipmentOut', component: EquipmentOut, icon: EquipmentLogo },
];
