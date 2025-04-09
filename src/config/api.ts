const API_BASE_URL = import.meta.env.PROD
  ? 'https://immersivedigitaldevelopment.fr/api'
  : 'http://localhost:5000/api';

export const getApiUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`;