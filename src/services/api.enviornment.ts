export enum Enviornments {
  local,
  dev,
  stage,
  production,
}

export enum Role {
  mechanic = 'mechanic',
  mechanicInCharge = 'mechanicIncharge',
  siteInCharge = 'siteIncharge',
  projectManager = 'projectManager',
  storeManager = 'storeManager',
  admin = 'admin',
  accountManager = 'accountManager',
}
const homeIp = '192.168.31.72';
const pgIp = '192.168.29.9';

export const URLs = {
  [Enviornments.local]: {
    apiURL: `http://${homeIp}:5000/api/master`,
  },
  [Enviornments.dev]: {
    apiURL: 'https://mechanic-app-backend.onrender.com/api/master',
  },
  [Enviornments.stage]: {
    apiURL: 'https://www.devifai.website/api/master',
  },
  [Enviornments.production]: {
    apiURL: '',
  },
};

export const enviornment = Enviornments.local;
