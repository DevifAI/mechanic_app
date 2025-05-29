import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';
import {enviornment, URLs} from './api.enviornment';

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
console.log('Axios config:', axiosConfig);
export const baseClient: AxiosInstance = axios.create(axiosConfig);

export const authClient: AxiosInstance = axios.create(axiosAuthConfig);

baseClient.interceptors.request.use(
  config => {
    // const state = store.getState();
    const accessToken = '';
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default {baseClient, authClient};
