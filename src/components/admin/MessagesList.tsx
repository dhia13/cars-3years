
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { MessageSquare, RefreshCw, AlertTriangle } from 'lucide-react';
import { useMessages } from '@/hooks/use-messages';

// Import sub-components
import MessagesTable from './messages/MessagesTable';
import MessageDrawer from './messages/MessageDrawer';
import EmptyState from './messages/EmptyState';
import ErrorDisplay from './messages/ErrorDisplay';
import NetworkErrorDisplay from './messages/NetworkErrorDisplay';

interface Message {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  responded: boolean;
}

const MessagesList = () => {
  const { 
    messages, 
    isLoading, 
    error, 
    networkError, 
    fetchMessages, 
    markAsResponded, 
    deleteMessage 
  } = useMessages();

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message);
    setDrawerOpen(true);
    
    // Mark as responded if it's not already
    if (!message.responded) {
      markAsResponded(message._id);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    const success = await deleteMessage(id);
    if (success && selectedMessage?._id === id) {
      setSelectedMessage(null);
      setDrawerOpen(false);
    }
  };

  // Si pas de token, afficher message
  if (!localStorage.getItem('adminToken')) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Messages</h1>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Accès non autorisé</AlertTitle>
          <AlertDescription>
            Vous devez être connecté pour accéder aux messages. 
            <Button variant="link" onClick={() => window.location.href = '/admin'}>
              Se connecter
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Messages</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchMessages} disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                Chargement...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Actualiser
              </>
            )}
          </Button>
          {!isLoading && !error && (
            <Button variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" />
              {messages.filter(m => !m.responded).length} non lus
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Demandes de contact</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mb-4"></div>
              <p>Chargement des messages...</p>
            </div>
          ) : networkError ? (
            <NetworkErrorDisplay onRetry={fetchMessages} />
          ) : error ? (
            <ErrorDisplay error={error} onRetry={fetchMessages} />
          ) : messages.length === 0 ? (
            <EmptyState />
          ) : (
            <MessagesTable 
              messages={messages} 
              onViewMessage={handleViewMessage} 
              onDeleteMessage={handleDeleteMessage} 
            />
          )}
        </CardContent>
      </Card>

      <MessageDrawer 
        isOpen={drawerOpen} 
        onOpenChange={setDrawerOpen} 
        message={selectedMessage} 
        onDelete={handleDeleteMessage} 
      />
    </div>
  );
};

export default MessagesList;
