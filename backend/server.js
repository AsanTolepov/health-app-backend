// backend/server.js
import express from 'express';
import http from 'http';
import { Server } from "socket.io";
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    // "*" bu hamma joydan kirishga ruxsat beradi. 
    // Xavfsizlik uchun keyinroq buni frontend URLiga o'zgartiramiz.
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
    socket.emit("me", socket.id);

    socket.on('join_chat', (chatRoomId) => {
        socket.join(chatRoomId);
    });

    socket.on('send_message', (data) => {
        socket.to(data.chatRoomId).emit('receive_message', data);
    });

    socket.on("callUser", (data) => {
        io.to(data.userToCall).emit("callUser", { 
            signal: data.signalData, 
            from: data.from, 
            name: data.name 
        });
    });

    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal);
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit("callEnded");
    });
});

// MUHIM: process.env.PORT bu Render beradigan port
const PORT = process.env.PORT || 3001; 
server.listen(PORT, () => {
  console.log(`SERVER ${PORT}-portda ishlamoqda`);
});