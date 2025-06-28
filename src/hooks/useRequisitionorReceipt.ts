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
import Toast from 'react-native-toast-message';

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
       
        setRequisitions(response?.data);
      }
      if (type === RequestType.diselReceipt) {
        const transformedData = transformToRequisitionItems(
          response?.data?.data || response?.data || response || [],
        );
         console.log("^^^^^^^^^^^7777777777777777777^^^", response?.data)
        setRequisitions(response?.data);
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
        response?.data?.data
          ? [response.data.data]
          : response?.data
          ? [response.data]
          : response
          ? [response]
          : [],
      );
      console.log('Transformed latest requisition data:', response?.data?.data);
      setLatestRequisition(response?.data);
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

    if (type === RequestType.diselRequisition || type === RequestType.diselReceipt) {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2:
          type === RequestType.diselRequisition
            ? 'Diesel Requisition created successfully'
            : 'Diesel Receipt created successfully',
      });
    }

    callback();
  } catch (error: any) {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || 'Unexpected error occurred';

    if (status === 400) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: message,
      });
    } else if (status === 404) {
      Toast.show({
        type: 'error',
        text1: 'Not Found',
        text2: message,
      });
    } else if (status === 409) {
      Toast.show({
        type: 'error',
        text1: 'Conflict',
        text2: message,
      });
    } else if (status === 500) {
      Toast.show({
        type: 'error',
        text1: 'Server Error',
        text2: 'Something went wrong.',
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: message,
      });
    }

    console.error('Error creating requisition:', message);
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
    console.log('Updating requisition or receipt');

    const response = await updateDiselRequisitionOrReceipt(
      data,
      type,
      (role ?? Role.mechanic) as Role,
    );

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

    // ✅ Show error toasts based on backend status code
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

    console.error('Error updating requisition or receipt:', message);
  } finally {
    setLoading(false);
  }
};

  function transformToRequisitionItems(data: any[]): any[] {
    console.log(data, '📦 Raw data before formatting');

    const transformed: any[] = [];

    data.forEach((entry, index) => {
      try {
        const transformedEntry = {
          id: entry?.id,
          date: formatDate(entry?.date),
          mechanicName:
            entry?.createdByEmployee?.emp_name || entry?.mechanic_name,
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
        };

        transformed.push(transformedEntry);
      } catch (error) {
        console.error(`❌ Error transforming entry at index ${index}:`, entry);
        console.error(error);
      }
    });

    console.log(transformed, '✅ Transformed requisition items');
    return transformed;
  }

  return {
    loading,
    requisitions,
    setRequisitions,
    getRequisitionsorReceiptsAll,
    createRequisitionorReceipt,
    getLatestRequisitionData,
    updateRequisitionOrReceipt,
    latestRequisition,
  };
};

export default useRequisition;
