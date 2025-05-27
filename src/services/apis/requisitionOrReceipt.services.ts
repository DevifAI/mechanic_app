import {baseClient} from '../api.clients';
import {APIEndpoints} from '../api.endpoints';
import {RequestType} from '../../hooks/useRequisitionorReceipt';

export const getAllDiselRequisitionOrReceipt = async (type: RequestType) => {
  try {
    if (type === RequestType.diselReceipt) {
      return await baseClient.get(APIEndpoints.getAllDiselReceipt);
    }
    if (type === RequestType.diselRequisition) {
      return await baseClient.get(APIEndpoints.getAllDiselRequisition);
    }
  } catch (error) {
    console.error('Error fetching diesel requisition:', error);
  }
};

export const createDiselRequisitionOrReceipt = async (
  data: any,
  type: RequestType,
) => {
  try {
    if (type === RequestType.diselReceipt) {
      return await baseClient.post(APIEndpoints.createDiselReceipt, data);
    }
    if (type === RequestType.diselRequisition) {
      return await baseClient.post(APIEndpoints.createDiselRequisition, data);
    }
  } catch (error) {
    console.error('Error creating diesel requisition:', error);
  }
};
