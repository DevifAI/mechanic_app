import {baseClient} from '../api.clients';
import {roleBasedEndpoints} from '../api.endpoints';
import {Role} from '../api.enviornment';

export const getMaterialBill = (role: Role) => {
  return baseClient.get(roleBasedEndpoints[role].getMaterialBill);
};

export const createMaterialBill = (data: any, role: Role) => {
  return baseClient.post(roleBasedEndpoints[role].createMaterialBill, data);
};

// export const updateMaintananceSheet = (data: any, role: Role) => {
//   return baseClient.post(roleBasedEndpoints[role].updateMaintananceLog, data);
// };

export const getAllMaterialBillByUserId = (
  data: {
    project_id?: string;
  },
  role: Role,
) => {
  console.log(data);
  return baseClient.post(
    roleBasedEndpoints[role].getMaterialBill,
    data,
  );
};

