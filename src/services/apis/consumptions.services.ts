import {baseClient} from '../api.clients';
import {APIEndpoints, roleBasedEndpoints} from '../api.endpoints';
import {Role} from '../api.enviornment';

export const getAllDiselConsumption = (role: Role) => {
  return baseClient.get(roleBasedEndpoints[role].getDiselConsumption);
};

export const getAllDiselConsumptionbyUserId = (
  data: {
    org_id?: string;
    createdBy?: string;
    project_id?: string;
    projectId?: string;
  },
  role: Role,
) => {
  console.log("helooooooooooooooooooooooooooooooo",data);

  return baseClient.post(
    roleBasedEndpoints[role].getAllConsumptionSheetByUserId,
    data,
  );
};

export const createDiselConsumption = (data: any, role: Role) => {
  return baseClient.post(roleBasedEndpoints[role].createDiselConsumption, data);
};

export const updateDiselConsumption = (data: any, role: Role) => {
  return baseClient.post(roleBasedEndpoints[role].updateDiselConsumption, data);
};
