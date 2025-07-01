import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Role } from '../services/api.enviornment';
import {
  createDieselInvoice,
  getAllDieselInvoiceByUserId,
  getDieselInvoice,
} from '../services/apis/dieselInvoice.services';

const useDieselInvoice = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [dieselInvoices, setDieselInvoices] = useState<any[]>([]);

  const { userId, projectId, role } = useSelector(
    (state: RootState) => state.auth
  );

  const fetchDieselInvoices = async () => {
    setLoading(true);

    // const payload =
    //   role === Role.projectManager
    //     ? {
    //         status: 'all',
    //         project_id: projectId ?? '',
    //       }
    //     : {
    //         createdBy: userId ?? '',
    //         project_id: projectId ?? '',
    //       };

    try {
      const response = await getDieselInvoice(role as Role);
      const result = response?.data?.data || response?.data || response || [];
      setDieselInvoices(result);
    } catch (error) {
      console.error('Error fetching diesel invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDieselInvoiceById = async (
    payload: any,
    callback?: () => void
  ) => {
    setLoading(true);
    try {
      await createDieselInvoice(payload, role as Role);
      if (callback) callback();
    } catch (error: any) {
      console.error('Error creating diesel invoice:', error?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    dieselInvoices,
    setDieselInvoices,
    fetchDieselInvoices,
    createDieselInvoiceById,
  };
};

export default useDieselInvoice;
