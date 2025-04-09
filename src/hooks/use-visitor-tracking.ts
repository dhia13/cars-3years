
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { visitorApi } from '@/services/api';

/**
 * Hook to track page visits
 */
export const useVisitorTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Record the page visit
    visitorApi.recordVisit(location.pathname);
  }, [location.pathname]);
};

export default useVisitorTracking;
