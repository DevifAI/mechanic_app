import {baseClient} from '../api.clients';
import {APIEndpoints, roleBasedEndpoints} from '../api.endpoints';
import {Role} from '../api.enviornment';

export const getAllMaterialInOrOut = (role: Role) => {
  return baseClient.get(roleBasedEndpoints[role].getMaterialIn);
};

export const getAllAllMaterialInOrOutUserId = (
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
    roleBasedEndpoints[role].getMaterialIn,
    data,
  );
};

export const createMaterialInOrOut = (data: any, role: Role) => {
  return baseClient.post(roleBasedEndpoints[role].createMaterialIn, data);
};

export const updateMaterialInOrOut = (data: any, role: Role) => {
  return baseClient.post(roleBasedEndpoints[role].UpdateMaterial, data);
};
