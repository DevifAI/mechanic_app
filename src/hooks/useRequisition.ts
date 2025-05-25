import React, {useState} from 'react';
import {
  createDiselRequisition,
  getAllDiselRequisition,
} from '../services/apis/requisition.services';
import {RequisitionItem} from '../pages/Mechanic/Requisition';
import commonHook from './commonHook';

const useRequisition = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [requisitions, setRequisitions] = useState<RequisitionItem[]>([]);

  const {formatDate} = commonHook();

  const getRequisitionsAll = async () => {
    setLoading(true);
    try {
      const response = await getAllDiselRequisition();
      const transformedData = transformToRequisitionItems(
        response?.data?.data || response?.data,
      );
      setRequisitions(transformedData);
    } catch (error) {
      console.error('Error fetching requisitions:', error);
    } finally {
      setLoading(false);
    }
  };

  const createRequisition = async (data: any, callback: any) => {
    setLoading(true);
    try {
      console.log('Creating requisition with data:', data);
      const response = await createDiselRequisition(data);

      callback();
    } catch (error: any) {
      console.error('Error creating requisition:', error?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  function transformToRequisitionItems(data: any[]): RequisitionItem[] {
    return data.map(entry => ({
      id: entry.id,
      date: formatDate(entry.date),
      items: [
        {
          item: entry.consumableItem?.item_name || entry.item,
          quantity: Number(entry.quantity),
          uom: entry.unitOfMeasurement?.unit_name || entry.UOM,
          notes: entry.Notes,
        },
      ],
      mechanicInchargeApproval: entry.is_approve_mic,
      siteInchargeApproval: entry.is_approve_sic,
      projectManagerApproval: entry.is_approve_pm,
    }));
  }

  return {loading, requisitions, getRequisitionsAll, createRequisition};
};

export default useRequisition;
