import config from '../config';

const API_BASE_URL = config.apiBaseUrl;

export interface RegisterRequest {
  username: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface SendVerificationCodeRequest {
  email: string;
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
}

export const api = {
  login: async (data: LoginRequest) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.error || errorData.title || 'Login failed';
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Login failed');
    }
  },

  register: async (data: RegisterRequest) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.error || errorData.title || 'Registration failed';
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Registration failed');
    }
  },

  sendVerificationCode: async (data: SendVerificationCodeRequest) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Auth/request-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.error || errorData.title || 'Failed to send verification code';
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Send verification code error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to send verification code');
    }
  },

  verifyCode: async (data: VerifyCodeRequest) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Auth/reset-password-api`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.error || errorData.title || 'Invalid verification code';
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Verify code error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Invalid verification code');
    }
  },
};