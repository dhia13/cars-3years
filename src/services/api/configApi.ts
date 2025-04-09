
import { API_BASE_URL, handleResponse } from './apiUtils';

export const configApi = {
  // Get site configuration
  getConfig: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/site-config`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching site configuration:', error);
      throw error;
    }
  }
};
