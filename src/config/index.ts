// Configuration file for environment variables
interface Config {
  apiBaseUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

const config: Config = {
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'https://localhost:7243/api',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

export default config;