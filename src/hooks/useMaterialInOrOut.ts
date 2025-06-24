import {useState} from 'react';
import {
  getAllAllMaterialInOrOutUserId,
  createMaterialInOrOut,
  updateMaterialInOrOut,
} from '../services/apis/materialInOrOut.services';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {Role} from '../services/api.enviornment';

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
      if (callback) callback();
    } catch (error: any) {
      console.error('Error creating material record:', error?.data?.message);
    } finally {
      setLoading(false);
    }
  };

const updateMaterial = async (
  payload: {
    material_transaction_id: string;
    status:  'approved' | 'rejected';
  },
  callback: () => void
) => {
  setLoading(true); // Show loading indicator

  try {
    const finalPayload = {
      ...payload,
      project_id: projectId, // Add project_id here
    };

    console.log('Updating material with payload:', finalPayload);

    const response = await updateMaterialInOrOut(
      finalPayload,
      (role ?? Role.mechanic) as Role
    );

    callback(); // Run callback on success

  } catch (error: any) {
    console.error('Error updating material record:', error?.data?.message);
  } finally {
    setLoading(false); // Hide loading indicator
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
