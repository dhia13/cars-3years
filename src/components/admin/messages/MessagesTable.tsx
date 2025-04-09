
import React from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow } from '@/components/ui/table';
import MessageItem from './MessageItem';

interface Message {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  responded: boolean;
}

interface MessagesTableProps {
  messages: Message[];
  onViewMessage: (message: Message) => void;
  onDeleteMessage: (id: string) => void;
}

const MessagesTable = ({ messages, onViewMessage, onDeleteMessage }: MessagesTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12"></TableHead>
          <TableHead>Nom</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Téléphone</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {messages.map((message) => (
          <MessageItem 
            key={message._id}
            message={message}
            onView={onViewMessage}
            onDelete={onDeleteMessage}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default MessagesTable;
