import {baseClient} from '../api.clients';
import {roleBasedEndpoints} from '../api.endpoints';
import {Role} from '../api.enviornment';

// export const getMaterialBill = (data: any , role: Role) => {
//   return baseClient.post(roleBasedEndpoints[role].getMaterialBill , data);
// };

export const createRevenueInput = (data: any, role: Role) => {
  return baseClient.post(roleBasedEndpoints[role].createRevenueInput, data);
};

// export const updateMaintananceSheet = (data: any, role: Role) => {
//   return baseClient.post(roleBasedEndpoints[role].updateMaintananceLog, data);
// };

export const getAllRevenueInputByUserId = (
  data: {
    createdBy?: string;
    project_id?: string;
  },
  role: Role,
) => {
  console.log(data);
  return baseClient.post(
    roleBasedEndpoints[role].getRevenueInput,
    data,
  );
};
