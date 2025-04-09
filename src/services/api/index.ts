
// Main API service index file
import { adminApi } from './adminApi';
import { vehiclesApi } from './vehiclesApi';
import { contactApi } from './contactApi';
import { mediaApi } from './mediaApi';
import { visitorApi } from './visitorApi';
import { configApi } from './configApi';

// Re-export all APIs for backwards compatibility
export {
  adminApi,
  vehiclesApi,
  contactApi,
  mediaApi,
  visitorApi,
  configApi
};

// Export API base URL for use in other files
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
