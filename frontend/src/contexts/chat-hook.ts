import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useAuth } from './auth-context';

// Xabar interfeysi
export interface IMessage {
  chatRoomId: string;
  authorId: string;
  authorName: string;
  text: string;
  time: string;
}

// Socket ulanishini faqat bir marta yaratamiz
const socket = io("http://localhost:3001");

export const useChat = (chatRoomId: string) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    // Agar chat xonasi IDsi mavjud bo'lsa...
    if (chatRoomId && user) {
      // 1. Yangi xabar kelishini tinglash
      const messageListener = (message: IMessage) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      };
      socket.on('receive_message', messageListener);

      // 2. Serverdagi chat xonasiga qo'shilish
      socket.emit('join_chat', chatRoomId);
      
      // 3. Komponent yo'q qilinganda listener'ni o'chirish va xabarlarni tozalash
      return () => {
        socket.off('receive_message', messageListener);
        setMessages([]); // Boshqa chatga o'tganda eski xabarlar ko'rinmasligi uchun
      };
    }
  }, [chatRoomId, user]); 

  // Xabar yuborish funksiyasi
  const sendMessage = (text: string) => {
    if (text.trim() && user && chatRoomId) {
      const messageData: IMessage = {
        chatRoomId: chatRoomId,
        authorId: user.id,
        authorName: user.name,
        text: text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      // Xabarni serverga yuborish
      socket.emit('send_message', messageData);

      // Xabarni o'zimizning ekranda ham darhol ko'rsatish
      setMessages((prevMessages) => [...prevMessages, messageData]);
    }
  };

  return { messages, sendMessage };
};