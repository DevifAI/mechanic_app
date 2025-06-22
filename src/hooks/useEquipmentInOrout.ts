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

      console.log('Fetched Equipments:', result);

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

  function transformToEquipmentInItem(raw: any): any {
    const items: any[] = (raw.formItems || []).map((item: any) => ({
      equipment: item.equipment || '',
      quantity: item.quantity || 0,
      uom: item.uom || '',
      notes: item.notes || '',
    }));

    const transformed: any = {
      id: raw.id,
      date: raw.date,
      items,
      accountManagerApproval: raw.is_approve_am || 'pending', // fallback if not present
      projectManagerApproval: raw.is_approve_pm || 'pending',
      type: raw.type,
      partner_name: raw.partnerDetails?.partner_name || raw.partner || '',
    };

    return transformed;
  }

  return {
    loading,
    Equipments,
    setEquipments,
    fetchEquipments,
    createEquipment,
  };
};

export default useEquipmentInOrOut;
