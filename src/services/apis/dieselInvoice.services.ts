import {baseClient} from '../api.clients';
import {roleBasedEndpoints} from '../api.endpoints';
import {Role} from '../api.enviornment';

export const getDieselInvoice = (data: any , role: Role) => {
  return baseClient.post(roleBasedEndpoints[role].getDieselInvoice, data);
};

export const createDieselInvoice = (data: any, role: Role) => {
  return baseClient.post(roleBasedEndpoints[role].createDieselInvoice, data);
};

// export const updateMaintananceSheet = (data: any, role: Role) => {
//   return baseClient.post(roleBasedEndpoints[role].updateMaintananceLog, data);
// };

export const getAllDieselInvoiceByUserId = (
  data: {
    createdBy?: string;
    project_id?: string;
  },
  role: Role,
) => {
  console.log(data);
  return baseClient.post(
    roleBasedEndpoints[role].getDieselInvoice,
    data,
  );
};

