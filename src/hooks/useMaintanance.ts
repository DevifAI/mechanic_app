import React, {useState} from 'react';
import {
  createMaintananceSheet,
  getAllMaintananceSheet,
  getAllMaintananceSheetByUserId,
  updateMaintananceSheet,
} from '../services/apis/maintanance.services';

import {RootState} from '../redux/store';
import {useSelector} from 'react-redux';
import commonHook from './commonHook';
import {Role} from '../services/api.enviornment';
import Toast from 'react-native-toast-message';

const useMaintanance = () => {
  const [loading, setloading] = useState<boolean>(false);
  const [logItems, setLogItems] = useState<LogItem[]>([]);

  const {orgId, userId, projectId, role} = useSelector(
    (state: RootState) => state.auth,
  );

  const {formatDate} = commonHook();
  type Item = {
    item: string;
    quantity: number;
    uom: string;
    notes: string;
    equipment: string;
  };

  type LogItem = {
    id: string;
    mantainanceLogNo: string;
    note: string;
    equipment: string;
    nextDate: string;
    date: string;
    actionPlan: string;
    items: Item[];
    is_approved_mic?: any;
  is_approved_sic?: string;
  is_approved_pm?: string;
  };

  const getAllMaintananceLog = async () => {
    setloading(true);
    try {
      const response = await getAllMaintananceSheet(Role.mechanic as Role);
      const data = response?.data?.data || response?.data || response || [];
      const transformedData = transformToLogItems(data);
      setLogItems(response?.data);
    } catch (error) {
      console.error('Error fetching maintenance logs:', error);
    } finally {
      setloading(false);
    }
  };

  const getAllMaintananceLogByUserId = async () => {
    setloading(true);
    try {
      const data = {
        org_id: orgId || '',
        createdBy: userId || '',
        project_id: projectId || '',
      };
      const response = await getAllMaintananceSheetByUserId(
        role === Role.mechanic ? data : {projectId: projectId ?? ''},
        (role ?? Role.mechanic) as Role,
      );
      const transformedData = transformToLogItems(
        response?.data?.data || response?.data || response || [],
      );
      setLogItems(response?.data);
    } catch (error) {
      console.error('Error fetching maintenance logs by user ID:', error);
    } finally {
      setloading(false);
    }
  };

const createMaintananceLog = async (data: any, callback: any) => {
  setloading(true);

  try {
    console.log('Creating maintenance log with data:', data);

    const response = await createMaintananceSheet(
      data,
      (role ?? Role.mechanic) as Role,
    );

    // ✅ Success toast
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Maintenance sheet created successfully',
    });

    callback();
  } catch (error: any) {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || 'Unexpected error occurred';

    // ✅ Error handling with toast based on status code
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
        text2: 'Requested resource not found.',
      });
    } else if (status === 500) {
      Toast.show({
        type: 'error',
        text1: 'Server Error',
        text2: 'Internal server error. Please try again later.',
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: message,
      });
    }

    console.error('Error creating maintenance log:', message);
  } finally {
    setloading(false);
  }
};

const updateMaintananceLog = async (data: any, callback: any) => {
  setloading(true);

  try {
    console.log('Updating maintenance log with data:', data);

    const response = await updateMaintananceSheet(
      data,
      (role ?? Role.mechanic) as Role,
    );

    // ✅ Dynamic success message
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

    // ✅ Show error toast based on status
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

    console.error('Error updating maintenance log:', message);
  } finally {
    setloading(false);
  }
};

  function transformToLogItems(data: any[]): LogItem[] {
    return data.map(entry => {
      const logItems: Item[] = entry.items.map((i: any) => ({
        item: i.itemData?.item_name || i.item,
        quantity: Number(i.quantity),
        uom: i.uomData?.unit_name || i.uom_id,
        notes: i.notes,
        equipment: entry.equipmentData?.equipment_name || entry.equipment,
      }));

      return {
        id: entry.id,
        mantainanceLogNo: entry.id, // If there's a separate field, replace accordingly
        note: entry.notes,
        equipment:
          entry.equipment?.equipment_name || entry.equipmentData.equipment_name,
        nextDate: entry.next_date,
        date: formatDate(entry.date),
        actionPlan: entry.action_planned,
        items: logItems,
        mechanicName: entry?.createdByUser?.emp_name || entry?.mechanic_name,
        mechanicInchargeApproval: entry?.is_approve_mic === 'approved',
        siteInchargeApproval: entry?.is_approve_sic === 'approved',
        projectManagerApproval: entry?.is_approve_pm === 'approved',
      };
    });
  }

  return {
    loading,
    logItems,
    getAllMaintananceLog,
    getAllMaintananceLogByUserId,
    createMaintananceLog,
    updateMaintananceLog,
  };
};

export default useMaintanance;
