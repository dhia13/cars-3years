
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  details?: string[];
}

const ServiceCard = ({ icon, title, description, details }: ServiceCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="glass-card p-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-start">
        <div className="bg-mercedes-blue/10 p-4 rounded-md text-mercedes-blue mr-4">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-serif font-bold mb-2">{title}</h3>
          <p className="text-gray-600 mb-4">{description}</p>
          
          {details && details.length > 0 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center text-mercedes-blue hover:text-mercedes-darkblue font-medium text-sm transition-colors"
            >
              {isExpanded ? 'Masquer les détails' : 'Voir les détails'}
              {isExpanded ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
            </button>
          )}

          <AnimatePresence>
            {isExpanded && details && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <ul className="mt-4 space-y-2 list-disc pl-5 text-gray-600">
                  {details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
