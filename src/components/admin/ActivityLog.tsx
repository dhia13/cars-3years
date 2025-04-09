
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Car, MessageSquare, Users, User, Clock, Download } from 'lucide-react';
import { API_BASE_URL } from '@/services/api';
import { adminApi } from '@/services/api/adminApi';

interface Activity {
  _id: string;
  type: 'vehicle' | 'message' | 'visitor' | 'admin';
  action: string;
  timestamp: string;
  details: string;
  user?: string;
}

const ActivityLog = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('adminToken');
        
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        // Utiliser l'API structurée pour récupérer les activités
        const response = await adminApi.getActivityLog();
        
        if (response && !response.error) {
          // Si la réponse contient directement un tableau d'activités
          const activityData = Array.isArray(response) 
            ? response 
            : response.activities || [];
            
          setActivities(activityData);
        } else {
          throw new Error(response?.message || 'Erreur lors de la récupération des activités');
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les activités. Utilisation de données simulées.",
          variant: "destructive",
        });
        
        // Données simulées en cas d'erreur
        const mockActivities: Activity[] = Array.from({ length: 20 }).map((_, index) => {
          const types: ('vehicle' | 'message' | 'visitor' | 'admin')[] = ['vehicle', 'message', 'visitor', 'admin'];
          const type = types[Math.floor(Math.random() * types.length)];
          
          let action = '';
          if (type === 'vehicle') action = ['Ajout', 'Modification', 'Suppression'][Math.floor(Math.random() * 3)];
          if (type === 'message') action = ['Nouveau', 'Répondu', 'Archivé'][Math.floor(Math.random() * 3)];
          if (type === 'visitor') action = ['Visite', 'Pic', 'Baisse'][Math.floor(Math.random() * 3)];
          if (type === 'admin') action = ['Connexion', 'Modification config', 'Déconnexion'][Math.floor(Math.random() * 3)];
          
          const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString();
          
          let details = '';
          if (type === 'vehicle') details = ['BMW X5', 'Audi A3', 'Mercedes C200', 'Renault Clio'][Math.floor(Math.random() * 4)];
          if (type === 'message') details = ['Question sur disponibilité', 'Demande de prix', 'Prise de RDV'][Math.floor(Math.random() * 3)];
          if (type === 'visitor') details = `${Math.floor(Math.random() * 50) + 10} visiteurs à ${Math.floor(Math.random() * 24)}h`;
          if (type === 'admin') details = ['admin', 'mohamed', 'commercial'][Math.floor(Math.random() * 3)];
          
          return {
            _id: (index + 1).toString(),
            type,
            action,
            timestamp,
            details,
            user: type === 'admin' ? details : undefined
          };
        }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        
        setActivities(mockActivities);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchActivities();
  }, [toast]);

  const formatDate = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return 'Date invalide';
      }
      return date.toLocaleDateString('fr-FR', { 
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date invalide';
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesFilter = filter === 'all' || activity.type === filter;
    const matchesSearch = searchTerm === '' || 
      activity.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (activity.user && activity.user.toLowerCase().includes(searchTerm.toLowerCase()));
      
    return matchesFilter && matchesSearch;
  });

  const downloadReport = () => {
    // Génération d'un rapport CSV
    const headers = ['Type', 'Action', 'Détails', 'Date', 'Utilisateur'];
    
    const rows = filteredActivities.map(activity => [
      activity.type,
      activity.action,
      activity.details,
      formatDate(activity.timestamp),
      activity.user || '-'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Créer un lien de téléchargement
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `activite-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Rapport téléchargé",
      description: "Le rapport a été généré avec succès",
    });
  };
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'vehicle': return <Car className="h-5 w-5" />;
      case 'message': return <MessageSquare className="h-5 w-5" />;
      case 'visitor': return <Users className="h-5 w-5" />;
      case 'admin': return <User className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };
  
  const getActivityBackground = (type: string) => {
    switch (type) {
      case 'vehicle': return 'bg-blue-100 text-blue-600';
      case 'message': return 'bg-green-100 text-green-600';
      case 'visitor': return 'bg-orange-100 text-orange-600';
      case 'admin': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Journal d'activité</h1>
        <Button onClick={downloadReport}>
          <Download className="mr-2 h-4 w-4" />
          Exporter le journal
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-1/3">
          <Label htmlFor="filter" className="mb-2 block">Filtrer par type</Label>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="vehicle">Véhicules</SelectItem>
              <SelectItem value="message">Messages</SelectItem>
              <SelectItem value="visitor">Visiteurs</SelectItem>
              <SelectItem value="admin">Administration</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full sm:w-2/3">
          <Label htmlFor="search" className="mb-2 block">Rechercher</Label>
          <Input
            id="search"
            placeholder="Rechercher dans le journal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Activités récentes ({filteredActivities.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              Aucune activité ne correspond à vos critères
            </div>
          ) : (
            <div className="space-y-4">
              {filteredActivities.map((activity) => (
                <div key={activity._id} className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/10 transition-colors">
                  <div className={`p-2 rounded-full flex-shrink-0 ${getActivityBackground(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {activity.action} {activity.type === 'vehicle' ? 'véhicule' : 
                              activity.type === 'message' ? 'message' : 
                              activity.type === 'visitor' ? 'visiteurs' : 
                              'admin'}
                          </p>
                          {activity.user && (
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                              {activity.user}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{activity.details}</p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {filteredActivities.length > 10 && (
            <div className="mt-6 flex justify-center">
              <Button variant="outline">Charger plus</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityLog;
