import React, {use, useState} from 'react';
import {
  getAllConsumableItems,
  getAllEquipments,
  getAllPartners,
  getAllShifts,
  getEmployeeByDPRRole,
  getProjectsByUserId,
  getRevenue,
} from '../services/apis/superadmin.services';
import {useDispatch, useSelector} from 'react-redux';
import {
  updateCurrentProject,
  updateProjectList,
} from '../redux/slices/authSlice';
import {RootState} from '../redux/store';
type SimplifiedItem = {
  id: string;
  uomId: string;
  name: string;
  uom: string;
};
const useSuperadmin = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [consumabaleItems, setConsumabaleItems] = useState<SimplifiedItem[]>(
    [],
  );

  const {projectId} = useSelector((state: RootState) => state.auth);

  const [equipments, setEquipments] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [shifts, setShifts] = useState<any[]>([]);

  const [shiftInChargeList, setShiftInChargeLIst] = useState<any[]>([]);
  const [shiftMechanicList, setShiftMechanicList] = useState<any[]>([]);

  const [revenue, setRevenue] = useState<any[]>([]);

  const dispatch = useDispatch();
  const getConsumableItems = async () => {
    setLoading(true);
    try {
      // Simulate an API call to fetch consumable items
      const response = await getAllConsumableItems();
      const transformedItems = transformConsumableItems(
        response?.data?.data || response?.data || response || [],
      );
      setConsumabaleItems(transformedItems);
    } catch (error) {
      console.error('Error fetching consumable items:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEquipments = async () => {
    setLoading(true);
    try {
      const response = await getAllEquipments();
      // Transform the response data to match the expected format
      console.log('Fetched equipments:', response);
      const transformedEquipments = transformEquipments(
        response?.data?.data || response?.data || response || [],
      );
      console.log('Fetched equipments:', transformedEquipments);
      setEquipments(transformedEquipments);
    } catch (error) {
      console.error('Error fetching equipments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPartners = async () => {
    setLoading(true);
    try {
      const response = await getAllPartners();
      // Transform the response data to match the expected format
      console.log('Fetched Partners:', response);
      const transformedpartners = transformPartners(
        response?.data?.data || response?.data || response || [],
      );
      console.log(
        'Fetched partnersppppppppppppppppppppppppppppppppppppppppp:',
        transformedpartners,
      );
      setPartners(transformedpartners);
    } catch (error) {
      console.error('Error fetching equipments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getShifts = async () => {
    setLoading(true);
    try {
      // Simulate an API call to fetch shifts
      // Replace with actual API call when available
      const response = await getAllShifts(); // Placeholder for actual shift API
      console.log('Fetched shifts:', response);

      const transformedShifts = transformShifts(
        response?.data?.data || response?.data || response || [],
      );
      // Process the response as needed

      setShifts(transformedShifts);
    } catch (error) {
      console.error('Error fetching shifts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getShiftInChargeAndShiftMechanic = async () => {
    setLoading(true);
    try {
      // Simulate an API call to fetch shifts
      // Replace with actual API call when available
      const shiftInchargebody = {
        project_id: projectId,
        role_name: 'Shift Incharge',
      };
      const shiftMechanicBody = {project_id: projectId, role_name: 'mechanic'};
      const shiftInChargeResponse = await getEmployeeByDPRRole(
        shiftInchargebody,
      );
      const transformedShiftInCharge = transformShiftInChargeOrMechanic(
        shiftInChargeResponse?.data?.data ||
          shiftInChargeResponse?.data ||
          shiftInChargeResponse ||
          [],
      );

      const shiftMechanicResponse = await getEmployeeByDPRRole(
        shiftMechanicBody,
      );

      const transformedShiftMechanic = transformShiftInChargeOrMechanic(
        shiftMechanicResponse?.data?.data ||
          shiftMechanicResponse?.data ||
          shiftMechanicResponse ||
          [],
      );

      // Process the response as needed

      setShiftInChargeLIst(transformedShiftInCharge);
      setShiftMechanicList(transformedShiftMechanic);
    } catch (error) {
      console.error('Error fetching shifts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenueList = async () => {
    setLoading(true);
    try {
      // Simulate an API call to fetch revenue
      // Replace with actual API call when available
      const response = await getRevenue();
      const transformedRevenue = transformRevenue(
        response?.data?.data || response?.data || response || [],
      );
      console.log('Fetched Revenue:', transformedRevenue);
      setRevenue(transformedRevenue);
    } catch (error) {
      console.error('Error fetching revenue:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProjectsUsingUserId = async (userId: string) => {
    setLoading(true);
    try {
      // Simulate an API call to fetch projects using userId
      // Replace with actual API call when available
      const response = await getProjectsByUserId(userId);

      console.log("getProjectsUsingUserId....................." , response)
      
      const transformedProjects =
        response?.data?.data || response?.data || response || [];

      dispatch(updateProjectList(transformedProjects?.projects));
      dispatch(updateCurrentProject(transformedProjects?.projects[0]?.id));
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  function transformConsumableItems(data: any[]): SimplifiedItem[] {
    return data.map(item => ({
      id: item.id,
      uomId: item.uom.id,
      name: item.item_name,
      uom: item.uom.unit_name,
    }));
  }
  function transformEquipments(data: any[]): {name: string; id: string}[] {
    console.log('Transforming equipments:', data);
    return data.map(item => ({
      id: item.id,

      name: item.equipment_name,
    }));
  }
  function transformPartners(data: any[]): {name: string; id: string}[] {
    console.log('Transforming Partners:', data);
    return data.map(item => ({
      id: item.id,
      name: item.partner_name,
    }));
  }

  function transformShifts(data: any[]): {[key: string]: string}[] {
    console.log('Transforming Partners:', data);
    return data.map(item => ({
      id: item.id,
      code: item.shift_code,
      shiftFromtime: item.shift_from_time,
      shiftTotime: item.shift_to_time,
    }));
  }

  function transformShiftInChargeOrMechanic(
    data: any[],
  ): {[key: string]: string}[] {
    console.log('Transforming Shift In Charge:', data);
    return data.map(item => ({
      id: item?.employeeDetails?.id,
      name: item?.employeeDetails?.emp_name,
    }));
  }

  function transformRevenue(data: any[]): {[key: string]: string}[] {
    console.log('Transforming Revenue:', data);
    return data.map(item => ({
      id: item.id,

      code: item.revenue_code,
    }));
  }
  return {
    loading,
    consumabaleItems,
    equipments,
    partners,
    shifts,
    shiftInChargeList,
    shiftMechanicList,
    revenue,

    getProjectsUsingUserId,
    getConsumableItems,
    getEquipments,
    getPartners,
    getShifts,
    getShiftInChargeAndShiftMechanic,
    fetchRevenueList,
  };
};

export default useSuperadmin;
