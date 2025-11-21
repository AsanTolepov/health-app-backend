// backend/server.js
import express from 'express';
import http from 'http';
import { Server } from "socket.io";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname ni sozlash (ES Module bo'lgani uchun)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// Socket.io mantiqi (O'zgarishsiz qoladi)
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

// --- ENG MUHIM QISM ---

// 1. 'dist' papkasidagi tayyor frontend fayllarini ulash
app.use(express.static(path.join(__dirname, 'dist')));

// 2. Har qanday boshqa so'rov kelganda (masalan /login, /dashboard)
// Frontenddagi index.html ni qaytarish (React Router ishlashi uchun)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// -----------------------

const PORT = process.env.PORT || 3001; 
server.listen(PORT, () => {
  console.log(`SERVER ${PORT}-portda ishlamoqda`);
});