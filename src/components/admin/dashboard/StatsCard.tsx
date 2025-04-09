
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
}

const StatsCard = ({ title, value, icon, trend }: StatsCardProps) => {
  // Fonction pour formater les valeurs avec pluralisation
  const formatValue = (val: number): string => {
    if (val === undefined || val === null || isNaN(val)) return '0';
    
    if (val >= 1000000) {
      const millions = (val / 1000000).toFixed(1);
      return `${millions}M`;
    }
    
    if (val >= 1000) {
      const thousands = (val / 1000).toFixed(1);
      return `${thousands}k`;
    }
    
    return val.toLocaleString('fr-FR');
  };

  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{formatValue(value)}</p>
          </div>
          <div className="p-2 bg-primary/10 text-primary rounded-full">
            {icon}
          </div>
        </div>
        {trend && (
          <div className="flex items-center mt-4">
            {trend.positive ? (
              <ArrowUpRight className="h-4 w-4 text-emerald-500 mr-1" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-amber-500 mr-1" />
            )}
            <span 
              className={`text-xs font-medium ${
                trend.positive ? 'text-emerald-500' : 'text-amber-500'
              }`}
            >
              {trend.value}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
