
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Users, Car, MessageSquare, Building } from 'lucide-react';
import { adminApi, visitorApi } from '@/services/api';

// Import our components
import StatsCard from './dashboard/StatsCard';
import OverviewTab from './dashboard/OverviewTab';
import AnalyticsTab from './dashboard/AnalyticsTab';
import ActivityTab from './dashboard/ActivityTab';
import { generateVisitorData, formatDate } from './dashboard/dashboardUtils';

interface DashboardStats {
  counts: {
    vehicles: number;
    messages: number;
    unreadMessages: number;
    visitorsToday: number;
    visitorsWeek: number;
  };
  recentActivities: {
    _id: string;
    type: string;
    action: string;
    timestamp: string;
    details: string;
    user?: string;
  }[];
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        // Utiliser l'API structurée pour récupérer les statistiques
        const dashboardStats = await adminApi.getDashboardStats().catch(() => null);
        // Also fetch visitor stats
        const visitorStats = await visitorApi.getStats().catch(() => null);
        
        // Create a complete stats object with both admin and visitor data
        if (dashboardStats || visitorStats) {
          const combinedStats: DashboardStats = {
            counts: {
              vehicles: dashboardStats?.counts?.vehicles || 24,
              messages: dashboardStats?.counts?.messages || 18,
              unreadMessages: dashboardStats?.counts?.unreadMessages || 7,
              visitorsToday: visitorStats?.visitorsLast24Hours || 143,
              visitorsWeek: visitorStats?.visitorsLast7Days || 1258
            },
            recentActivities: dashboardStats?.recentActivities || Array(5).fill(null).map((_, i) => ({
              _id: i.toString(),
              type: ['admin', 'vehicle', 'message', 'visitor'][Math.floor(Math.random() * 4)],
              action: 'Action simulée',
              timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
              details: 'Détails simulés pour le tableau de bord',
              user: ['admin', 'commercial'][Math.floor(Math.random() * 2)]
            }))
          };
          
          setStats(combinedStats);
        } else {
          throw new Error('Erreur lors de la récupération des statistiques');
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        
        // Mock data en cas d'erreur
        setStats({
          counts: {
            vehicles: 24,
            messages: 18,
            unreadMessages: 7,
            visitorsToday: 143,
            visitorsWeek: 1258
          },
          recentActivities: Array(5).fill(null).map((_, i) => ({
            _id: i.toString(),
            type: ['admin', 'vehicle', 'message', 'visitor'][Math.floor(Math.random() * 4)],
            action: 'Action simulée',
            timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
            details: 'Détails simulés pour le tableau de bord',
            user: ['admin', 'commercial'][Math.floor(Math.random() * 2)]
          }))
        });
        
        toast({
          title: "Données simulées",
          description: "Utilisation de données simulées en attendant la configuration complète de l'API.",
          variant: "default",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [toast]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Ensure stats is never null and always has the required structure
  const safeStats = stats || {
    counts: {
      vehicles: 0,
      messages: 0,
      unreadMessages: 0,
      visitorsToday: 0,
      visitorsWeek: 0
    },
    recentActivities: []
  };
  
  // Generate visitor data based on safe stats
  const visitorData = generateVisitorData(safeStats.counts.visitorsToday);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tableau de bord</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Véhicules"
          value={safeStats.counts.vehicles}
          icon={<Car size={20} />}
          trend={{ value: "+12% ce mois", positive: true }}
        />
        
        <StatsCard 
          title="Messages"
          value={safeStats.counts.messages}
          icon={<MessageSquare size={20} />}
          trend={{ value: `${safeStats.counts.unreadMessages} non lus`, positive: false }}
        />
        
        <StatsCard 
          title="Visiteurs aujourd'hui"
          value={safeStats.counts.visitorsToday}
          icon={<Users size={20} />}
          trend={{ value: "+8% vs hier", positive: true }}
        />
        
        <StatsCard 
          title="Visiteurs (7j)"
          value={safeStats.counts.visitorsWeek}
          icon={<Building size={20} />}
          trend={{ value: "+23% vs semaine précédente", positive: true }}
        />
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="analytics">Analyse des visiteurs</TabsTrigger>
          <TabsTrigger value="activity">Activité récente</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <OverviewTab stats={safeStats} visitorData={visitorData} />
        </TabsContent>
        
        <TabsContent value="analytics">
          <AnalyticsTab />
        </TabsContent>
        
        <TabsContent value="activity">
          <ActivityTab 
            activities={safeStats.recentActivities} 
            formatDate={formatDate} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
