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
      setConsumptionData(transformedData);
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
      setConsumptionData(transformedData);
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
      callback();
    } catch (error: any) {
      console.error('Error creating requisition:', error?.data?.message);
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
      callback();
    } catch (error: any) {
      console.error('Error updating consumption:', error?.data?.message);
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
