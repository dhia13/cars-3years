
export const generateVisitorData = (visitorsToday: number) => {
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const date = new Date();
  const currentDay = date.getDay();
  // Ajuster pour que dimanche soit 6 et non 0
  const indexToday = currentDay === 0 ? 6 : currentDay - 1;
  
  const lastWeekData = days.map((day, i) => {
    // Generate more realistic data, highest on weekend
    const baseValue = 100 + Math.round(Math.random() * 50);
    const weekendMultiplier = (i === 5 || i === 6) ? 1.5 : 1;
    
    return {
      name: day,
      Visiteurs: Math.round(baseValue * weekendMultiplier)
    };
  });
  
  // Add data for today
  if (visitorsToday) {
    lastWeekData[indexToday].Visiteurs = visitorsToday;
  }
  
  return lastWeekData;
};

export const formatDate = (timestamp: string, format: 'short' | 'long' | 'full' = 'short'): string => {
  const date = new Date(timestamp);
  
  try {
    switch (format) {
      case 'short':
        return new Intl.DateTimeFormat('fr-FR', {
          day: '2-digit',
          month: '2-digit',
        }).format(date);
        
      case 'long':
        return new Intl.DateTimeFormat('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }).format(date);
        
      case 'full':
        return new Intl.DateTimeFormat('fr-FR', {
          weekday: 'long',
          day: '2-digit',
          month: 'long', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(date);
        
      default:
        return new Intl.DateTimeFormat('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }).format(date);
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Date invalide';
  }
};

// Amélioration de la fonction pour calculer la différence en pourcentage
export const calculatePercentageDifference = (current: number, previous: number): string => {
  if (previous === 0) return "+100%";
  
  const difference = current - previous;
  const percentage = (difference / previous) * 100;
  
  return `${percentage > 0 ? '+' : ''}${percentage.toFixed(1)}%`;
};
