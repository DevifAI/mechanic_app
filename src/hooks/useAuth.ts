import React, {useState} from 'react';
import {forgotPassword, loginByPassword} from '../services/apis/auth.service';
import {login} from '../redux/slices/authSlice';
import {useDispatch} from 'react-redux';
import {Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import useSuperadmin from './useSuperadmin';

const useAuth = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();

  const navigation = useNavigation<any>();

  const {getProjectsUsingUserId} = useSuperadmin();

  const handleLogin = async (
    credentials: {emp_id: string; password: string},
    callBack?: () => void,
  ) => {
    setLoading(true);
    try {
      console.log(credentials);
      const response = await loginByPassword(credentials)?.then(
        (response: any) => {
          getProjectsUsingUserId(response?.data?.employee?.id);
          console.log(response?.data);
          dispatch(
            login({
              userName: response?.data?.employee?.emp_id,
              role: response?.data?.employee?.role?.name,
              userId: response?.data?.employee?.id,
              orgId: response?.data?.employee?.organisation?.id,
            }),
          );
          Alert.alert(
            'Logged in',
            `Welcome, ${response?.data?.employee?.emp_id}`,
          );
        },
      );

      //   if (credentials?.emp_id === credentials?.password) {
      //     navigation.navigate('ForgotPassword');
      //   } else

      navigation.navigate('DoneScreen');
      if (callBack) callBack();
    } catch (error) {
      console.error('Error during login:', error);
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
