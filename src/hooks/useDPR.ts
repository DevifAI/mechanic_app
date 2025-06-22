import React, {useState} from 'react';
import {
  createDpr,
  getAllDpr,
  updateDprById,
} from '../services/apis/dpr.service';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {Role} from '../services/api.enviornment';

const useDPR = () => {
  const {role, projectId} = useSelector((state: RootState) => state.auth);
  const [dprList, setdprList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const fetchDPRList = async () => {
    try {
      setLoading(true);

      const response = await getAllDpr(role as Role, {
        project_id: projectId ?? '',
      });
      if (response?.data) {
        setdprList(
          transformToDPRDocuments(
            (response?.data?.data || response?.data || response || []) as any[],
          ),
        );
      } else {
        console.error('No data found in response');
      }
    } catch (error) {
      console.error('Error fetching DPR list:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDPRByRole = async (data: any, callback?: any) => {
    try {
      console.log('Creating DPR with data:', data);
      setLoading(true);
      const response = await createDpr(data, role as Role);
      if (response?.data) {
        if (callback) callback();
      }
    } catch (error) {
      console.error('Error creating DPR:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateDPRByProjectManager = async (data: any, callBack: any) => {
    if (role !== Role.projectManager) {
      console.error('Unauthorized role for updating DPR');
      return;
    }
    try {
      setLoading(true);
      console.log('Updating DPR with data:', data);
      const response = await updateDprById(data, role as Role);

      if (response?.data) {
        if (callBack) callBack();
        console.log('DPR updated successfully:', response.data);
      } else {
        console.error('No data found in response');
      }
    } catch (error) {
      console.error('Error updating DPR:', error);
    } finally {
      setLoading(false);
    }
  };

  function transformToDPRDocuments(rawReports: any[]): any[] {
    console.log('Transforming raw DPR reports:', rawReports);
    return rawReports.map(report => {
      const shift = report.shift || {};
      const jobs: any[] = (report.forms || []).map((form: any) => ({
        timeFrom: form.time_from || '',
        timeTo: form.time_to || '',
        timeTotal: form.time_total || '',
        jobDone: form.job_done || '',
        jobTag: form.job_tag || 'NA',
        revenueCode: form.revenue?.revenue_code || '',
      }));

      const dpr: any = {
        id: String(report.id),
        date: report.date,
        customerRepresentative: report.customer_representative || '',
        shiftCode: shift.shift_code || '',
        shiftStartTime: shift.shift_from_time || '',
        shiftEndTime: shift.shift_to_time || '',
        shiftIncharge: report.incharge?.emp_name || '',
        shiftMechanic: report.mechanic?.emp_name || '',
        projectManagerApproval: report.is_approve_pm || 'pending',
        jobs,
      };

      return dpr;
    });
  }

  return {
    dprList,
    fetchDPRList,
    createDPRByRole,
    loading,
    updateDPRByProjectManager,
  };
};

export default useDPR;
