import {Role} from './api.enviornment';

export const APIEndpoints = {
  logIn: '/auth/login',
  forgotPassWord: '/change/pass',

  getProjectsByUserId: '/super/admin/employee/get/projects',
  consumabaleItem: '/super/admin/consumableitems',
  equipments: '/super/admin/equipment/getAll',
};

export const roleBasedEndpoints = {
  [Role.mechanic]: {
    getAllDiselRequisition: '/mechanic/requisition/get/all',
    createDiselRequisition: '/mechanic/diselrequisition',
    getAllDiselRequisitionByUserId: '/mechanic/diselrequisition/getByCreator',
    getLatestRequisition: '/mechanic/diselrequisition/latest',
    updateDiselRequisition: '/mechanic/requisition/update',
    getAllDiselReceipt: '',
    getAllDiselReceiptbyUserId: '/mechanic/diselreciept/getByCreator',
    createDiselReceipt: '/mechanic/diselreciept',
    updateDiselReceipt: '',
    getDiselConsumption: '/mechanic/consumption/get/all',
    createDiselConsumption: '/mechanic/consumptionsheet',
    getAllConsumptionSheetByUserId: '/mechanic/consumptionsheet/getbycreator',
    updateDiselConsumption: '',
    getAllMaintananceLog: '/mechanic/maintanance/log/get/all',
    createMaintananceLog: '/mechanic/maintenanceSheet',
    getAllMaintananceLogByUserId: '/mechanic/maintenanceSheet/byCreator',
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
