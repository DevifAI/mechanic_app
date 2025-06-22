import {useState} from 'react';

import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {Role} from '../services/api.enviornment';
import {
  createEquipmentInOrOut,
  getAllEquipmentInOrOutUserId,
} from '../services/apis/equipmentInOrOut.service';

export enum EquipmentDataType {
  IN = 'equipment_in',
  OUT = 'equipment_out',
}

const useEquipmentInOrOut = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [Equipments, setEquipments] = useState<any[]>([]);

  const {projectId, role} = useSelector((state: RootState) => state.auth);

  const fetchEquipments = async (dataType: EquipmentDataType) => {
    setLoading(true);
    const payload = {
      data_type: dataType,
      project_id: projectId ?? '',
    };

    try {
      const response = await getAllEquipmentInOrOutUserId(
        payload,
        role as Role,
      );
      const result = response?.data?.data || response?.data || response || [];

      setEquipments(result);
    } catch (error) {
      console.error('Error fetching Equipments:', error);
    } finally {
      setLoading(false);
    }
  };

  const createEquipment = async (payload: any, callback?: () => void) => {
    setLoading(true);
    try {
      const response = await createEquipmentInOrOut(payload, role as Role);
      if (callback) callback();
    } catch (error: any) {
      console.error('Error creating Equipment record:', error?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    Equipments,
    setEquipments,
    fetchEquipments,
    createEquipment,
  };
};

export default useEquipmentInOrOut;
