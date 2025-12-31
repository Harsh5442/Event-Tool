import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService from '../services/authService';
import { fetchUserById } from '../services/api.service';

export type UserRole = 'Admin' | 'Organizer' | 'Speaker' | 'Participant';

export interface User {
  user_id: number;
  email: string;
  name: string;
  role: UserRole;
  azure_ad_id?: string;
  created_at?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  organization?: string;
  bio?: string;
  avatar?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
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

// Helper function to validate role
const validateRole = (role: any): UserRole => {
  const validRoles: UserRole[] = ['Admin', 'Organizer', 'Speaker', 'Participant'];
  if (validRoles.includes(role)) {
    return role as UserRole;
  }
  return 'Participant'; // Default role
};

// Helper to convert userId string to number
const getUserId = (userId: string | number): number => {
  if (typeof userId === 'number') {
    return userId;
  }
  const parsed = parseInt(userId, 10);
  return isNaN(parsed) ? 1 : parsed;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = authService.getStoredUser();
    if (storedUser && authService.isAuthenticated()) {
      // Convert stored user to our User interface
      const convertedUser: User = {
        user_id: getUserId(storedUser.id || storedUser.user_id),
        email: storedUser.email,
        name: storedUser.name,
        role: validateRole(storedUser.role),
        azure_ad_id: storedUser.azure_ad_id,
      };
      setUser(convertedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password, role);
      
      // response.userId is a string, so convert it to number
      const userId = getUserId(response.userId);
      
      setUser({
        user_id: userId,
        name: `${response.firstName} ${response.lastName}`.trim(),
        email: response.email,
        role: role, // Role is passed as parameter, not in response
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
      
      // response.userId is a string, so convert it to number
      const userId = getUserId(response.userId);
      
      setUser({
        user_id: userId,
        name: `${response.firstName} ${response.lastName}`.trim(),
        email: response.email,
        role: 'Participant', // Default role for Azure AD users
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
      const newUser = { ...user, ...updatedUser };
      setUser(newUser);
      // Also update localStorage
      localStorage.setItem('user', JSON.stringify({
        id: newUser.user_id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        azure_ad_id: newUser.azure_ad_id,
      }));
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