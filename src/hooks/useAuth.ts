import React, {useState} from 'react';
import {forgotPassword, loginByPassword} from '../services/apis/auth.service';
import {login} from '../redux/slices/authSlice';
import {useDispatch} from 'react-redux';
import {Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import useSuperadmin from './useSuperadmin';
import Toast from 'react-native-toast-message';
import axios from 'axios';

const useAuth = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();

  const navigation = useNavigation<any>();

  const {getProjectsUsingUserId} = useSuperadmin();


const handleLogin = async (
  credentials: { emp_id: string; password: string; forceLogoutAll?: boolean },
  callBack?: () => void,
) => {
  setLoading(true);

  try {
    console.log(credentials);
    const response = await loginByPassword(credentials);
    const user = response?.data?.employee;
    const jwt = response?.data?.token;
    console.log("userrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr" , user?.id)
    // console.log("userrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr" , jwt)

    if (user?.id) {
      getProjectsUsingUserId(user?.id);

      console.log("Dispatching login with:", {
  userId: user?.id,
  role: user?.role,
  orgId: user?.organisation?.id,
  userName: user?.emp_id,
  token: response?.data?.token,
});


      dispatch(
        login({
          userName: user?.emp_id,
          role: user?.role,
          userId: user?.id,
          orgId: user?.organisation?.id,
          token: response?.data?.token,
        }),
      );

      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: `Welcome, ${user?.emp_id}`,
      });

      setTimeout(() => {
        navigation.navigate('DoneScreen');
        if (callBack) callBack();
      }, 2000);
    } else {
      throw new Error('Invalid user response');
    }
  } catch (error: any) {
    console.error('Error during login:', error);

    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      let message = 'Unexpected error. Please try again.';

      if (status === 400) {
        message = 'Employee ID and password are required.';
      } else if (status === 404) {
        message = 'Employee not found.';
      } else if (status === 401) {
        message = 'Incorrect password.';
      } else if (status === 403 && error.response.data?.promptForceLogout) {
        // 🔔 Show Alert for force logout
        Alert.alert(
          'Already Logged In',
          'You are already logged in on another device.\nDo you want to logout from other devices?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Logout & Continue',
              onPress: () => {
                // 🔁 Retry login with forceLogoutAll: true
                handleLogin(
                  { ...credentials, forceLogoutAll: true },
                  callBack
                );
              },
            },
          ],
          { cancelable: false },
        );
        return;
      }

      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: message,
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Please check your internet connection.',
      });
    }
  } finally {
    setLoading(false);
  }
};



  const handleForgotPassword = async (data: any, callBack: () => void) => {
    setLoading(true);
    try {
      await forgotPassword(data);
      callBack();
    } catch (error) {
      console.error('Error during forgot password:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleLogin,
    handleForgotPassword,
  };
};

export default useAuth;
