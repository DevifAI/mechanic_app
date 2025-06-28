import {useState} from 'react';
import {
  getAllAllMaterialInOrOutUserId,
  createMaterialInOrOut,
  updateMaterialInOrOut,
} from '../services/apis/materialInOrOut.services';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {Role} from '../services/api.enviornment';
import Toast from 'react-native-toast-message';

export enum MaterialDataType {
  IN = 'material_in',
  OUT = 'material_out',
}

const useMaterialInOrOut = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [materials, setMaterials] = useState<any[]>([]);

  const {userId, orgId, projectId, role} = useSelector(
    (state: RootState) => state.auth,
  );

const fetchMaterials = async (dataType: MaterialDataType) => {
  setLoading(true);

  // Use different payload for projectManager
const payload =
  role === Role.projectManager
    ? {
        status: 'all',
        project_id: projectId ?? '',
      }
    : role === Role.admin
    ? {
        data_type: dataType,
        project_id: projectId ?? '',
      }
    : {
        data_type: dataType,
        createdBy: userId ?? '',
        project_id: projectId ?? '',
      };

  try {
    const response = await getAllAllMaterialInOrOutUserId(payload, role as Role);

    const rawResult = response?.data?.data || response?.data || response || [];

    // If role is projectManager, we filter by dataType manually
    const result =
      role === Role.projectManager
        ? rawResult.filter((item: any) => item.data_type === dataType)
        : rawResult;

    setMaterials(result);
  } catch (error) {
    console.error('Error fetching materials:', error);
  } finally {
    setLoading(false);
  }
};


const createMaterial = async (
  payload: any,
  callback?: () => void,
) => {
  setLoading(true);

  try {
    const response = await createMaterialInOrOut(payload, role as Role);

    // ✅ Success toast message based on payload.data_type
    let successMessage = 'Material Transaction created successfully';

    if (payload.data_type === MaterialDataType.IN) {
      successMessage = 'Material In created successfully';
    } else if (payload.data_type === MaterialDataType.OUT) {
      successMessage = 'Material Out created successfully';
    }

    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: successMessage,
    });

    if (callback) callback();
  } catch (error: any) {
    const status = error?.response?.status;
    const message = error?.response?.data?.error || 'Unexpected error occurred';

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
        text2: 'Requested resource not found',
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

    console.error('Error creating material record:', message);
  } finally {
    setLoading(false);
  }
};


const updateMaterial = async (
  payload: {
    material_transaction_id: string;
    status: 'approved' | 'rejected';
  },
  callback: () => void
) => {
  setLoading(true);

  try {
    const finalPayload = {
      ...payload,
      project_id: projectId,
    };

    console.log('Updating material with payload:', finalPayload);

    const response = await updateMaterialInOrOut(
      finalPayload,
      (role ?? Role.mechanic) as Role
    );

    // ✅ Dynamic success message based on status
    const successMessage =
      payload.status === 'approved'
        ? 'Approved successfully'
        : 'Rejected successfully';

    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: successMessage,
    });

    callback();
  } catch (error: any) {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || 'Unexpected error occurred';

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

    console.error('Error updating material record:', message);
  } finally {
    setLoading(false);
  }
};


  return {
    loading,
    materials,
    setMaterials,
    fetchMaterials,
    createMaterial,
    updateMaterial,
  };
};

export default useMaterialInOrOut;
