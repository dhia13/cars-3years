
import { API_BASE_URL, handleResponse, getAuthHeaders, handleApiError } from './apiUtils';

export const configApi = {
  // Get site configuration
  getConfig: async () => {
    try {
      console.log('Fetching site configuration...');
      const response = await fetch(`${API_BASE_URL}/admin/site-config`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching site configuration:', error);
      return handleApiError(error);
    }
  },

  // Update site configuration
  updateConfig: async (configData) => {
    try {
      console.log('Updating site configuration:', configData);
      const response = await fetch(`${API_BASE_URL}/admin/site-config`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error updating site configuration:', error);
      return handleApiError(error);
    }
  }
};
