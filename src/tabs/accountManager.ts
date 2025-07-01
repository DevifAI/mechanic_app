import Home from '../pages/Mechanic/Home';

import HomeLogo from '../assets/Icons/HomeLogo.png';
import MaterialLogo from '../assets/Icons/MaterialLogo.png';
import EquipmentLogo from '../assets/Icons/EquipmentLogo.png';
import DieselInvoicesLogo from '../assets/Icons/DieselInvoicesLogo.png';
import MoreLogo from '../assets/Icons/MoreLogo.png';

import MaterialIn from '../pages/StoreManager/MaterialScreen';
import EquipmentIn from '../pages/StoreManager/EquipmentScreen';
import EquipmentOut from '../pages/StoreManager/EquipmentOut';
import DieselInvoice from '../pages/AccountManager/DieselInvoice';
import MoreScreen from '../pages/SiteIncharge/More';
import MaterialScreen from '../pages/StoreManager/MaterialScreen';

export const accountManagerTabs = [
  {name: 'Home', component: Home, icon: HomeLogo},
  {name: 'ExpenseInput', component: DieselInvoice, icon: MaterialLogo},
  {name: 'MaterialBill', component: DieselInvoice, icon: MaterialLogo},
  {name: 'RevenueInput', component: DieselInvoice, icon: DieselInvoicesLogo},
];
