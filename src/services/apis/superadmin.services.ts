import {baseClient} from '../api.clients';
import {APIEndpoints} from '../api.endpoints';

export const getAllConsumableItems = async () => {
  try {
    const response = await baseClient.get(APIEndpoints.consumabaleItem);
    return response;
  } catch (error) {
    console.error('Error fetching consumable items:', error);
  }
};

export const getAllEquipments = async () => {
  try {
    const response = await baseClient.get(APIEndpoints.equipments);
    return response;
  } catch (error) {
    console.error('Error fetching equipments:', error);
  }
};
