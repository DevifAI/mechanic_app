import React, {useState} from 'react';
import {ConsumptionItem} from '../pages/Mechanic/Consumption';
import {
  createDiselConsumption,
  getAllDiselConsumption,
  getAllDiselConsumptionbyUserId,
} from '../services/apis/consumptions.services';
import commonHook from './commonHook';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';

const useConsumption = () => {
  const [consumptionData, setConsumptionData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const {orgId, userId} = useSelector((state: RootState) => state.auth);

  const {formatDate} = commonHook();

  const getConsumptionAll = async () => {
    setLoading(true);
    try {
      const response = await getAllDiselConsumption();
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
      const response = await getAllDiselConsumptionbyUserId({
        org_id: orgId ?? '',
        createdBy: userId ?? '',
      });
      const transformedData = transformData(
        response?.data?.data || response?.data || response || [],
      );
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
      const response = await createDiselConsumption(data);
      callback();
    } catch (error: any) {
      console.error('Error creating requisition:', error?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  function transformData(data: any[]): ConsumptionItem[] {
    return data.map(sheet => ({
      id: sheet.id,
      date: formatDate(sheet?.date),
      mechanicInchargeApproval: sheet?.is_approved_mic ?? false,
      siteInchargeApproval: sheet?.is_approved_sic ?? false,
      projectManagerApproval: sheet?.is_approved_pm ?? false,
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
  };
};

export default useConsumption;
