import {baseClient} from '../api.clients';
import {APIEndpoints} from '../api.endpoints';
import {enviornment, URLs} from '../api.enviornment';

export const loginByPassword = async (data: any) => {
  try {
    console.log(URLs[enviornment].apiURL + APIEndpoints.logIn);
    const response = await baseClient.post(APIEndpoints.logIn, data);
    console.log('Login response:', response?.data?.data);
    return response;
  } catch (error: any) {
    console.error('Error during login:', error);
  }
  return baseClient.post(APIEndpoints.logIn, data);
};

export const forgotPassword = async (data: any) => {
  try {
    const response = await baseClient.post(APIEndpoints.forgotPassWord, data);
    console.log('Forgot password response:', response?.data?.data);
    return response;
  } catch (error: any) {
    console.error('Error during forgot password:', error);
  }
};
