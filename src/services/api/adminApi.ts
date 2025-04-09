
import { API_BASE_URL, handleResponse, getAuthHeaders, handleApiError } from './apiUtils';

export const adminApi = {
  // Login
  login: async (credentials: { username: string; password: string }) => {
    try {
      console.log('Logging in with username:', credentials.username);
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Login error:', error);
      return handleApiError(error);
    }
  },

  // Get site config
  getSiteConfig: async () => {
    try {
      console.log('Fetching site configuration...');
      const response = await fetch(`${API_BASE_URL}/admin/site-config`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching site config:', error);
      return handleApiError(error);
    }
  },

  // Update site config
  updateSiteConfig: async (config: any) => {
    try {
      console.log('Updating site configuration:', config);
      const response = await fetch(`${API_BASE_URL}/admin/site-config`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error updating site config:', error);
      return handleApiError(error);
    }
  },
  
  // Get dashboard stats
  getDashboardStats: async () => {
    try {
      console.log('Fetching dashboard stats...');
      const response = await fetch(`${API_BASE_URL}/admin/dashboard-stats`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return handleApiError(error);
    }
  },
  
  // Get activity log
  getActivityLog: async () => {
    try {
      console.log('Fetching activity log...');
      const response = await fetch(`${API_BASE_URL}/admin/activity`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching activity log:', error);
      return handleApiError(error);
    }
  },
  
  // Save custom page
  saveCustomPage: async (pageKey: string, pageData: any) => {
    try {
      console.log('Saving custom page:', pageKey, pageData);
      const response = await fetch(`${API_BASE_URL}/admin/custom-page/${pageKey}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pageData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error saving custom page:', error);
      return handleApiError(error);
    }
  },

  // Upload video
  uploadVideo: async (videoFile: File) => {
    try {
      console.log('Uploading video:', videoFile.name, videoFile.size);
      const headers = getAuthHeaders();
      
      // Supprimer le Content-Type pour FormData
      delete headers['Content-Type'];
      
      const formData = new FormData();
      formData.append('video', videoFile);
      
      console.log('Upload video headers:', headers);
      
      const response = await fetch(`${API_BASE_URL}/admin/upload-video`, {
        method: 'POST',
        headers: headers,
        body: formData,
      });
      
      console.log('Video upload response status:', response.status);
      return handleResponse(response);
    } catch (error) {
      console.error('Error uploading video:', error);
      return handleApiError(error);
    }
  }
};
