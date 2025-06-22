import {baseClient} from '../api.clients';
import {roleBasedEndpoints} from '../api.endpoints';
import {Role} from '../api.enviornment';

export const getAllDpr = (role: Role, params: {project_id: string}) => {
  return baseClient.get(
    roleBasedEndpoints[role].getALLDPR, //+ `?project_id=${params.project_id}`,
  );
};

export const createDpr = (data: any, role: Role) => {
  return baseClient.post(roleBasedEndpoints[role].createAllDPR, data);
};

export const updateDprById = (data: any, role: Role) => {
  console.log(roleBasedEndpoints[role].updateDPRByID, 'getting data');
  return baseClient.patch(
    roleBasedEndpoints[role].updateDPRByID + '/' + data.dpr_id,
    data,
  );
};
