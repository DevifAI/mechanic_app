import {baseClient} from '../api.clients';
import {APIEndpoints} from '../api.endpoints';

export const getAllDiselConsumption = () => {
  return baseClient.get(APIEndpoints.getDiselConsumption);
};

export const getAllDiselConsumptionbyUserId = (data: {
  org_id: string;
  createdBy: string;
  project_id: string;
}) => {
  console.log(data);

  return baseClient.post(APIEndpoints.getAllConsumptionSheetByUserId, data);
};

export const createDiselConsumption = (data: any) => {
  return baseClient.post(APIEndpoints.createDiselConsumption, data);
};
