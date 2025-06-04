import {baseClient} from '../api.clients';
import {APIEndpoints} from '../api.endpoints';

export const loginByPassword = async (data: any) => {
  try {
    const response = await baseClient.post(APIEndpoints.logIn, data);

    return response;
  } catch (error: any) {
    console.error('Error during login:', error);
  }
  return baseClient.post(APIEndpoints.logIn, data);
};

export const forgotPassword = async (data: any) => {
  try {
    const response = await baseClient.post(APIEndpoints.forgotPassWord, data);

    return response;
  } catch (error: any) {
    console.error('Error during forgot password:', error);
  }
};
