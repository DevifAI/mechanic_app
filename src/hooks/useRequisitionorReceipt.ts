import React, {useState} from 'react';
import {
  createDiselRequisitionOrReceipt,
  getAllDiselRequisitionOrReceipt,
  getAllDiselRequisitionOrReciptbyUserId,
  getLatestRequisition,
  updateDiselRequisitionOrReceipt,
} from '../services/apis/requisitionOrReceipt.services';
// import {RequisitionItem} from '../pages/Mechanic/RequisitionorReceipt';
import commonHook from './commonHook';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {Role} from '../services/api.enviornment';
import {roleBasedEndpoints} from '../services/api.endpoints';

export enum RequestType {
  diselRequisition,
  diselReceipt,
}

const useRequisition = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [requisitions, setRequisitions] = useState<any[]>([]);
  const [latestRequisition, setLatestRequisition] = useState<any[]>([]);

  const {userId, orgId, projectId, role} = useSelector(
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
      const response = await getAllDiselRequisitionOrReciptbyUserId(
        role === Role.mechanic ? data : {projectId: projectId ?? ''},
        type,
        (role ?? Role.mechanic) as Role,
      );
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

  const getLatestRequisitionData = async () => {
    setLoading(true);
    try {
      const data = {
        org_id: orgId || '',
        createdBy: userId || '',
        project_id: projectId ?? '',
      };
      console.log('Current role:', role);
      console.log(
        'Available keys in roleBasedEndpoints:',
        Object.keys(roleBasedEndpoints),
      );
      const response = await getLatestRequisition(
        role === Role.mechanic ? data : {project_id: projectId ?? ''},
        (role ?? Role.mechanic) as Role,
      );
      const transformedData = transformToRequisitionItems(
        response?.data?.data || response?.data || response || [],
      );
      setLatestRequisition(transformedData);
      console.log('Fetched latest requisition:', latestRequisition);
    } catch (error) {
      console.error('Error fetching latest requisition:', error);
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
      const response = await createDiselRequisitionOrReceipt(
        data,
        type,
        (role ?? Role.mechanic) as Role,
      );
      callback();
    } catch (error: any) {
      console.error('Error creating requisition:', error?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const updateRequisitionOrReceipt = async (
    data: any,
    callback: any,
    type: RequestType,
  ) => {
    setLoading(true);
    try {
      // Implement the update logic here
      console.log('Updating requisition or receipt');
      const response = await updateDiselRequisitionOrReceipt(
        data,
        type,
        (role ?? Role.mechanic) as Role,
      );
      callback();
    } catch (error: any) {
      console.error(
        'Error updating requisition or receipt:',
        error?.data?.message,
      );
    } finally {
      setLoading(false);
    }
  };

  function transformToRequisitionItems(data: any[]): any[] {
    console.log(data, 'before formatting');
    return data.map(entry => ({
      id: entry?.id,
      date: formatDate(entry?.date),
      mechanicName: entry?.createdByEmployee?.emp_name || entry?.mechanic_name,
      items:
        entry?.items?.map((item: any) => ({
          item: item?.consumableItem?.item_name || item?.item,
          quantity: Number(item?.quantity),
          uom: item?.unitOfMeasurement?.unit_name || item?.UOM,
          notes: item?.Notes,
          itemDescription: item?.item_description,
        })) || [],
      mechanicInchargeApproval: entry?.is_approve_mic === 'approved',
      siteInchargeApproval: entry?.is_approve_sic === 'approved',
      projectManagerApproval: entry?.is_approve_pm === 'approved',
    }));
  }

  return {
    loading,
    requisitions,
    getRequisitionsorReceiptsAll,
    createRequisitionorReceipt,
    getLatestRequisitionData,
    updateRequisitionOrReceipt,
    latestRequisition,
  };
};

export default useRequisition;
