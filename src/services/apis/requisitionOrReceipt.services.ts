import {baseClient} from '../api.clients';
import {APIEndpoints, roleBasedEndpoints} from '../api.endpoints';
import {RequestType} from '../../hooks/useRequisitionorReceipt';
import {Role} from '../api.enviornment';

export const getAllDiselRequisitionOrReceipt = (
  type: RequestType,
  role: Role,
) => {
  if (type === RequestType.diselReceipt) {
    return baseClient.get(roleBasedEndpoints[role].getAllDiselReceipt);
  }
  if (type === RequestType.diselRequisition) {
    return baseClient.get(roleBasedEndpoints[role].getAllDiselRequisition);
  }
};

export const getAllDiselRequisitionOrReciptbyUserId = (
  data: {
    org_id?: string;
    createdBy?: string;
    project_id?: string;
    projectId?: string;
  },
  type: RequestType,
  role: Role,
) => {
  console.log("............................................................",data);
  if (type === RequestType.diselRequisition) {
    return baseClient.post(
      roleBasedEndpoints[role].getAllDiselRequisitionByUserId,
      data,
    );
  }
  if (type === RequestType.diselReceipt) {
    return baseClient.post(
      roleBasedEndpoints[role].getAllDiselReceiptbyUserId,
      data,
    );
  }
};

export const createDiselRequisitionOrReceipt = (
  data: any,
  type: RequestType,
  role: Role,
) => {
  if (type === RequestType.diselReceipt) {
    return baseClient.post(roleBasedEndpoints[role].createDiselReceipt, data);
  }
  if (type === RequestType.diselRequisition) {
    return baseClient.post(
      roleBasedEndpoints[role].createDiselRequisition,
      data,
    );
  }
};

export const updateDiselRequisitionOrReceipt = (
  data: any,
  type: RequestType,
  role: Role,
) => {
  if (type === RequestType.diselReceipt) {
    return baseClient.post(roleBasedEndpoints[role].updateDiselReceipt, data);
  }
  if (type === RequestType.diselRequisition) {
    return baseClient.post(
      roleBasedEndpoints[role].updateDiselRequisition,
      data,
    );
  }
};

export const getLatestRequisition = (data: any, role: Role) => {
  return baseClient.post(roleBasedEndpoints[role].getLatestRequisition, data);
};
