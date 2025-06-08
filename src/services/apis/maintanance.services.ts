import {baseClient} from '../api.clients';
import {roleBasedEndpoints} from '../api.endpoints';
import {Role} from '../api.enviornment';

export const getAllMaintananceSheet = (role: Role) => {
  return baseClient.get(roleBasedEndpoints[role].getAllMaintananceLog);
};

export const createMaintananceSheet = (data: any, role: Role) => {
  return baseClient.post(roleBasedEndpoints[role].createMaintananceLog, data);
};

export const getAllMaintananceSheetByUserId = (
  data: {
    org_id?: string;
    createdBy?: string;
    project_id?: string;
    projectId?: string;
  },
  role: Role,
) => {
  console.log(data);
  return baseClient.post(
    roleBasedEndpoints[role].getAllMaintananceLogByUserId,
    data,
  );
};
