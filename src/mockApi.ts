// src/api/mockApi.ts

type User = {
  userId: string;
  password: string;
  name: string;
  role:
    | 'mechanic'
    | 'mechanicIncharge'
    | 'siteIncharge'
    | 'siteManager'
    | 'storeManager'
    | 'accountManager';
};

const users: User[] = [
  {userId: 'mech01', password: '1234', name: 'Ravi Kumar', role: 'mechanic'},
  {
    userId: 'mechin01',
    password: '1234',
    name: 'Anil Singh',
    role: 'mechanicIncharge',
  },
  {
    userId: 'sitein01', // this
    password: '1234',
    name: 'Preeti Sharma',
    role: 'siteIncharge',
  },
  {
    userId: 'sitemgr01',
    password: '1234',
    name: 'Mohit Verma',
    role: 'siteManager',
  },
  {
    userId: 'store01', // this
    password: '1234',
    name: 'Alok Yadav',
    role: 'storeManager',
  },
  {
    userId: 'acc01',
    password: '1234',
    name: 'Neha Sinha',
    role: 'accountManager',
  },
];

export const mockLogin = async (userId: string, password: string) => {
  return new Promise<{userId: string; role: string; name: string}>(
    (resolve, reject) => {
      setTimeout(() => {
        const user = users.find(
          u => u.userId === userId && u.password === password,
        );
        if (user) {
          resolve({userId: user.userId, role: user.role, name: user.name});
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000); // Simulate network delay
    },
  );
};
