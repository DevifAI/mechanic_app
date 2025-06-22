import {baseClient} from '../api.clients';
import {APIEndpoints} from '../api.endpoints';

export const getAllConsumableItems = async () => {
  return baseClient.get(APIEndpoints.consumabaleItem);
};

export const getAllEquipments = async () => {
  return baseClient.get(APIEndpoints.equipments);
};

export const getAllPartners = async () => {
  return baseClient.get(APIEndpoints.patners);
};

export const getAllShifts = async () => {
  return baseClient.get(APIEndpoints.shifts);
};

export const getProjectsByUserId = (userId: string) => {
  return baseClient.get(`${APIEndpoints.getProjectsByUserId}/${userId}`);
};
