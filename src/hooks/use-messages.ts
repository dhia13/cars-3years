
import { useState, useEffect } from 'react';
import { contactApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface Message {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  responded: boolean;
}

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [networkError, setNetworkError] = useState(false);
  const { toast } = useToast();

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setNetworkError(false);
      
      // Vérifier si token existe, sinon rediriger vers login
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('Vous devez être connecté pour accéder aux messages.');
        setIsLoading(false);
        return;
      }
      
      console.log('Fetching messages...');
      const response = await contactApi.getMessages();
      
      if (response === null) {
        setNetworkError(true);
        throw new Error("Problème de connexion avec le serveur. Veuillez vérifier que le backend est en cours d'exécution.");
      }
      
      // Vérifier si response est un array (succès) ou contient une erreur
      if (response && response.error) {
        if (response.message && response.message.includes('Network error')) {
          setNetworkError(true);
        }
        throw new Error(response.message || "Erreur lors de la récupération des messages");
      }
      
      console.log('Messages fetched successfully:', response);
      
      // Si la réponse n'est pas un tableau, utiliser un tableau vide
      setMessages(Array.isArray(response) ? response : []);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      setError('Impossible de récupérer les messages. ' + (error.message || 'Veuillez réessayer plus tard.'));
      
      // Si erreur d'authentification, supprimer le token
      if (error.message && (
        error.message.includes('token') || 
        error.message.includes('unauthorized') || 
        error.message.includes('Unauthorized')
      )) {
        toast({
          title: "Session expirée",
          description: "Votre session a expiré. Veuillez vous reconnecter.",
          variant: "destructive",
        });
        localStorage.removeItem('adminToken');
        // Force refresh to redirect to login
        window.location.href = '/admin';
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les messages",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const markAsResponded = async (id: string) => {
    try {
      const response = await contactApi.markResponded(id);
      
      if (response && response.error) {
        throw new Error(response.message || "Erreur lors du marquage du message");
      }
      
      // Update local state
      setMessages(messages.map(msg => 
        msg._id === id ? { ...msg, responded: true } : msg
      ));
      
      toast({
        title: "Succès",
        description: "Message marqué comme lu",
      });
    } catch (error: any) {
      console.error('Error marking message as responded:', error);
      toast({
        title: "Erreur",
        description: "Impossible de marquer le message comme lu: " + (error.message || "Erreur inconnue"),
        variant: "destructive",
      });
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
      return;
    }

    try {
      const response = await contactApi.deleteMessage(id);
      
      if (response && response.error) {
        throw new Error(response.message || "Erreur lors de la suppression du message");
      }
      
      setMessages(messages.filter(msg => msg._id !== id));
      
      toast({
        title: "Suppression réussie",
        description: "Le message a été supprimé avec succès",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le message: " + (error.message || "Erreur inconnue"),
        variant: "destructive",
      });

      return false;
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return {
    messages,
    isLoading,
    error,
    networkError,
    fetchMessages,
    markAsResponded,
    deleteMessage
  };
};
