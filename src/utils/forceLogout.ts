// utils/forceLogout.ts
import { store } from '../redux/store';
import { logout } from '../redux/slices/authSlice';
import { logoutApi } from '../services/apis/auth.service';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';

// Optional: add navigationRef if you want redirection

export const forceLogout = async () => {
const navigation = useNavigation<any>()
  try {
      const response = await logoutApi();
    Toast.show({
      type: 'info',
      text1: 'Session expired',
      text2: 'Please log in again.',
    });

    store.dispatch(logout());

    // Optional: navigate to login if navigationRef is set up
     navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });

  } catch (err) {
    console.error('Force logout failed:', err);
    Toast.show({
      type: 'error',
      text1: 'Logout error',
      text2: 'Failed to logout session.',
    });
  }
};
