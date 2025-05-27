import Home from '../pages/Mechanic/Home';
import Consumption from '../pages/Mechanic/Consumption';
import Log from '../pages/Mechanic/Log';

import HomeLogo from '../assets/Icons/HomeLogo.png';
import RequisitionLogo from '../assets/Icons/RequisitionLogo.png';
import ReceiptLogo from '../assets/Icons/ReceiptLogo.png';
import ConsumptionLogo from '../assets/Icons/ConsumptionLogo.png';
import LogLogo from '../assets/Icons/LogLogo.png';
import RequisitionOrReceiptPage from '../pages/Mechanic/RequisitionorReceipt';

export const mechanicTabs = [
  {name: 'Home', component: Home, icon: HomeLogo},
  {
    name: 'Requisition',
    component: RequisitionOrReceiptPage,
    icon: RequisitionLogo,
  },
  {name: 'Receipt', component: RequisitionOrReceiptPage, icon: ReceiptLogo},
  {name: 'Consumption', component: Consumption, icon: ConsumptionLogo},
  {name: 'Log', component: Log, icon: LogLogo},
];
