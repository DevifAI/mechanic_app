export enum Enviornments {
  local,
  dev,
  stage,
  production,
}

const homeIp = '192.168.0.107';
const pgIp = '192.168.29.9';

export const URLs = {
  [Enviornments.local]: {
    apiURL: `http://${homeIp}:5000/api/master`,
  },
  [Enviornments.dev]: {
    apiURL: 'https://mechanic-app-backend.onrender.com/api/master',
  },
  [Enviornments.stage]: {
    apiURL: '',
  },
  [Enviornments.production]: {
    apiURL: '',
  },
};

export const enviornment = Enviornments.dev;
