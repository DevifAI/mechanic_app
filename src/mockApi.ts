// src/api/mockApi.ts

type User = {
  userId: string;
  password: string;
  name: string;
  role: 'mechanic' | 'mechanicIncharge' | 'siteIncharge' | 'site manager' | 'store manager' | 'admin';
};

const users: User[] = [
  { userId: 'mech01', password: '1234', name: 'Ravi Kumar', role: 'mechanic' },
  { userId: 'mechin01', password: '1234', name: 'Anil Singh', role: 'mechanicIncharge' },
  { userId: 'sitein01', password: '1234', name: 'Preeti Sharma', role: 'siteIncharge' },
  { userId: 'sitemgr01', password: '1234', name: 'Mohit Verma', role: 'site manager' },
  { userId: 'store01', password: '1234', name: 'Alok Yadav', role: 'store manager' },
  { userId: 'admin01', password: '1234', name: 'Neha Sinha', role: 'admin' },
];

export const mockLogin = async (userId: string, password: string) => {
  return new Promise<{ userId: string; role: string; name: string }>((resolve, reject) => {
    setTimeout(() => {
      const user = users.find(u => u.userId === userId && u.password === password);
      if (user) {
        resolve({ userId: user.userId, role: user.role, name: user.name });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 1000); // Simulate network delay
  });
};
