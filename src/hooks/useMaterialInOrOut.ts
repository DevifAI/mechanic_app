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
    const payload = {
      data_type: dataType,
      project_id: projectId ?? '',
      // org_id: orgId || '',
      // createdBy: userId || '',
    };

    try {
      const response = await getAllAllMaterialInOrOutUserId(payload, role as Role);
      const result =
        response?.data?.data || response?.data || response || [];

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
    payload: any,
    callback?: () => void,
  ) => {
    setLoading(true);
    try {
      const response = await updateMaterialInOrOut(payload, role as Role);
      if (callback) callback();
    } catch (error: any) {
      console.error('Error updating material record:', error?.data?.message);
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
