// src/contexts/VideoContext.tsx

import React, { createContext, useState, useRef, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext<any>(null);

// --- DEPLOY UCHUN MUHIM QISM ---
// Agar .env faylda yoki Renderda VITE_BACKEND_URL berilgan bo'lsa o'shani oladi,
// bo'lmasa (lokal kompyuterda) localhost:3001 ni ishlatadi.
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

const socket = io(BACKEND_URL);

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [me, setMe] = useState('');
  const [call, setCall] = useState<any>({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState('');

  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<any>();

  useEffect(() => {
    // Kamera va mikrofonga ruxsat so'rash
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      })
      .catch((err) => console.error("Kameraga ruxsat berilmadi:", err));

    // Serverdan o'z ID sini qabul qilish
    socket.on('me', (id) => setMe(id));

    // Kimdir qo'ng'iroq qilsa eshitish
    socket.on('callUser', ({ from, name: callerName, signal }) => {
      setCall({ isReceivedCall: true, from, name: callerName, signal });
    });
    
    // Tozalash ishlari (Component unmount bo'lganda)
    return () => {
        socket.off('me');
        socket.off('callUser');
    };
  }, []);

  // Qo'ng'iroqqa javob berish
  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream: stream! });

    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: call.from });
    });

    peer.on('stream', (currentStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    peer.signal(call.signal);
    connectionRef.current = peer;
  };

  // Qo'ng'iroq qilish
  const callUser = (id: string) => {
    const peer = new Peer({ initiator: true, trickle: false, stream: stream! });

    peer.on('signal', (data) => {
      socket.emit('callUser', { userToCall: id, signalData: data, from: me, name });
    });

    peer.on('stream', (currentStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  // Qo'ng'iroqni tugatish
  const leaveCall = () => {
    setCallEnded(true);
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    // Qo'ng'iroq tugaganda sahifani yangilash (oddiy va ishonchli usul)
    window.location.reload();
  };

  return (
    <SocketContext.Provider value={{
      call,
      callAccepted,
      myVideo,
      userVideo,
      stream,
      name,
      setName,
      callEnded,
      me,
      callUser,
      leaveCall,
      answerCall,
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useVideoContext = () => useContext(SocketContext);