
import { API_BASE_URL, handleResponse, getAuthHeaders } from './apiUtils';

export interface VisitorStats {
  totalVisitors: number;
  visitorsLast24Hours: number;
  visitorsLast7Days: number;
  mostVisitedPages: Array<{
    _id: string;
    count: number;
  }>;
}

export const visitorApi = {
  // Record a visit
  recordVisit: async (page: string) => {
    try {
      console.log('Recording visit for page:', page);
      await fetch(`${API_BASE_URL}/visitors/record`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ page }),
      });
      console.log('Visit recorded successfully');
    } catch (error) {
      // Silently fail - we don't want to interrupt user experience if tracking fails
      console.error('Error recording visit:', error);
    }
  },

  // Get visitor stats (admin)
  getStats: async (): Promise<VisitorStats | null> => {
    try {
      console.log('Fetching visitor stats...');
      const response = await fetch(`${API_BASE_URL}/visitors/stats`, {
        headers: getAuthHeaders(),
      });
      
      // Si la requête échoue à cause d'un problème réseau, le fetch lèvera une exception
      // Si nous arrivons ici, c'est que nous avons au moins une réponse du serveur
      
      // Si la réponse n'est pas OK, gérer l'erreur HTTP
      if (!response.ok) {
        const errorStatus = response.status;
        // Différencier les types d'erreurs
        if (errorStatus === 401) {
          console.error('Unauthorized access to visitor stats');
          return null;
        } else if (errorStatus === 500) {
          console.error('Server error when fetching visitor stats');
          return null;
        }
        throw new Error(`Error fetching visitor stats: ${response.status}`);
      }
      
      const data = await handleResponse(response);
      console.log('Visitor stats retrieved:', data);
      
      if (data && data.error) {
        console.error('Error in visitor stats response:', data.message);
        return null;
      }
      
      return data as VisitorStats;
    } catch (error) {
      console.error('Error fetching visitor stats:', error);
      return null;
    }
  },
  
  // Generate mock data for testing or when API is unavailable
  getMockStats: (): VisitorStats => {
    return {
      totalVisitors: Math.floor(Math.random() * 1000) + 100,
      visitorsLast24Hours: Math.floor(Math.random() * 100) + 10,
      visitorsLast7Days: Math.floor(Math.random() * 500) + 50,
      mostVisitedPages: [
        { _id: 'home', count: Math.floor(Math.random() * 200) + 100 },
        { _id: 'about', count: Math.floor(Math.random() * 100) + 50 },
        { _id: 'contact', count: Math.floor(Math.random() * 80) + 30 },
        { _id: 'vehicles', count: Math.floor(Math.random() * 150) + 70 }
      ]
    };
  }
};
