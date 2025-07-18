import {useState} from 'react';
// import {
//   getAllAllMaterialInOrOutUserId,
//   createMaterialInOrOut,
//   updateMaterialInOrOut,
// } from '../services/apis/materialInOrOut.services';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {Role} from '../services/api.enviornment';
import { createMaterialBill, getAllMaterialBillByUserId, getMaterialBill } from '../services/apis/materialBill.services';
import Toast from 'react-native-toast-message';

// export enum MaterialDataType {
//   IN = 'material_in',
//   OUT = 'material_out',
// }

const useMaterialBill = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [materialBill, setMaterialBill] = useState<any[]>([]);

  const {userId, orgId, projectId, role} = useSelector(
    (state: RootState) => state.auth,
  );

const fetchMaterialBills = async () => {
  setLoading(true);

  const payload ={project_id: projectId ?? '',}

  try {
    const response = await getAllMaterialBillByUserId(payload, role as Role);

    const rawResult = response?.data?.data || response?.data || response || [];

    // If role is projectManager, we filter by dataType manually
    // const result =
    //   role === Role.projectManager
    //     ? rawResult.filter((item: any) => item.data_type === dataType)
    //     : rawResult;

    setMaterialBill(rawResult);
  } catch (error) {
    console.error('Error fetching materials:', error);
  } finally {
    setLoading(false);
  }
};

const fetchCombinedBillsAndMaterials = async () => {
  setLoading(true);

  // Use different payload for projectManager
  const payload ={project_id: projectId ?? '',}

  try {
    const response = await getAllMaterialBillByUserId(payload, role as Role);

    const rawResult = response?.data?.data || response?.data || response || [];

    // If role is projectManager, we filter by dataType manually
    // const result =
    //   role === Role.projectManager
    //     ? rawResult.filter((item: any) => item.data_type === dataType)
    //     : rawResult;

    setMaterialBill(rawResult);
  } catch (error) {
    console.error('Error fetching materials:', error);
  } finally {
    setLoading(false);
  }
};


  const createMaterialBillById = async (
    payload: any,
    callback?: () => void,
  ) => {
    setLoading(true);
    try {
      const response = await createMaterialBill(payload, role as Role);
        Toast.show({
      type: 'success',
      text1: 'Material Bill Created successfully',
    });
      if (callback) callback();
    } catch (error: any) {
      console.error('Error creating material record:', error?.data?.message);
       Toast.show({
      type: 'error',
      text1: 'Creation Failed',
      text2: error?.data?.message || 'Something went wrong while creating the material bill.',
    });
    } finally {
      setLoading(false);
    }
  };

// const updateMaterial = async (
//   payload: {
//     material_transaction_id: string;
//     status:  'approved' | 'rejected';
//   },
//   callback: () => void
// ) => {
//   setLoading(true); // Show loading indicator

//   try {
//     const finalPayload = {
//       ...payload,
//       project_id: projectId, // Add project_id here
//     };

//     console.log('Updating material with payload:', finalPayload);

//     const response = await updateMaterialInOrOut(
//       finalPayload,
//       (role ?? Role.mechanic) as Role
//     );

//     callback(); // Run callback on success

//   } catch (error: any) {
//     console.error('Error updating material record:', error?.data?.message);
//   } finally {
//     setLoading(false); // Hide loading indicator
//   }
// };



  return {
    loading,
    materialBill,
    setMaterialBill,
    fetchMaterialBills,
    createMaterialBillById,
    fetchCombinedBillsAndMaterials
    // updateMaterial,
  };
};

export default useMaterialBill;

