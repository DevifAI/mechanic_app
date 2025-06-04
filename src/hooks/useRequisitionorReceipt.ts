import React, {useState} from 'react';
import {
  createDiselRequisitionOrReceipt,
  getAllDiselRequisitionOrReceipt,
  getAllDiselRequisitionOrReciptbyUserId,
} from '../services/apis/requisitionOrReceipt.services';
import {RequisitionItem} from '../pages/Mechanic/RequisitionorReceipt';
import commonHook from './commonHook';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';

export enum RequestType {
  diselRequisition,
  diselReceipt,
}

const useRequisition = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [requisitions, setRequisitions] = useState<RequisitionItem[]>([]);

  const {userId, orgId, projectId} = useSelector(
    (state: RootState) => state.auth,
  );

  const {formatDate} = commonHook();

  const getRequisitionsorReceiptsAll = async (type: RequestType) => {
    setLoading(true);
    const data = {
      org_id: orgId || '',
      createdBy: userId || '',
      project_id: projectId ?? '',
    };
    try {
      const response = await getAllDiselRequisitionOrReciptbyUserId(data, type);
      if (type === RequestType.diselRequisition) {
        const transformedData = transformToRequisitionItems(
          response?.data?.data || response?.data || response || [],
        );
        setRequisitions(transformedData);
      }
      if (type === RequestType.diselReceipt) {
        const transformedData = transformToRequisitionItems(
          response?.data?.data || response?.data || response || [],
        );
        setRequisitions(transformedData);
      }
      console.log('Fetched requisitions:', requisitions);
    } catch (error) {
      console.error('Error fetching requisitions:', error);
    } finally {
      setLoading(false);
    }
  };

  const createRequisitionorReceipt = async (
    data: any,
    callback: any,
    type: RequestType,
  ) => {
    setLoading(true);
    try {
      console.log('Creating requisition with data:', data);
      const response = await createDiselRequisitionOrReceipt(data, type);
      callback();
    } catch (error: any) {
      console.error('Error creating requisition:', error?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  function transformToRequisitionItems(data: any[]): RequisitionItem[] {
    console.log(data);
    return data.map(entry => ({
      id: entry.id,
      date: formatDate(entry.date),
      items: [
        {
          item: entry.consumableItem?.item_name || entry?.item,
          quantity: Number(entry?.quantity),
          uom: entry.unitOfMeasurement?.unit_name || entry.UOM,
          notes: entry?.Notes,
        },
      ],
      mechanicInchargeApproval: entry?.is_approve_mic,
      siteInchargeApproval: entry?.is_approve_sic,
      projectManagerApproval: entry?.is_approve_pm,
    }));
  }

  return {
    loading,
    requisitions,
    getRequisitionsorReceiptsAll,
    createRequisitionorReceipt,
  };
};

export default useRequisition;
