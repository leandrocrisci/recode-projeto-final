import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { UserRole } from '../types';

interface AuthContextType {
  role: UserRole;
  setRole: (r: UserRole) => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  role: 'user',
  setRole: () => {},
  isAdmin: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('user');
  return (
    <AuthContext.Provider value={{ role, setRole, isAdmin: role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
