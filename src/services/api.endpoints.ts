import {Role} from './api.enviornment';

export const APIEndpoints = {
  logIn: '/auth/login',
  forgotPassWord: '/change/pass',

  getProjectsByUserId: '/super/admin/employee/get/projects',
  consumabaleItem: '/super/admin/consumableitems',
  equipments: '/super/admin/equipment/getAll',
};

type RequisitionEndpoints = {
  getAllDiselRequisition?: string;
  createDiselRequisition?: string;
  getAllDiselRequisitionByUserId?: string;
  getLatestRequisition?: string;
  getAllDiselReceipt?: string;
  getAllDiselReceiptbyUserId?: string;
  createDiselReceipt?: string;
  getDiselConsumption?: string;
  createDiselConsumption?: string;
  getAllConsumptionSheetByUserId?: string;
  getAllMaintananceLog?: string;
  createMaintananceLog?: string;
  getAllMaintananceLogByUserId?: string;
};

export const roleBasedEndpoints = {
  [Role.mechanic]: {
    getAllDiselRequisition: '/mechanic/requisition/get/all',
    createDiselRequisition: '/mechanic/requisition/create',
    getAllDiselRequisitionByUserId: '/mechanic/requisition/get/by/user',
    getLatestRequisition: '/mechanic/requisition/get/latest',
    updateDiselRequisition: '/mechanic/requisition/update',
    getAllDiselReceipt: '',
    getAllDiselReceiptbyUserId: '/mechanic/receipt/get/by/user',
    createDiselReceipt: '/mechanic/receipt/create',
    updateDiselReceipt: '',
    getDiselConsumption: '/mechanic/consumption/get/all',
    createDiselConsumption: '/mechanic/consumption/create',
    getAllConsumptionSheetByUserId: '/mechanic/consumption/get/by/user',
    updateDiselConsumption: '',
    getAllMaintananceLog: '/mechanic/maintanance/log/get/all',
    createMaintananceLog: '/mechanic/maintanance/log/create',
    getAllMaintananceLogByUserId: '/mechanic/maintanance/log/get/by/user',
    updateMaintananceLog: '',
  },
  [Role.mechanicInCharge]: {
    getAllDiselRequisition: '/mechanic_incharge/diesel-requisitions/all',
    createDiselRequisition: '/mechanicInCharge/requisition/create',
    getAllDiselRequisitionByUserId:
      '/mechanic_incharge/diesel-requisitions/all',
    getLatestRequisition: '/mechanic_incharge/requisition/get/latest',
    updateDiselRequisition:
      '/mechanic_incharge/diesel-requisitions/update-mic-approval',
    getAllDiselReceipt: '/mechanic_incharge/diesel-receipts/pending',
    getAllDiselReceiptbyUserId: '/mechanic_incharge/diesel-receipts/pending',
    createDiselReceipt: '/mechanicInCharge/receipt/create',
    updateDiselReceipt:
      '/mechanic_incharge/diesel-receipts/update-mic-approval',
    getDiselConsumption: '/mechanic_incharge/consumption/get/all',
    createDiselConsumption: '/mechanic_incharge/consumption/create',
    getAllConsumptionSheetByUserId: '/mechanic_incharge/consumption-sheets/all',
    updateDiselConsumption:
      '/mechanic_incharge/consumption-sheets/update-mic-approval',
    getAllMaintananceLog: '/mechanic_incharge/maintenance-sheets/all',
    createMaintananceLog: '/mechanicInCharge/maintanance/log/create',
    getAllMaintananceLogByUserId:
      '/mechanic_incharge/maintenance-sheets/pending',
    updateMaintananceLog:
      '/mechanic_incharge/maintenance-sheets/update-mic-approval',
  },
};
