
import React from 'react';
import { MessageSquare } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="text-center py-12 text-gray-500">
      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
      <p className="text-lg font-medium">Aucun message</p>
      <p className="text-sm">Vous n'avez pas encore reçu de messages via le formulaire de contact.</p>
    </div>
  );
};

export default EmptyState;
