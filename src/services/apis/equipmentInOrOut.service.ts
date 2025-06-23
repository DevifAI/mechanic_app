import {baseClient} from '../api.clients';
import {roleBasedEndpoints} from '../api.endpoints';
import {Role} from '../api.enviornment';

export const getAllEquipmentInOrOut = (role: Role) => {
  return baseClient.get(roleBasedEndpoints[role].getEquipmentIn);
};

export const getAllEquipmentInOrOutUserId = (
  data: {
    data_type: string;
    project_id: string;
  },
  role: Role,
  status: string,
) => {
  if (role === Role.projectManager) {
    return baseClient.post(
      `/project_manager/equipment-transactions?project_id=${data.project_id}&status=${status}&data_type=${data.data_type}`,
    );
  }
  return baseClient.post(roleBasedEndpoints[role].getEquipmentIn, data);
};

export const createEquipmentInOrOut = (data: any, role: Role) => {
  return baseClient.post(roleBasedEndpoints[role].createEquipmentIn, data);
};

export const updateEquipmentInOrOutByProjectManager = (
  data: any,
  role: Role,
) => {
  return baseClient.post(roleBasedEndpoints[role].updateEquipment, data);
};
