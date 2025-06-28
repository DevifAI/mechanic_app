import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import Toast from 'react-native-toast-message';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { logoutApi } from '../services/apis/auth.service';
import { RootState } from '../redux/store';

const useLogout = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<any>>();
  const handleLogout = async () => {
    try {
      // if (!token) {
      //   throw new Error('No authentication token found.');
      // }
      const response = await logoutApi()

      Toast.show({
        type: 'success',
        text1: 'Logged out',
        text2: response.data.message || 'You have been logged out.',
      });

      dispatch(logout());
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error: any) {
      console.error('Logout failed:', error);
      Toast.show({
        type: 'error',
        text1: 'Logout Failed',
        text2: error?.response?.data?.message || 'Please try again.',
      });
    }
  };

  return handleLogout;
};

export default useLogout;
