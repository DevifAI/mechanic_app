import React, {useState} from 'react';
import {
  getAllConsumableItems,
  getAllEquipments,
  getProjectsByUserId,
} from '../services/apis/superadmin.services';
import {useDispatch} from 'react-redux';
import {
  updateCurrentProject,
  updateProjectList,
} from '../redux/slices/authSlice';
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

  const [equipments, setEquipments] = useState<any[]>([]);

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

  const getProjectsUsingUserId = async (userId: string) => {
    setLoading(true);
    try {
      // Simulate an API call to fetch projects using userId
      // Replace with actual API call when available
      const response = await getProjectsByUserId(userId);
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
  return {
    loading,
    consumabaleItems,
    equipments,

    getProjectsUsingUserId,
    getConsumableItems,
    getEquipments,
  };
};

export default useSuperadmin;
