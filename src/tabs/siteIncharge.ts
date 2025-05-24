import Home from '../pages/Mechanic/Home';
import Requisition from '../pages/MechanicIncharge/Requisition';
import Receipt from '../pages/MechanicIncharge/Receipt';
import Consumption from '../pages/Mechanic/Consumption';
import Log from '../pages/Mechanic/Log';

import HomeLogo from '../assets/Icons/HomeLogo.png';
import RequisitionLogo from '../assets/Icons/RequisitionLogo.png';
import ReceiptLogo from '../assets/Icons/ReceiptLogo.png';
import DprLogo from '../assets/Icons/DprLogo.png';
import MoreLogo from '../assets/Icons/MoreLogo.png';

import MoreScreen from '../pages/SiteIncharge/More';
import DPR from '../pages/SiteIncharge/Dpr';

export const siteInchargeTabs = [
  { name: 'Home', component: Home, icon: HomeLogo },
  { name: 'Requisition', component: Requisition, icon: RequisitionLogo },
  { name: 'Receipt', component: Receipt, icon: ReceiptLogo },
  { name: 'DprScreen', component: DPR, icon: DprLogo },
  { name: 'More', component: MoreScreen, icon: MoreLogo },
];
