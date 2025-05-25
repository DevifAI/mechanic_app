import {baseClient} from '../api.clients';
import {APIEndpoints} from '../api.endpoints';

export const getAllDiselRequisition = async () => {
  try {
    const response = await baseClient.get(APIEndpoints.getAllDiselRequisition);
    return response;
  } catch (error) {
    console.error('Error fetching diesel requisition:', error);
  }
};

export const createDiselRequisition = async (data: any) => {
  try {
    const response = await baseClient.post(
      APIEndpoints.createDiselRequisition,
      data,
    );
    return response;
  } catch (error) {
    console.error('Error creating diesel requisition:', error);
  }
};
