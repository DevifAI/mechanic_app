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
    mechanicInchargeApproval: boolean;
    siteInchargeApproval: boolean;
    projectManagerApproval: boolean;
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
      // Assuming there's a service function to create a maintenance log
      const response = await createMaintananceSheet(
        data,
        (role ?? Role.mechanic) as Role,
      );
      callback();
    } catch (error: any) {
      console.error('Error creating maintenance log:', error?.data?.message);
    } finally {
      setloading(false);
    }
  };

  const updateMaintananceLog = async (data: any, callback: any) => {
    setloading(true);
    try {
      console.log('Updating maintenance log with data:', data);
      // Assuming there's a service function to update a maintenance log
      const response = await updateMaintananceSheet(
        data,
        (role ?? Role.mechanic) as Role,
      );
      callback();
    } catch (error: any) {
      console.error('Error updating maintenance log:', error?.data?.message);
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
