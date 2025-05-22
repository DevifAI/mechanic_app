import Home from '../pages/Mechanic/Home';
import Requisition from '../pages/MechanicIncharge/Requisition';
import Receipt from '../pages/MechanicIncharge/Receipt';
import Consumption from '../pages/MechanicIncharge/Consumption';
import Log from '../pages/MechanicIncharge/Log';

import HomeLogo from '../assets/Icons/HomeLogo.png';
import RequisitionLogo from '../assets/Icons/RequisitionLogo.png';
import ReceiptLogo from '../assets/Icons/ReceiptLogo.png';
import ConsumptionLogo from '../assets/Icons/ConsumptionLogo.png';
import LogLogo from '../assets/Icons/LogLogo.png';

export const mechanicInchargeTabs = [
  { name: 'Home', component: Home, icon: HomeLogo },
  { name: 'Requisition', component: Requisition, icon: RequisitionLogo },
  { name: 'Receipt', component: Receipt, icon: ReceiptLogo },
  { name: 'Consumption', component: Consumption, icon: ConsumptionLogo },
  { name: 'Log', component: Log, icon: LogLogo },
];
