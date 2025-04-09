
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerFooter 
} from '@/components/ui/drawer';
import { XCircle, Trash } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Message {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  responded: boolean;
}

interface MessageDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  message: Message | null;
  onDelete: (id: string) => void;
}

const MessageDrawer = ({ isOpen, onOpenChange, message, onDelete }: MessageDrawerProps) => {
  if (!message) return null;
  
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Message de {message.name}</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 py-2">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{message.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
              <p>{message.phone || '-'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Date</p>
              <p>
                {message.createdAt && 
                  format(new Date(message.createdAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm font-medium text-muted-foreground">Message</p>
            <div className="mt-2 p-4 bg-muted rounded-md">
              <p className="whitespace-pre-line">{message.message}</p>
            </div>
          </div>
        </div>
        <DrawerFooter>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              <XCircle className="mr-2 h-4 w-4" /> Fermer
            </Button>
            <Button 
              variant="destructive" 
              className="flex-1"
              onClick={() => message && onDelete(message._id)}
            >
              <Trash className="mr-2 h-4 w-4" /> Supprimer
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default MessageDrawer;
