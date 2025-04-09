
import React from 'react';
import { Button } from '@/components/ui/button';
import { TableRow, TableCell } from '@/components/ui/table';
import { Eye, Trash } from 'lucide-react';
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

interface MessageItemProps {
  message: Message;
  onView: (message: Message) => void;
  onDelete: (id: string) => void;
}

const MessageItem = ({ message, onView, onDelete }: MessageItemProps) => {
  return (
    <TableRow 
      className={!message.responded ? "bg-primary/5 font-medium" : ""}
    >
      <TableCell>
        {!message.responded && (
          <div className="w-2 h-2 rounded-full bg-primary"></div>
        )}
      </TableCell>
      <TableCell>{message.name}</TableCell>
      <TableCell>{message.email}</TableCell>
      <TableCell>{message.phone || '-'}</TableCell>
      <TableCell>
        {format(new Date(message.createdAt), 'dd MMM yyyy HH:mm', { locale: fr })}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onView(message)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onDelete(message._id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default MessageItem;
