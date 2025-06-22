import {Role} from './api.enviornment';

export const APIEndpoints = {
  logIn: '/auth/login',
  forgotPassWord: '/change/pass',

  getProjectsByUserId: '/super/admin/employee/get/projects',
  consumabaleItem: '/super/admin/consumableitems',
  equipments: '/super/admin/equipment/getAll',
  patners: '/super/admin/partner/getall',
  shifts: '/super/admin/shift/getAll',

  employeeByDPRRole: '/super/admin/employee/get/employee/project/roleType',
  revenue: '/super/admin/revenue_master/getAll',
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
    // only for store manager but need to be there for rest of the roles for type consistency
    createMaterialIn: '',
    getMaterialIn: '',
    createMaterialOut: '',
    getMaterialOut: '',
    createEquipmentIn: '',
    createEquipmentOut: '',
    getEquipmentIn: '',
    getEquipmentOut: '',
    UpdateMaterial: '',
    // only for site incharge but need to be there for rest of the roles for type consistency
    getALLDPR: '',
    createAllDPR: '',

    updateDPRByID: '',
  },
  [Role.mechanicInCharge]: {
    getAllDiselRequisition: '/mechanic_incharge/diesel-requisitions/all',
    createDiselRequisition: '/mechanicInCharge/requisition/create',
    getAllDiselRequisitionByUserId:
      '/mechanic_incharge/diesel-requisitions/all',
    getLatestRequisition: '/mechanic_incharge/requisition/get/latest',
    updateDiselRequisition:
      '/mechanic_incharge/diesel-requisitions/update-mic-approval',
    getAllDiselReceipt: '/mechanic_incharge/diesel-receipts/all',
    getAllDiselReceiptbyUserId: '/mechanic_incharge/diesel-receipts/all',
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
    getAllMaintananceLogByUserId: '/mechanic_incharge/maintenance-sheets/all',
    updateMaintananceLog:
      '/mechanic_incharge/maintenance-sheets/update-mic-approval',
    // only for store manager but need to be there for rest of the roles for type consistency
    createMaterialIn: '',
    getMaterialIn: '',
    createMaterialOut: '',
    getMaterialOut: '',
    createEquipmentIn: '',
    createEquipmentOut: '',
    getEquipmentIn: '',
    getEquipmentOut: '',
    UpdateMaterial: '',
    // only for site incharge but need to be there for rest of the roles for type consistency
    getALLDPR: '',
    createAllDPR: '',

    // only for project manager but need to be there for rest of the roles for type consistency
    updateDPRByID: '',
  },
  [Role.siteInCharge]: {
    getAllDiselRequisition: '/site_incharge/diesel-requisitions/all',
    createDiselRequisition: '/site_incharge/requisition/create',
    getAllDiselRequisitionByUserId: '/site_incharge/diesel-requisitions/all',
    getLatestRequisition: '/site_incharge/requisition/get/latest',
    updateDiselRequisition:
      '/site_incharge/diesel-requisitions/update-sic-approval',
    getAllDiselReceipt: '/site_incharge/diesel-receipts/all',
    getAllDiselReceiptbyUserId: '/site_incharge/diesel-receipts/all',
    createDiselReceipt: '/site_incharge/receipt/create',
    updateDiselReceipt: '/site_incharge/diesel-receipts/update-sic-approval',

    getDiselConsumption: '/site_incharge/consumption-sheets/all',
    getAllConsumptionSheetByUserId: '/site_incharge/consumption-sheets/all',
    createDiselConsumption: '/site_incharge/consumption/create',
    updateDiselConsumption:
      '/site_incharge/consumption-sheets/update-sic-approval',
    getAllMaintananceLog: '/site_incharge/maintenance-sheets/all',
    createMaintananceLog: '/site_incharge/maintanance/log/create',
    getAllMaintananceLogByUserId: '/site_incharge/maintenance-sheets/all',
    updateMaintananceLog:
      '/site_incharge/maintenance-sheets/update-sic-approval',
    // only for store manager but need to be there for rest of the roles for type consistency
    createMaterialIn: '',
    getMaterialIn: '',
    createMaterialOut: '',
    getMaterialOut: '',
    createEquipmentIn: '',
    createEquipmentOut: '',
    getEquipmentIn: '',
    getEquipmentOut: '',
    getALLDPR: '/site_incharge/get-all-dpr',
    createAllDPR: '/site_incharge/create-dpr',

    // only for project manager but need to be there for rest of the roles for type consistency
    updateDPRByID: '',
  },
  [Role.projectManager]: {
    getAllDiselRequisition: '/project_manager/diesel-requisitions/all',
    createDiselRequisition: '/project_manager/requisition/create',
    getAllDiselRequisitionByUserId: '/project_manager/diesel-requisitions/all',
    getLatestRequisition: '/project_manager/requisition/get/latest',
    updateDiselRequisition:
      '/project_manager/diesel-requisitions/update-sic-approval',
    getAllDiselReceipt: '/project_manager/diesel-receipts/all',
    getAllDiselReceiptbyUserId: '/project_manager/diesel-receipts/all',
    createDiselReceipt: '/project_manager/receipt/create',
    updateDiselReceipt: '/project_manager/diesel-receipts/update-sic-approval',

    getDiselConsumption: '/project_manager/consumption-sheets/all',
    getAllConsumptionSheetByUserId: '/project_manager/consumption-sheets/all',
    createDiselConsumption: '/project_manager/consumption/create',
    updateDiselConsumption:
      '/project_manager/consumption-sheets/update-sic-approval',
    getAllMaintananceLog: '/project_manager/maintenance-sheets/all',
    createMaintananceLog: '/project_manager/maintanance/log/create',
    getAllMaintananceLogByUserId: '/project_manager/maintenance-sheets/all',
    updateMaintananceLog:
      '/project_manager/maintenance-sheets/update-sic-approval',
    // only for store manager but need to be there for rest of the roles for type consistency
    createMaterialIn: '',
    getMaterialIn: '/project_manager/material-transactions',
    createMaterialOut: '',
    getMaterialOut: '',
    createEquipmentIn: '',
    createEquipmentOut: '',
    getEquipmentIn: '/project_manager/equipment-transactions',
    getEquipmentOut: '',
    getALLDPR: '/site_incharge/get-all-dpr',

    updateDPRByID: '/project_manager/dpr/approve-reject',
    UpdateMaterial: '/project_manager/material-transaction/update-status',

    // only for site incharge but need to be there for rest of the roles for type consistency

    createAllDPR: '',
  },
  [Role.storeManager]: {
    getAllDiselRequisition: '/project_manager/diesel-requisitions/all',
    createDiselRequisition: '/project_manager/requisition/create',
    getAllDiselRequisitionByUserId: '/project_manager/diesel-requisitions/all',
    getLatestRequisition: '/project_manager/requisition/get/latest',
    updateDiselRequisition:
      '/project_manager/diesel-requisitions/update-sic-approval',
    getAllDiselReceipt: '/project_manager/diesel-receipts/all',
    getAllDiselReceiptbyUserId: '/project_manager/diesel-receipts/all',
    createDiselReceipt: '/project_manager/receipt/create',
    updateDiselReceipt: '/project_manager/diesel-receipts/update-sic-approval',

    getDiselConsumption: '/project_manager/consumption-sheets/all',
    getAllConsumptionSheetByUserId: '/project_manager/consumption-sheets/all',
    createDiselConsumption: '/project_manager/consumption/create',
    updateDiselConsumption:
      '/project_manager/consumption-sheets/update-sic-approval',
    getAllMaintananceLog: '/project_manager/maintenance-sheets/all',
    createMaintananceLog: '/project_manager/maintanance/log/create',
    getAllMaintananceLogByUserId: '/project_manager/maintenance-sheets/all',
    updateMaintananceLog:
      '/project_manager/maintenance-sheets/update-sic-approval',
    // only for store manager but need to be there for rest of the roles for type consistency
    createMaterialIn: '/store_manager/',
    getMaterialIn: '/store_manager/get/transactions',
    createMaterialOut: '',
    getMaterialOut: '',
    createEquipmentIn: '/store_manager/equipment',
    createEquipmentOut: '',
    getEquipmentIn: '/store_manager/get/equipment',
    getEquipmentOut: '',

    UpdateMaterial: '',

    // only for site incharge but need to be there for rest of the roles for type consistency
    getALLDPR: '',
    createAllDPR: '',

    // only for project manager but need to be there for rest of the roles for type consistency
    updateDPRByID: '',
  },
};
