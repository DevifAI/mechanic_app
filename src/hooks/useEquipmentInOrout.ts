import {useState} from 'react';

import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {Role} from '../services/api.enviornment';
import {
  createEquipmentInOrOut,
  getAllEquipmentInOrOutUserId,
  updateEquipmentInOrOutByProjectManager,
} from '../services/apis/equipmentInOrOut.service';
import Toast from 'react-native-toast-message';

export enum EquipmentDataType {
  IN = 'equipment_in',
  OUT = 'equipment_out',
}

const useEquipmentInOrOut = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [Equipments, setEquipments] = useState<any[]>([]);

  const {projectId, role, userId} = useSelector(
    (state: RootState) => state.auth,
  );

  const fetchEquipments = async (
    dataType: EquipmentDataType,
    status: string,
  ) => {
    setLoading(true);
    const payload = {
      data_type: dataType,
      project_id: projectId ?? '',
      ...(role !== Role.admin && {createdBy: userId ?? ''}),
      status: status || 'all',
    };

    try {
      const response = await getAllEquipmentInOrOutUserId(
        payload,
        role as Role,
        status,
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

    const successMessage =
      payload.data_type === EquipmentDataType.IN
        ? 'Equipment In created successfully'
        : payload.data_type === EquipmentDataType.OUT
        ? 'Equipment Out created successfully'
        : 'Equipment transaction created successfully';

    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: successMessage,
    });

    if (callback) callback();
  } catch (error: any) {
    const status = error?.response?.status;
    const message = error?.response?.data?.error || 'Something went wrong';

    if (status === 400) {
      Toast.show({
        type: 'error',
        text1: 'Bad Request',
        text2: message,
      });
    } else if (status === 404) {
      Toast.show({
        type: 'error',
        text1: 'Not Found',
        text2: message,
      });
    } else if (status === 500) {
      Toast.show({
        type: 'error',
        text1: 'Server Error',
        text2: 'Internal server error occurred.',
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: message,
      });
    }

    console.error('Error creating Equipment record:', message);
  } finally {
    setLoading(false);
  }
};


const updateEquipmentByProjectManager = async (data: any, callBack: any) => {
  try {
    setLoading(true);

    const response = await updateEquipmentInOrOutByProjectManager(
      data,
      role as Role
    );

    // ✅ Show success toast based on status
    const successMessage =
      data.status === 'approved'
        ? 'Approved successfully'
        : data.status === 'rejected'
        ? 'Rejected successfully'
        : 'Status updated successfully';

    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: successMessage,
    });

    if (callBack) callBack();
  } catch (error: any) {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.message || 'Something went wrong while updating.';

    // ✅ Handle different error status codes
    if (status === 400) {
      Toast.show({
        type: 'error',
        text1: 'Bad Request',
        text2: message,
      });
    } else if (status === 404) {
      Toast.show({
        type: 'error',
        text1: 'Not Found',
        text2: message,
      });
    } else if (status === 500) {
      Toast.show({
        type: 'error',
        text1: 'Server Error',
        text2: 'Something went wrong on the server.',
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: message,
      });
    }

    console.error('Error updating Equipment record:', message);
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
      projectManagerApproval: raw.is_approve_pm || 'pending',
      is_approve_pm: raw.is_approve_pm || 'pending',
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
    updateEquipmentByProjectManager,
  };
};

export default useEquipmentInOrOut;
