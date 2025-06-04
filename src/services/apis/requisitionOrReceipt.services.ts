import {baseClient} from '../api.clients';
import {APIEndpoints} from '../api.endpoints';
import {RequestType} from '../../hooks/useRequisitionorReceipt';

export const getAllDiselRequisitionOrReceipt = (type: RequestType) => {
  if (type === RequestType.diselReceipt) {
    return baseClient.get(APIEndpoints.getAllDiselReceipt);
  }
  if (type === RequestType.diselRequisition) {
    return baseClient.get(APIEndpoints.getAllDiselRequisition);
  }
};

export const getAllDiselRequisitionOrReciptbyUserId = (
  data: {
    org_id: string;
    createdBy: string;
    project_id: string;
  },
  type: RequestType,
) => {
  console.log(data);
  if (type === RequestType.diselRequisition) {
    return baseClient.post(APIEndpoints.getAllDiselRequisitionByUserId, data);
  }
  if (type === RequestType.diselReceipt) {
    return baseClient.post(APIEndpoints.getAllDiselReceiptbyUserId, data);
  }
};

export const createDiselRequisitionOrReceipt = (
  data: any,
  type: RequestType,
) => {
  if (type === RequestType.diselReceipt) {
    return baseClient.post(APIEndpoints.createDiselReceipt, data);
  }
  if (type === RequestType.diselRequisition) {
    return baseClient.post(APIEndpoints.createDiselRequisition, data);
  }
};
