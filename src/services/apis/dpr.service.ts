import {baseClient} from '../api.clients';
import {roleBasedEndpoints} from '../api.endpoints';
import {Role} from '../api.enviornment';

export const getAllDpr = (role: Role, params: {project_id: string}) => {
  return baseClient.post(
    roleBasedEndpoints[role].getALLDPR + `?project_id=${params.project_id}`,
  );
};

export const createDpr = (data: any, role: Role) => {
  return baseClient.post(
    roleBasedEndpoints[role].createAllDPR + `/${data.dpr_id}`,
    data,
  );
};

export const updateDprById = (data: any, role: Role) => {
  return baseClient.patch(roleBasedEndpoints[role].updateDPRByID, data);
};
