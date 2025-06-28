import React, {useState} from 'react';
import {ConsumptionItem} from '../pages/Mechanic/Consumption';
import {
  createDiselConsumption,
  getAllDiselConsumption,
  getAllDiselConsumptionbyUserId,
  updateDiselConsumption,
} from '../services/apis/consumptions.services';
import commonHook from './commonHook';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {Role} from '../services/api.enviornment';
import Toast from 'react-native-toast-message';

const useConsumption = () => {
  const [consumptionData, setConsumptionData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const {orgId, userId, projectId, role} = useSelector(
    (state: RootState) => state.auth,
  );

  const {formatDate} = commonHook();

  const getConsumptionAll = async () => {
    setLoading(true);
    try {
      const response = await getAllDiselConsumption(
        (role ?? Role.mechanic) as Role,
      );
      const transformedData = transformData(
        response?.data?.data || response?.data,
      );
      console.log('.........response?.data...................', response?.data);
      setConsumptionData(response?.data);
    } catch (error) {
      console.error('Error fetching requisitions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getConsumptionByUserId = async () => {
    setLoading(true);
    try {
      const response = await getAllDiselConsumptionbyUserId(
        role === Role.mechanic
          ? {
              org_id: orgId ?? '',
              createdBy: userId ?? '',
              project_id: projectId ?? '',
            }
          : {projectId: projectId ?? ''},
        (role ?? Role.mechanic) as Role,
      );
      const transformedData = transformData(
        response?.data?.data || response?.data || response || [],
      );
      console.log('Fetched consumption data:', transformedData);
      console.log('.........response?.data...................', response?.data);
      setConsumptionData(response?.data);
    } catch (error: any) {
      console.error(
        'Error fetching requisitions:',
        error?.message ?? error?.data?.message,
      );
    } finally {
      setLoading(false);
    }
  };

 const createConsumption = async (data: any, callback: any) => {
  setLoading(true);

  try {
    console.log('Creating consumption with data:', data);

    const response = await createDiselConsumption(
      data,
      (role ?? Role.mechanic) as Role,
    );

    // ✅ Success toast
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Consumption sheet created successfully',
    });

    callback();
  } catch (error: any) {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || 'Unexpected error occurred';

    // ✅ Error handling based on status code
    if (status === 400) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: message,
      });
    } else if (status === 404) {
      Toast.show({
        type: 'error',
        text1: 'Not Found',
        text2: 'Requested resource not found',
      });
    } else if (status === 500) {
      Toast.show({
        type: 'error',
        text1: 'Server Error',
        text2: 'Failed to create consumption sheet. Please try again later.',
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: message,
      });
    }

    console.error('Error creating consumption:', message);
  } finally {
    setLoading(false);
  }
};

 const updateConsumption = async (data: any, callback: any) => {
  setLoading(true);

  try {
    console.log('Updating consumption with data:', data);

    const response = await updateDiselConsumption(
      data,
      (role ?? Role.mechanic) as Role,
    );

    // ✅ Dynamic success message based on status
    let successMessage = 'Status updated successfully';
    if (data.status === 'approved') {
      successMessage = 'Approved successfully';
    } else if (data.status === 'rejected') {
      successMessage = 'Rejected successfully';
    }

    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: successMessage,
    });

    callback();
  } catch (error: any) {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || 'Unexpected error occurred';

    // ✅ Error handling based on status code
    if (status === 400) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Request',
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

    console.error('Error updating consumption:', message);
  } finally {
    setLoading(false);
  }
};

  function transformData(data: any[]): any[] {
    return data.map(sheet => ({
      id: sheet.id,
      date: formatDate(sheet?.date),
      mechanicName: sheet?.createdByUser?.emp_name || sheet?.mechanic_name,
      mechanicInchargeApproval: sheet?.is_approve_mic === 'approved',
      siteInchargeApproval: sheet?.is_approve_sic === 'approved',
      projectManagerApproval: sheet?.is_approve_pm === 'approved',
      items: (sheet.items || []).map((item: any) => ({
        id: item?.id,
        equipment: item?.equipmentData?.equipment_name,
        item: item?.itemData?.item_name,
        quantity: item?.quantity ?? 0,
        uom: item?.uomData?.unit_name || '',
        notes: item?.notes ?? null,
      })),
    }));
  }

  return {
    loading,
    consumptionData,
    getConsumptionAll,
    createConsumption,
    getConsumptionByUserId,
    updateConsumption,
  };
};

export default useConsumption;
