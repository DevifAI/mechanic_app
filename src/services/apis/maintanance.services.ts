import {baseClient} from '../api.clients';
import {APIEndpoints} from '../api.endpoints';

export const getAllMaintananceSheet = () => {
  return baseClient.get(APIEndpoints.getAllMaintananceLog);
};

export const createMaintananceSheet = (data: any) => {
  return baseClient.post(APIEndpoints.createMaintananceLog, data);
};

export const getAllMaintananceSheetByUserId = (data: {
  org_id: string;
  createdBy: string;
  project_id: string;
}) => {
  console.log(data);
  return baseClient.post(APIEndpoints.getAllMaintananceLogByUserId, data);
};
