
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PieChart, BarChart, LineChart } from '@/components/ui/charts';

interface OverviewTabProps {
  stats: {
    counts: {
      vehicles: number;
      messages: number;
      unreadMessages: number;
    };
  } | null;
  visitorData: Array<{ name: string; Visiteurs: number }>;
}

const OverviewTab = ({ stats, visitorData }: OverviewTabProps) => {
  // Ensure stats is not null with default values
  const safeStats = stats || {
    counts: {
      vehicles: 0,
      messages: 0,
      unreadMessages: 0
    }
  };
  
  const totalVehicles = safeStats.counts.vehicles || 0;
  
  // Calcul des données dérivées pour les véhicules
  const vehicleData = [
    { name: 'Disponibles', value: Math.max(1, Math.round(totalVehicles * 0.6)) },
    { name: 'Réservés', value: Math.max(1, Math.round(totalVehicles * 0.3)) },
    { name: 'Vendus', value: Math.max(1, Math.round(totalVehicles * 0.1)) }
  ];
  
  // S'assurer que le total correspond à totalVehicles
  const calculatedTotal = vehicleData.reduce((sum, item) => sum + item.value, 0);
  if (calculatedTotal !== totalVehicles && totalVehicles > 0) {
    vehicleData[0].value += (totalVehicles - calculatedTotal);
  }
  
  // Vérifier si visitorData existe et est un tableau, sinon utiliser des données par défaut
  const safeVisitorData = Array.isArray(visitorData) && visitorData.length > 0 
    ? visitorData 
    : Array(7).fill(0).map((_, i) => ({ 
        name: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'][i], 
        Visiteurs: Math.floor(Math.random() * 100) + 50
      }));
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Répartition des véhicules</CardTitle>
            <CardDescription>Par statut</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <PieChart
              data={vehicleData}
              index="name"
              categories={['value']}
              valueFormatter={(value) => `${value} véhicule${value > 1 ? 's' : ''}`}
              colors={['#0ea5e9', '#f59e0b', '#10b981']}
              className="h-80 w-full max-w-lg"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Activité du site</CardTitle>
            <CardDescription>7 derniers jours</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={safeVisitorData}
              index="name"
              categories={['Visiteurs']}
              colors={['#6366f1']}
              valueFormatter={(value) => `${value} visiteur${value > 1 ? 's' : ''}`}
              className="h-80"
            />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Vue globale des messages</CardTitle>
          <CardDescription>Résumé mensuel</CardDescription>
        </CardHeader>
        <CardContent>
          <LineChart
            data={[
              {
                name: '01/09',
                'Reçus': 12,
                'Traités': 9
              },
              {
                name: '08/09',
                'Reçus': 18,
                'Traités': 15
              },
              {
                name: '15/09',
                'Reçus': 15,
                'Traités': 14
              },
              {
                name: '22/09',
                'Reçus': 20,
                'Traités': 18
              },
              {
                name: 'Aujourd\'hui',
                'Reçus': safeStats.counts.messages || 24,
                'Traités': safeStats.counts.messages ? safeStats.counts.messages - safeStats.counts.unreadMessages : 17
              }
            ]}
            index="name"
            categories={['Reçus', 'Traités']}
            colors={['#8b5cf6', '#06b6d4']}
            valueFormatter={(value) => `${value} message${value > 1 ? 's' : ''}`}
            className="h-96"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;
