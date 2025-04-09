
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PieChart } from '@/components/ui/charts';
import { Button } from '@/components/ui/button';

const AnalyticsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyse des visiteurs</CardTitle>
        <CardDescription>
          Répartition des visiteurs par page et source
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3">Pages les plus visitées</h3>
          <div className="space-y-1.5">
            {[
              { page: "Accueil", visits: 532, percentage: 42 },
              { page: "Véhicules", visits: 384, percentage: 30 },
              { page: "Détails véhicule", visits: 168, percentage: 13 },
              { page: "Contact", visits: 96, percentage: 8 },
              { page: "À propos", visits: 88, percentage: 7 }
            ].map((item, index) => (
              <div key={index} className="grid grid-cols-4 items-center gap-2">
                <div className="col-span-2 font-medium">{item.page}</div>
                <div className="col-span-1 text-sm text-muted-foreground text-right">{item.visits} visites</div>
                <div className="col-span-1 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${item.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-3">Sources de trafic</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <PieChart
                data={[
                  { name: 'Recherche Google', value: 68 },
                  { name: 'Direct', value: 15 },
                  { name: 'Réseaux sociaux', value: 10 },
                  { name: 'Liens externes', value: 7 }
                ]}
                index="name"
                categories={['value']}
                valueFormatter={(value) => `${value}%`}
                colors={['#0ea5e9', '#f59e0b', '#10b981', '#8b5cf6']}
                className="h-60"
              />
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: "Pages vues", value: "1,428", change: "+12%" },
                  { title: "Visiteurs uniques", value: "856", change: "+8%" },
                  { title: "Taux de rebond", value: "32%", change: "-5%" },
                  { title: "Durée moyenne", value: "3:24", change: "+18%" }
                ].map((stat, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="text-sm font-medium text-muted-foreground">{stat.title}</div>
                      <div className="text-2xl font-bold mt-1">{stat.value}</div>
                      <div className={`text-xs mt-1 ${
                        stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {stat.change} vs semaine précédente
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button variant="outline" className="w-full">
                Voir le rapport détaillé
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsTab;
