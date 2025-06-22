import {baseClient} from '../api.clients';
import {roleBasedEndpoints} from '../api.endpoints';
import {Role} from '../api.enviornment';

export const getAllEquipmentInOrOut = (role: Role) => {
  return baseClient.get(roleBasedEndpoints[role].getEquipmentIn);
};

export const getAllEquipmentInOrOutUserId = (
  data: {
    org_id?: string;
    createdBy?: string;
    project_id?: string;
    projectId?: string;
  },
  role: Role,
) => {
  return baseClient.post(roleBasedEndpoints[role].getEquipmentIn, data);
};

export const createEquipmentInOrOut = (data: any, role: Role) => {
  return baseClient.post(roleBasedEndpoints[role].createEquipmentIn, data);
};
