
import { API_BASE_URL, handleResponse, getAuthHeaders, handleApiError } from './apiUtils';

export const mediaApi = {
  // Get all media
  getAll: async () => {
    try {
      console.log('Fetching all media...');
      const response = await fetch(`${API_BASE_URL}/media`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching media:', error);
      return handleApiError(error);
    }
  },
  
  // Test Cloudinary connection
  testCloudinaryConnection: async () => {
    try {
      console.log('Testing Cloudinary connection...');
      const response = await fetch(`${API_BASE_URL}/media/test-cloudinary`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error testing Cloudinary connection:', error);
      return handleApiError(error);
    }
  },
  
  // Upload media
  upload: async (file: File) => {
    try {
      console.log('Uploading media file:', file.name, 'Size:', file.size);
      const headers = getAuthHeaders();
      
      // Supprimer Content-Type pour FormData
      delete headers['Content-Type'];
      
      const formData = new FormData();
      formData.append('media', file);
      
      console.log('Upload endpoint:', `${API_BASE_URL}/media/upload`);
      console.log('Upload headers:', headers);
      
      const response = await fetch(`${API_BASE_URL}/media/upload`, {
        method: 'POST',
        headers: headers,
        body: formData,
      });
      
      console.log('Media upload response status:', response.status);
      return handleResponse(response);
    } catch (error) {
      console.error('Error uploading media:', error);
      return handleApiError(error);
    }
  },
  
  // Delete media
  delete: async (mediaId: string) => {
    try {
      console.log('Deleting media:', mediaId);
      const response = await fetch(`${API_BASE_URL}/media/${mediaId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error(`Error deleting media ${mediaId}:`, error);
      return handleApiError(error);
    }
  }
};
