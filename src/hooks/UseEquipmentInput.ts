import {useState} from 'react';
// import {
//   getAllAllMaterialInOrOutUserId,
//   createMaterialInOrOut,
//   updateMaterialInOrOut,
// } from '../services/apis/materialInOrOut.services';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {Role} from '../services/api.enviornment';
import { createExpenseInput, getAllExpenseInputByUserId } from '../services/apis/expenseInput.services';

// export enum MaterialDataType {
//   IN = 'material_in',
//   OUT = 'material_out',
// }

const useExpenseInput = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [expenseInput, setExpenseInput] = useState<any[]>([]);

  const {userId, orgId, projectId, role} = useSelector(
    (state: RootState) => state.auth,
  );

const fetchExpenseInput= async () => {
  setLoading(true);

  // Use different payload for projectManager
  const payload =
    role === Role.projectManager
      ? {
          status: 'all',
          project_id: projectId ?? '',
        }
      : {
        //   data_type: dataType,
          createdBy: userId ?? '',
          project_id: projectId ?? '',
        };

  try {
    const response = await getAllExpenseInputByUserId(payload, role as Role);

    const rawResult = response?.data?.data || response?.data || response || [];

    // If role is projectManager, we filter by dataType manually
    // const result =
    //   role === Role.projectManager
    //     ? rawResult.filter((item: any) => item.data_type === dataType)
    //     : rawResult;

    setExpenseInput(rawResult);
  } catch (error) {
    console.error('Error fetching materials:', error);
  } finally {
    setLoading(false);
  }
};


  const createExpenseInputById = async (
    payload: any,
    callback?: () => void,
  ) => {
    setLoading(true);
    try {
      const response = await createExpenseInput(payload, role as Role);
      if (callback) callback();
    } catch (error: any) {
      console.error('Error creating material record:', error?.data?.message);
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
    expenseInput,
    setExpenseInput,
    fetchExpenseInput,
    createExpenseInputById,
    // updateMaterial,
  };
};

export default useExpenseInput;
