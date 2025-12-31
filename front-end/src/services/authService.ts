const API_BASE_URL = process.env.REACT_APP_AUTH_API_URL || 'http://localhost:5085/api/auth';
interface LoginResponse {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  accessToken: string;
  expiresAt: string;
}

interface ProfileData {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePictureUrl?: string;
}

const authService = {
  // Get Azure AD login URL
  getAzureAdLoginUrl: async (): Promise<{ loginUrl: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/azure-ad-login-url`);
      if (!response.ok) {
        throw new Error('Failed to get Azure AD login URL');
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting Azure AD login URL:', error);
      throw error;
    }
  },

  // Exchange Azure AD token with backend
  exchangeAzureAdToken: async (azureAdToken: string): Promise<LoginResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/azure-ad-callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: azureAdToken,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('user', JSON.stringify({
          id: data.userId,
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          role: 'Participant',
        }));
        return data;
      } else {
        throw new Error(data.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Token exchange error:', error);
      throw error;
    }
  },

  // Traditional login
  // login: async (email: string, password: string, role: string): Promise<LoginResponse> => {
  //   try {
  //     const response = await fetch(`${API_BASE_URL}/login`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ email, password }),
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       localStorage.setItem('accessToken', data.accessToken);
  //       localStorage.setItem('user', JSON.stringify({
  //         id: data.userId,
  //         name: `${data.firstName} ${data.lastName}`,
  //         email: data.email,
  //         role: role,
  //       }));
  //       return data;
  //     } else {
  //       throw new Error(data.message || 'Login failed');
  //     }
  //   } catch (error) {
  //     console.error('Login error:', error);
  //     throw error;
  //   }
  // },

  login: async (email: string, password: string, role: string): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify({
        id: data.userId,
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        role: role,
      }));
      return data;
    } else {
      throw new Error(data.message || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
},

  // Get user profile
  getProfile: async (): Promise<ProfileData> => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Failed to get profile');
      }
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (profileData: Partial<ProfileData>): Promise<ProfileData> => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        await fetch(`${API_BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  },

  // Check authentication
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('accessToken');
  },

  // Get stored user
  getStoredUser: (): any => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Get token
  getToken: (): string | null => {
    return localStorage.getItem('accessToken');
  },
};

export default authService;