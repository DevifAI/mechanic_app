import {baseClient} from '../api.clients';
import {APIEndpoints} from '../api.endpoints';

export const getAllDiselConsumption = async () => {
  try {
    return await baseClient.get(APIEndpoints.getDiselConsumption);
  } catch (error) {
    console.error('Error fetching diesel requisition:', error);
  }
};

export const getAllDiselConsumptionbyUserId = async (data: {
  org_id: string;
  createdBy: string;
}) => {
  console.log(data);
  try {
    return await baseClient.post(
      APIEndpoints.getAllConsumableItemsByUserId,
      data,
    );
  } catch (error: any) {
    console.error(
      'Error fetching diesel requisition:',
      error?.data?.message ?? error?.message,
    );
  }
};

export const createDiselConsumption = async (data: any) => {
  try {
    {
      return await baseClient.post(APIEndpoints.createDiselConsumption, data);
    }
  } catch (error) {
    console.error('Error creating diesel requisition:', error);
  }
};
