
import { store } from '../redux/store';
import { logout } from '../redux/slices/authSlice';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { resetNavigation } from './navigationRef';


export const forceLogout = async () => {
try {
  // console.log("dispatch logouttttttttttttttttttttttttttttttttttt")
     store.dispatch(logout());
    Toast.show({
      type: 'info',
      text1: 'Session expired',
      text2: 'Please log in again.',
    });
//  console.log("dispatch logouttttttttttttttttttttttttttttttttttt22222222222222222222")
      resetNavigation('Login');

  } catch (err) {
    console.error('Force logout failed:', err);
    Toast.show({
      type: 'error',
      text1: 'Logout error',
      text2: 'Failed to logout session.',
    });
  }
};
