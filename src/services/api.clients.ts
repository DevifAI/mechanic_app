import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import {enviornment, URLs} from './api.enviornment';
import { Alert } from 'react-native';
import { forceLogout } from '../utils/forceLogout';
import { store } from '../redux/store';

// Base Axios configuration
const axiosConfig: AxiosRequestConfig = {
  baseURL: URLs[enviornment].apiURL,
  headers: {
    'Content-Type': 'application/json',
  },
};

const axiosAuthConfig: AxiosRequestConfig = {
  baseURL: URLs[enviornment].apiURL,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Create instances
export const baseClient: AxiosInstance = axios.create(axiosConfig);
export const authClient: AxiosInstance = axios.create(axiosAuthConfig);

// Logging helpers
const logRequest = (config: AxiosRequestConfig) => {
  console.log('📤 [REQUEST]', {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data,
  });
  return config;
};

const logResponse = (response: any) => {
  console.log('✅ [RESPONSE]', {
    url: response.config?.url,
    status: response.status,
    data: response.data,
  });
  return response;
};

const logError = (error: any) => {
  if (error.response) {
    console.error('❌ [RESPONSE ERROR]', {
      url: error.config?.url,
      status: error.response.status,
      data: error.response.data,
    });
  } else if (error.request) {
    console.error('⚠️ [NO RESPONSE]', error.request);
  } else {
    console.error('🚨 [AXIOS ERROR]', error.message);
  }
  return Promise.reject(error);
};

// Apply interceptors to a client
const applyInterceptors = (
  client: AxiosInstance,
  withAuth: boolean = false,
) => {
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      if (withAuth) {
        const accessToken = store.getState().auth.token; // Add real token logic here
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      }

      // Logging
      console.log('📤 [REQUEST]');
      console.log(`➡️ URL: ${config.baseURL}${config.url}`);
      console.log(`🔁 Method: ${config.method?.toUpperCase()}`);
      console.log('🧾 Headers:', config.headers);
      if (config.data) {
        console.log('📦 Payload:', config.data);
      }

      return config;
    },
    (error: AxiosError) => {
      console.error('🛑 [REQUEST ERROR]', error);
      return Promise.reject(error);
    },
  );

  client.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log('✅ [RESPONSE]');
      console.log(`⬅️ URL: ${response.config.baseURL}${response.config.url}`);
      console.log(`📊 Status: ${response.status}`);
      console.log('📥 Data:', response.data);
      return response;
    },
    (error: AxiosError) => {
      if (error.response) {
        console.error('❌ [ERROR RESPONSE]');
        console.error(`URL: ${error.config?.baseURL}${error.config?.url}`);
        console.error(`Status: ${error.response.status}`);
        console.error('Error Data:', error.response.data);
          if (error.response.status === 401) {
        Alert.alert(
          'Session Expired',
          'Your session has expired. Please login again.',
          [
            {
              text: 'OK',
              onPress: () => {
                forceLogout();
              },
            },
          ],
          { cancelable: false },
        );
      }
      } else if (error.request) {
        console.error('⚠️ [NO RESPONSE]');
        console.error('Request:', error.request);
      } else {
        console.error('🚨 [REQUEST SETUP ERROR]');
        console.error('Message:', error.message);
      }
      return Promise.reject(error);
    },
  );
};

// Apply interceptors to both clients
applyInterceptors(baseClient , true);
applyInterceptors(authClient, true);

export default {baseClient, authClient};
