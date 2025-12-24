// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import authService from '../services/authService';

// export type UserRole = 'Admin' | 'Organizer' | 'Speaker' | 'Participant';

// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: UserRole;
//   avatar?: string;
//   phone?: string;
//   organization?: string;
//   bio?: string;
// }

// interface AuthContextType {
//   user: User | null;
//   isAuthenticated: boolean;
//   login: (email: string, password: string, role: UserRole) => Promise<void>;
//   loginWithAzureAd: () => Promise<void>;
//   exchangeAzureAdToken: (token: string) => Promise<void>;
//   logout: () => void;
//   updateProfile: (updatedUser: Partial<User>) => void;
//   loading: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const storedUser = authService.getStoredUser();
//     if (storedUser && authService.isAuthenticated()) {
//       setUser(storedUser);
//     }
//     setLoading(false);
//   }, []);

//   const login = async (email: string, password: string, role: UserRole) => {
//     setLoading(true);
//     try {
//       const response = await authService.login(email, password, role);
//       setUser({
//         id: response.userId,
//         name: `${response.firstName} ${response.lastName}`,
//         email: response.email,
//         role: role,
//       });
//     } catch (error) {
//       console.error('Login failed:', error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loginWithAzureAd = async () => {
//     try {
//       const { loginUrl } = await authService.getAzureAdLoginUrl();
//       window.location.href = loginUrl;
//     } catch (error) {
//       console.error('Azure AD login failed:', error);
//       throw error;
//     }
//   };

//   const exchangeAzureAdToken = async (token: string) => {
//     setLoading(true);
//     try {
//       const response = await authService.exchangeAzureAdToken(token);
//       setUser({
//         id: response.userId,
//         name: `${response.firstName} ${response.lastName}`,
//         email: response.email,
//         role: 'Participant',
//       });
//     } catch (error) {
//       console.error('Token exchange failed:', error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = () => {
//     authService.logout();
//     setUser(null);
//   };

//   const updateProfile = (updatedUser: Partial<User>) => {
//     if (user) {
//       setUser({ ...user, ...updatedUser });
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isAuthenticated: !!user,
//         login,
//         loginWithAzureAd,
//         exchangeAzureAdToken,
//         logout,
//         updateProfile,
//         loading,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };


import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService from '../services/authService';

export type UserRole = 'Admin' | 'Organizer' | 'Speaker' | 'Participant';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  organization?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  loginWithAzureAd: () => Promise<void>;
  exchangeAzureAdToken: (token: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updatedUser: Partial<User>) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = authService.getStoredUser();
    if (storedUser && authService.isAuthenticated()) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password, role);
      setUser({
        id: response.userId,
        name: `${response.firstName} ${response.lastName}`,
        email: response.email,
        role: role,
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithAzureAd = async () => {
    try {
      const { loginUrl } = await authService.getAzureAdLoginUrl();
      window.location.href = loginUrl;
    } catch (error) {
      console.error('Azure AD login failed:', error);
      throw error;
    }
  };

  const exchangeAzureAdToken = async (token: string) => {
    setLoading(true);
    try {
      const response = await authService.exchangeAzureAdToken(token);
      setUser({
        id: response.userId,
        name: `${response.firstName} ${response.lastName}`,
        email: response.email,
        role: 'Participant',
      });
    } catch (error) {
      console.error('Token exchange failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateProfile = (updatedUser: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updatedUser });
      // Also update localStorage
      localStorage.setItem('user', JSON.stringify({ ...user, ...updatedUser }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        loginWithAzureAd,
        exchangeAzureAdToken,
        logout,
        updateProfile,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};