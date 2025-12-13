import type { AuthData } from '~/types/user';
import ApiService, { type ApiResponse } from './baseApi';

interface LoginCredentials {
  email: string;
  password: string;
}

export const loginUser = async (credentials: LoginCredentials): Promise<AuthData> => {
  try {
    const response: ApiResponse = await ApiService.post('auth/login', credentials);
    const data = response.data as AuthData;
    localStorage.setItem('authToken', data.access_token);
    return data;
  } catch (error) {
    throw error
  }
};

export const logoutUser = async () => {
  const currentToken = localStorage.getItem('authToken') || null;

  if (currentToken) {
    try {
      await ApiService.post('auth/logout');
    } catch (e) {
      console.error("Logout API failed", e);
    }
  }
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
}