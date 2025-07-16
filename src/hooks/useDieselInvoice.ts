import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Role } from '../services/api.enviornment';
import {
  createDieselInvoice,
  getAllDieselInvoiceByUserId,
  getDieselInvoice,
} from '../services/apis/dieselInvoice.services';
import Toast from 'react-native-toast-message';

const useDieselInvoice = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [dieselInvoices, setDieselInvoices] = useState<any[]>([]);

  const { userId, projectId, role } = useSelector(
    (state: RootState) => state.auth
  );

  const fetchDieselInvoices = async () => {
    setLoading(true);

    const payload = {project_id: projectId}

    try {
      const response = await getDieselInvoice(payload , role as Role);
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
        Toast.show({
      type: 'success',
      text1: 'Diesel Invoice Created successfully',
    });
      if (callback) callback();
    } catch (error: any) {
      console.error('Error creating diesel invoice:', error?.data?.message);
       Toast.show({
      type: 'error',
      text1: 'Creation Failed',
      text2: error?.data?.message || 'Something went wrong while creating the diesel invoice.',
    });
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
