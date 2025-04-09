
// Main API service index file
import { adminApi } from './adminApi';
import { configApi } from './configApi';
import { contactApi } from './contactApi';
import { mediaApi } from './mediaApi';
import { vehiclesApi } from './vehiclesApi';
import { visitorApi } from './visitorApi';

// Re-export all APIs for backwards compatibility
export {
  adminApi, configApi, contactApi,
  mediaApi, vehiclesApi, visitorApi
};

// Export API base URL for use in other files
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
