
import { API_BASE_URL, handleResponse, getAuthHeaders, handleApiError } from './apiUtils';

export const vehiclesApi = {
  // Get all vehicles
  getAll: async () => {
    try {
      console.log('Fetching all vehicles...');
      const response = await fetch(`${API_BASE_URL}/vehicles`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      return handleApiError(error);
    }
  },

  // Get featured vehicles
  getFeatured: async () => {
    try {
      console.log('Fetching featured vehicles...');
      const response = await fetch(`${API_BASE_URL}/vehicles/featured`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching featured vehicles:', error);
      return handleApiError(error);
    }
  },

  // Get single vehicle
  getById: async (id: string) => {
    try {
      console.log(`Fetching vehicle with ID: ${id}`);
      const response = await fetch(`${API_BASE_URL}/vehicles/${id}`);
      return handleResponse(response);
    } catch (error) {
      console.error(`Error fetching vehicle with ID ${id}:`, error);
      return handleApiError(error);
    }
  },

  // Create vehicle
  create: async (vehicleData: any) => {
    try {
      console.log('Creating vehicle:', vehicleData);
      const response = await fetch(`${API_BASE_URL}/vehicles`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating vehicle:', error);
      return handleApiError(error);
    }
  },

  // Update vehicle
  update: async (id: string, vehicleData: any) => {
    try {
      console.log('Updating vehicle:', id, vehicleData);
      const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error updating vehicle with ID ${id}:`, error);
      return handleApiError(error);
    }
  },

  // Delete vehicle
  delete: async (id: string) => {
    try {
      console.log('Deleting vehicle:', id);
      const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error deleting vehicle with ID ${id}:`, error);
      return handleApiError(error);
    }
  },

  // Upload images
  uploadImages: async (id: string | null, images: File[]) => {
    try {
      console.log('Uploading images for vehicle:', id, 'Number of images:', images.length);
      const headers = getAuthHeaders();
      
      // Supprimez le Content-Type du header car FormData le définira automatiquement avec le bon boundary
      delete headers['Content-Type'];
      
      const formData = new FormData();
      
      images.forEach((image, index) => {
        console.log(`Adding image ${index + 1} to form:`, image.name, image.size);
        formData.append('images', image);
      });
      
      const endpoint = id 
        ? `${API_BASE_URL}/vehicles/upload/${id}`
        : `${API_BASE_URL}/vehicles/upload`;
      
      console.log('Upload endpoint:', endpoint);
      console.log('Upload headers:', headers);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: formData,
      });
      
      console.log('Vehicle images upload response status:', response.status);
      return handleResponse(response);
    } catch (error) {
      console.error('Error uploading vehicle images:', error);
      return handleApiError(error);
    }
  }
};
