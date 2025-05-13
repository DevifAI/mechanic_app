import Home from '../pages/Mechanic/Home';
import Requisition from '../pages/Mechanic/Requisition';
import Receipt from '../pages/Mechanic/Receipt';
import Consumption from '../pages/Mechanic/Consumption';
import Log from '../pages/Mechanic/Log';

import HomeLogo from '../assets/Icons/HomeLogo.png';
import RequisitionLogo from '../assets/Icons/RequisitionLogo.png';
import ReceiptLogo from '../assets/Icons/ReceiptLogo.png';
import DprLogo from '../assets/Icons/DprLogo.png';
import MoreLogo from '../assets/Icons/MoreLogo.png';

import DPRScreen from '../pages/SiteIncharge/Dpr';
import MoreScreen from '../pages/SiteIncharge/More';

export const siteInchargeTabs = [
  { name: 'Home', component: Home, icon: HomeLogo },
  { name: 'Requisition', component: Requisition, icon: RequisitionLogo },
  { name: 'Receipt', component: Receipt, icon: ReceiptLogo },
  { name: 'DprScreen', component: DPRScreen, icon: DprLogo },
  { name: 'More', component: MoreScreen, icon: MoreLogo },
];
