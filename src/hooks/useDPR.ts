import React, {useState} from 'react';
import {createDpr, getAllDpr} from '../services/apis/dpr.service';
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
        setdprList(transformToDPRDocuments(response.data as any[]));
      } else {
        console.error('No data found in response');
      }
    } catch (error) {
      console.error('Error fetching DPR list:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDPRByRole = async (data: any) => {
    try {
      setLoading(true);
      const response = await createDpr(data, role as Role);
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
      const response = await createDpr(data, role as Role);
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
    return rawReports.map(report => {
      const shift = report.shift || {};
      const jobs: any[] = (report.forms || []).map((form: any) => ({
        timeFrom: form.timeFrom || '',
        timeTo: form.timeTo || '',
        timeTotal: form.timeTotal || '',
        jobDone: form.jobDone || '',
        jobTag: form.jobTag || '',
        revenueCode: form.revenue?.id || '',
      }));

      const dpr: any = {
        id: String(report.id),
        date: report.date,
        customerRepresentative: report.customerRepresentative || '',
        shiftCode: shift.code || '',
        shiftStartTime: shift.startTime || '',
        shiftEndTime: shift.endTime || '',
        shiftIncharge: report.incharge?.name || '',
        shiftMechanic: report.mechanic?.name || '',
        projectManagerApproval: report.projectManagerApproval || '',
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
